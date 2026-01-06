from rest_framework import serializers
from .models import Category, Product, Cart, CartItem
from .models import Address
from .models import Wishlist, WishlistItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


# class ProductSerializer(serializers.ModelSerializer):
#     category = CategorySerializer(read_only=True)

#     class Meta:
#         model = Product
#         fields = "__all__"


class ProductReadSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"


class ProductWriteSerializer(serializers.ModelSerializer):
    image_url = serializers.CharField(required=False, allow_blank=True)


    class Meta:
        model = Product
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductReadSerializer(read_only=True)

    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "product", "product_id", "quantity"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "items", "total_price"]

    def get_total_price(self, obj):
        return sum(item.product.price * item.quantity for item in obj.items.all())


class WishListItemSerializer(serializers.ModelSerializer):
    product = ProductReadSerializer(read_only=True)

    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = WishlistItem
        fields = [
            "id",
            "product",
            "product_id",
        ]


class WishListSerializer(serializers.ModelSerializer):
    wishlist_items = WishListItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "wishlist_items"]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "address_type",
            "street",
            "city",
            "state",
            "pincode",
            "phone",
            "is_default",
        ]
        read_only_fields = ["id"]
