from django.db import models
from accounts.models import User


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    SALE_TYPE_CHOICES = [
        ("sale", "Sale"),
        ("bogo", "Buy One Get One"),
        ("donation", "Donation"),
    ]

    CONDITION_CHOICES = [
        ("new", "New"),
        ("like_new", "Like New"),
        ("very_good", "Very Good"),
        ("good", "Good"),
        ("acceptable", "Acceptable"),
    ]

    category = models.ForeignKey(
        Category,
        related_name="products",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)

    type = models.CharField(max_length=20, choices=SALE_TYPE_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)

    image_url = models.URLField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.user.username}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("cart", "product")

    def __str__(self):
        return f"{self.quantity} x {self.product.title} ({self.cart.user.username})"


class Wishlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="wishlist")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Wishlist for {self.user.username}"


class WishlistItem(models.Model):
    wishlist = models.ForeignKey(
        Wishlist, on_delete=models.CASCADE, related_name="wishlist_items"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # This prevents a user from adding the same product twice to their wishlist!
        unique_together = ("wishlist", "product")

    def __str__(self):
        return f"{self.product.title} in {self.wishlist.user.username}'s Wishlist"


class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    address_type = models.CharField(max_length=20, default="home")
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    phone = models.CharField(max_length=15)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"addres {self.user.username}"


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")

    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)

    PAYMENT_METHOD_CHOICES = [
        ("COD", "Cash on Delivery"),
        ("ONLINE", "Online Payment"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("FAILED", "Failed"),
        ("REFUNDED", "Refunded"),
    ]

    payment_method = models.CharField(
        max_length=10, choices=PAYMENT_METHOD_CHOICES, default="COD"
    )

    payment_status = models.CharField(
        max_length=10, choices=PAYMENT_STATUS_CHOICES, default="PENDING"
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("Pending", "Pending"),
            ("Paid", "Paid"),
            ("Shipped", "Shipped"),
            ("Delivered", "Delivered"),
        ],
        default="Pending",
    )

    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.order.user.username}"
