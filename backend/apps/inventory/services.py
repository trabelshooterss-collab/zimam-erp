from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from .models import Product, InventoryTransaction

class InventoryService:
    """
    Service for handling inventory transactions and Weighted Average Cost (WAC) calculations.
    """

    @staticmethod
    @transaction.atomic
    def process_transaction(product: Product, quantity: Decimal, transaction_type: str, unit_cost: Decimal = None, related_document=None, user=None, notes=None):
        """
        Process an inventory transaction, update stock levels, and recalculate WAC.
        
        Args:
            product: The product instance.
            quantity: The quantity to move (positive for add, negative for remove).
            transaction_type: Type of transaction (purchase, sale, etc.).
            unit_cost: Cost per unit (required for incoming stock).
            related_document: The related model instance (Invoice, PurchaseOrder, etc.).
            user: The user performing the action.
            notes: Optional notes.
        """
        
        # Ensure quantity is Decimal
        quantity = Decimal(str(quantity))
        
        # Current state
        current_stock = product.current_stock
        current_avg_cost = product.average_cost
        
        # Determine if this is an incoming or outgoing transaction
        is_incoming = quantity > 0
        
        # Calculate new Average Cost if incoming
        if is_incoming:
            if unit_cost is None:
                # If no cost provided for incoming, assume current average cost (e.g. transfer)
                # But for Purchases, unit_cost MUST be provided.
                unit_cost = current_avg_cost
            
            unit_cost = Decimal(str(unit_cost))
            
            # WAC Formula: ((Current Stock * Current Avg Cost) + (New Qty * New Cost)) / (Current Stock + New Qty)
            total_value_before = current_stock * current_avg_cost
            new_value_added = quantity * unit_cost
            new_total_stock = current_stock + quantity
            
            if new_total_stock > 0:
                new_avg_cost = (total_value_before + new_value_added) / new_total_stock
                product.average_cost = new_avg_cost
            else:
                # Should not happen for incoming, but safe fallback
                product.average_cost = unit_cost
                
        else:
            # Outgoing (Sale, etc.)
            # Cost is the current average cost
            unit_cost = current_avg_cost
            # Average cost does NOT change on outgoing
        
        # Update Product Stock
        product.current_stock += quantity
        product.last_restocked = timezone.now() if is_incoming else product.last_restocked
        product.save()
        
        # Create Transaction Record
        InventoryTransaction.objects.create(
            product=product,
            transaction_type=transaction_type,
            quantity=quantity,
            unit_cost=unit_cost,
            total_cost=abs(quantity * unit_cost),
            running_balance=product.current_stock,
            related_document=related_document,
            created_by=user,
            notes=notes
        )
        
        # Check for Low Stock and Auto-PO
        if not is_incoming and product.is_low_stock and product.preferred_supplier:
            InventoryService.trigger_auto_procurement(product, user)
            
        return product

    @staticmethod
    def trigger_auto_procurement(product: Product, user=None):
        """
        Check if we need to order more stock and create/update a Draft PO.
        """
        from apps.purchases.models import PurchaseOrder, PurchaseOrderItem
        
        # 1. Check if there are pending orders
        pending_qty = PurchaseOrderItem.objects.filter(
            product=product,
            purchase_order__status__in=['draft', 'sent', 'confirmed']
        ).aggregate(total=models.Sum('quantity'))['total'] or 0
        
        # 2. If Stock + Pending < Reorder Point, we need to order
        if (product.current_stock + pending_qty) <= product.reorder_point:
            # Calculate Order Quantity (Target: 2x Reorder Point or fixed amount)
            # Simple logic: Top up to 3x Reorder Point (to be safe)
            target_stock = product.reorder_point * 3
            order_qty = target_stock - (product.current_stock + pending_qty)
            
            if order_qty <= 0:
                return

            # 3. Find or Create Draft PO for the Supplier
            supplier = product.preferred_supplier
            
            # Look for an open draft PO for this supplier
            draft_po = PurchaseOrder.objects.filter(
                supplier=supplier,
                status='draft',
                company=product.company
            ).first()
            
            if not draft_po:
                # Create new Draft PO
                draft_po = PurchaseOrder.objects.create(
                    company=product.company,
                    supplier=supplier,
                    order_number=f"PO-AUTO-{timezone.now().strftime('%Y%m%d%H%M%S')}",
                    order_date=timezone.now().date(),
                    expected_date=timezone.now().date() + timedelta(days=7),
                    status='draft',
                    subtotal=0,
                    total_amount=0,
                    created_by=user,
                    notes="Auto-generated by Genius ERP based on low stock."
                )
            
            # 4. Add Item to PO
            # Check if item already exists in this Draft PO
            po_item = PurchaseOrderItem.objects.filter(
                purchase_order=draft_po,
                product=product
            ).first()
            
            if po_item:
                po_item.quantity += order_qty
                po_item.total = po_item.quantity * po_item.unit_price
                po_item.save()
            else:
                # Use last cost price or 0
                unit_price = product.cost_price
                PurchaseOrderItem.objects.create(
                    purchase_order=draft_po,
                    product=product,
                    description=product.name,
                    quantity=order_qty,
                    unit_price=unit_price,
                    total=order_qty * unit_price
                )
            
            # Recalculate PO Totals
            InventoryService.recalculate_po_totals(draft_po)

    @staticmethod
    def recalculate_po_totals(purchase_order):
        """Recalculate totals for a Purchase Order."""
        from apps.purchases.models import PurchaseOrderItem
        
        items = PurchaseOrderItem.objects.filter(purchase_order=purchase_order)
        subtotal = sum(item.total for item in items)
        
        purchase_order.subtotal = subtotal
        purchase_order.total_amount = subtotal + purchase_order.tax_amount - purchase_order.discount_amount
        purchase_order.save()

    @staticmethod
    def check_stock_availability(product: Product, quantity_needed: Decimal):
        """Check if enough stock is available."""
        return product.current_stock >= quantity_needed
