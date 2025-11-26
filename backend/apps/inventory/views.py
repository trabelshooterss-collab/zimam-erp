
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q, Sum
from .models import Category, Product, StockMovement
from .serializers import CategorySerializer, ProductSerializer, StockMovementSerializer
from .utils import generate_barcode, predict_reorder_points
import csv
import io


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Category model."""

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter categories by company."""
        user = self.request.user
        return Category.objects.filter(company=user.company)

    def perform_create(self, serializer):
        """Set company when creating a category."""
        serializer.save(company=self.request.user.company)


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for Product model."""

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_active', 'is_discontinued']
    search_fields = ['name', 'description', 'sku', 'barcode']
    ordering_fields = ['name', 'current_stock', 'selling_price', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter products by company."""
        user = self.request.user
        return Product.objects.filter(company=user.company)

    def perform_create(self, serializer):
        """Set company when creating a product."""
        serializer.save(company=self.request.user.company)

    @action(detail=True, methods=['post'])
    def update_stock(self, request, pk=None):
        """Update product stock."""
        product = self.get_object()
        quantity = request.data.get('quantity')
        movement_type = request.data.get('movement_type')  # 'in' or 'out'
        notes = request.data.get('notes', '')

        if not quantity or not movement_type:
            return Response(
                {'error': _('Quantity and movement type are required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = int(quantity)

            # Update stock
            if movement_type == 'in':
                product.current_stock += quantity
            elif movement_type == 'out':
                if product.current_stock < quantity:
                    return Response(
                        {'error': _('Insufficient stock')},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                product.current_stock -= quantity
            else:
                return Response(
                    {'error': _('Invalid movement type')},
                    status=status.HTTP_400_BAD_REQUEST
                )

            product.save()

            # Record stock movement
            StockMovement.objects.create(
                product=product,
                movement_type=movement_type,
                quantity=quantity,
                notes=notes,
                created_by=request.user
            )

            return Response({
                'message': _('Stock updated successfully'),
                'current_stock': product.current_stock
            })
        except ValueError:
            return Response(
                {'error': _('Invalid quantity')},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['get'])
    def generate_barcode(self, request, pk=None):
        """Generate barcode for product."""
        product = self.get_object()

        if not product.barcode:
            product.barcode = generate_barcode()
            product.save()

        return Response({
            'barcode': product.barcode,
            'barcode_url': f"/api/inventory/products/{product.id}/barcode-image/"
        })

    @action(detail=True, methods=['get'])
    def barcode_image(self, request, pk=None):
        """Get barcode image for product."""
        product = self.get_object()

        if not product.barcode:
            product.barcode = generate_barcode()
            product.save()

        from barcode import Code128
        from barcode.writer import ImageWriter
        from django.http import HttpResponse

        # Generate barcode
        code = Code128(product.barcode, writer=ImageWriter())
        buffer = io.BytesIO()
        code.write(buffer)

        # Return image
        buffer.seek(0)
        return HttpResponse(buffer.read(), content_type='image/png')

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get products with low stock."""
        user = request.user
        products = Product.objects.filter(
            company=user.company,
            current_stock__lte=models.F('reorder_point')
        )

        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def predict_reorder_points(self, request):
        """Predict reorder points using AI."""
        user = request.user

        # Get products
        products = Product.objects.filter(company=user.company)

        # Predict reorder points
        predictions = predict_reorder_points(products)

        # Update products with predicted reorder points
        for product_id, predicted_point in predictions.items():
            Product.objects.filter(id=product_id).update(
                ai_suggested_reorder_point=predicted_point
            )

        return Response({
            'message': _('Reorder points predicted successfully'),
            'predictions': predictions
        })


class StockMovementViewSet(viewsets.ModelViewSet):
    """ViewSet for StockMovement model."""

    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['product', 'movement_type']
    search_fields = ['product__name', 'notes']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter stock movements by company."""
        user = self.request.user
        return StockMovement.objects.filter(product__company=user.company)


class BulkImportProductsView(APIView):
    """View for bulk importing products."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Bulk import products from CSV."""
        csv_file = request.FILES.get('csv_file')

        if not csv_file:
            return Response(
                {'error': _('CSV file is required')},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not csv_file.name.endswith('.csv'):
            return Response(
                {'error': _('File must be a CSV file')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Read CSV file
            data_set = csv_file.read().decode('UTF-8')
            io_string = io.StringIO(data_set)
            next(io_string)  # Skip header

            # Get or create category
            category_name = request.data.get('category', 'Uncategorized')
            category, created = Category.objects.get_or_create(
                name=category_name,
                company=request.user.company
            )

            # Create products
            products_created = 0
            for column in csv.reader(io_string, delimiter=','):
                if len(column) >= 4:
                    Product.objects.create(
                        company=request.user.company,
                        category=category,
                        name=column[0],
                        sku=column[1],
                        cost_price=float(column[2]),
                        selling_price=float(column[3]),
                        current_stock=int(column[4]) if len(column) > 4 else 0,
                        reorder_point=int(column[5]) if len(column) > 5 else 10
                    )
                    products_created += 1

            return Response({
                'message': _('Products imported successfully'),
                'count': products_created
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ExportProductsView(APIView):
    """View for exporting products."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Export products to CSV."""
        user = request.user
        products = Product.objects.filter(company=user.company)

        # Create CSV response
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="products.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'Name', 'SKU', 'Cost Price', 'Selling Price', 
            'Current Stock', 'Reorder Point', 'Category'
        ])

        for product in products:
            writer.writerow([
                product.name,
                product.sku,
                product.cost_price,
                product.selling_price,
                product.current_stock,
                product.reorder_point,
                product.category.name if product.category else ''
            ])

        return response


class StockAdjustmentView(APIView):
    """View for stock adjustments."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Perform stock adjustment."""
        adjustments = request.data.get('adjustments', [])
        notes = request.data.get('notes', '')

        if not adjustments:
            return Response(
                {'error': _('No adjustments provided')},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Process each adjustment
            for adjustment in adjustments:
                product_id = adjustment.get('product_id')
                new_quantity = adjustment.get('new_quantity')

                if not product_id or new_quantity is None:
                    continue

                try:
                    product = Product.objects.get(
                        id=product_id,
                        company=request.user.company
                    )

                    # Calculate difference
                    difference = new_quantity - product.current_stock

                    # Update stock
                    product.current_stock = new_quantity
                    product.save()

                    # Record stock movement
                    movement_type = 'in' if difference > 0 else 'out'
                    StockMovement.objects.create(
                        product=product,
                        movement_type='adjustment',
                        quantity=abs(difference),
                        notes=notes,
                        created_by=request.user
                    )
                except Product.DoesNotExist:
                    continue

            return Response({
                'message': _('Stock adjusted successfully')
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class LowStockAlertsView(APIView):
    """View for low stock alerts."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get low stock alerts."""
        user = request.user
        products = Product.objects.filter(
            company=user.company,
            current_stock__lte=models.F('reorder_point')
        )

        alerts = []
        for product in products:
            alerts.append({
                'product_id': product.id,
                'product_name': product.name,
                'current_stock': product.current_stock,
                'reorder_point': product.reorder_point,
                'ai_suggested_reorder_point': product.ai_suggested_reorder_point
            })

        return Response(alerts)
