
import random
import string
from django.utils import timezone
from datetime import timedelta
from .models import Product, StockMovement
from apps.sales.models import InvoiceItem
from apps.purchases.models import PurchaseOrderItem


def generate_barcode():
    """Generate a unique barcode."""
    while True:
        barcode = ''.join(random.choices(string.digits, k=13))
        if not Product.objects.filter(barcode=barcode).exists():
            return barcode


def predict_reorder_points(products):
    """Predict reorder points using AI."""
    predictions = {}

    for product in products:
        # Get sales data for the last 3 months
        three_months_ago = timezone.now().date() - timedelta(days=90)
        sales_data = InvoiceItem.objects.filter(
            product=product,
            invoice__date__gte=three_months_ago
        ).aggregate(
            total_quantity=models.Sum('quantity'),
            days_count=models.Count('invoice__date', distinct=True)
        )

        # Get purchases data for the last 3 months
        purchases_data = PurchaseOrderItem.objects.filter(
            product=product,
            purchase_order__order_date__gte=three_months_ago
        ).aggregate(
            total_quantity=models.Sum('quantity'),
            days_count=models.Count('purchase_order__order_date', distinct=True)
        )

        # Calculate average daily consumption
        total_consumed = sales_data['total_quantity'] or 0
        days_with_sales = sales_data['days_count'] or 1
        avg_daily_consumption = total_consumed / days_with_sales

        # Calculate average lead time in days
        # For simplicity, we'll use a fixed lead time of 7 days
        # In a real application, this would be calculated from purchase orders
        avg_lead_time = 7

        # Calculate safety stock (30% of lead time consumption)
        safety_stock = avg_daily_consumption * avg_lead_time * 0.3

        # Calculate reorder point (lead time consumption + safety stock)
        reorder_point = int((avg_daily_consumption * avg_lead_time) + safety_stock)

        # Ensure minimum reorder point of 1
        reorder_point = max(reorder_point, 1)

        predictions[product.id] = reorder_point

    return predictions


def update_stock_on_sale(product, quantity):
    """Update stock when a sale is made."""
    product.current_stock -= quantity
    product.save()

    # Record stock movement
    StockMovement.objects.create(
        product=product,
        movement_type='out',
        quantity=quantity,
        reference='Sale',
        created_at=timezone.now()
    )


def update_stock_on_purchase(product, quantity):
    """Update stock when a purchase is made."""
    product.current_stock += quantity
    product.last_restocked = timezone.now()
    product.save()

    # Record stock movement
    StockMovement.objects.create(
        product=product,
        movement_type='in',
        quantity=quantity,
        reference='Purchase',
        created_at=timezone.now()
    )
