import os
import django
import random
from datetime import datetime, timedelta
from decimal import Decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'zimam.settings')
django.setup()

from apps.users.models import User
from apps.sales.models import Customer, SalesOrder, SalesOrderItem
from apps.inventory.models import Product, Category, InventoryTransaction
from apps.companies.models import Company

def create_demo_data():
    print("🌱 Starting demo data generation...")

    # Ensure a company exists
    company, created = Company.objects.get_or_create(
        name="Zimam Motors",
        defaults={'email': "info@zimam.com", 'phone': "0123456789"}
    )

    # 1. Create Categories
    categories = ['Rims', 'Tires', 'Brakes', 'Oil & Fluids', 'Accessories']
    cat_objs = []
    for cat_name in categories:
        cat, _ = Category.objects.get_or_create(name=cat_name, company=company)
        cat_objs.append(cat)
    print(f"✅ Created {len(cat_objs)} categories")

    # 2. Create Products
    products_data = [
        ("Sport Rim 18 inch", "Rims", 4500.00),
        ("Luxury Rim 20 inch", "Rims", 8500.00),
        ("Michelin Pilot Sport", "Tires", 3200.00),
        ("Brembo Brake Pads", "Brakes", 1200.00),
        ("Castrol Edge 5W-40", "Oil & Fluids", 850.00),
        ("LED Headlights Kit", "Accessories", 1500.00),
        ("Carbon Fiber Spoiler", "Accessories", 3500.00),
    ]

    for name, cat_name, price in products_data:
        category = Category.objects.get(name=cat_name)
        Product.objects.get_or_create(
            name=name,
            company=company,
            defaults={
                'sku': f"SKU-{random.randint(1000, 9999)}",
                'category': category,
                'selling_price': price,
                'cost_price': price * 0.7,
                'current_stock': random.randint(10, 100),
                'reorder_point': 10,
                'description': f"High quality {name} for premium cars."
            }
        )
    print(f"✅ Created {len(products_data)} products")

    # 3. Create Customers
    customers_data = [
        ("Ahmed Ali", "01012345678", "ahmed@example.com"),
        ("Mohamed Sarah", "01123456789", "mohamed@example.com"),
        ("Khaled Omar", "01234567890", "khaled@example.com"),
        ("Sara Youssef", "01512345678", "sara@example.com"),
    ]

    for name, phone, email in customers_data:
        Customer.objects.get_or_create(
            phone=phone,
            company=company,
            defaults={
                'name': name,
                'email': email,
                'address': "Cairo, Egypt",
                'loyalty_points': random.randint(0, 500)
            }
        )
    print(f"✅ Created {len(customers_data)} customers")

    # 4. Create Sales Orders (Invoices)
    customers = Customer.objects.all()
    products = Product.objects.all()

    for _ in range(10):  # Create 10 random orders
        customer = random.choice(customers)
        order = SalesOrder.objects.create(
            company=company,
            customer=customer,
            status='completed',
            payment_status='paid',
            total_amount=0, # Will calculate
            date=datetime.now() - timedelta(days=random.randint(0, 30))
        )

        total = 0
        for _ in range(random.randint(1, 3)):
            product = random.choice(products)
            qty = random.randint(1, 4)
            price = product.selling_price
            SalesOrderItem.objects.create(
                order=order,
                product=product,
                quantity=qty,
                unit_price=price,
                total_price=qty * price
            )
            total += qty * price
        
        order.total_amount = total
        order.save()
    
    print("✅ Created 10 sales orders")
    print("🚀 Demo data generation complete!")

if __name__ == '__main__':
    create_demo_data()
