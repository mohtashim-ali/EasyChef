from django.db import models

# from accounts.models import User
from django.contrib.auth.models import AbstractUser


# Create your models here.

class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)


# class CustomUser(AbstractUser):
#     first_name = models.CharField(max_length=30, blank=True)
#     last_name = models.CharField( max_length=150, blank=True)
#     email = models.EmailField(unique=True)
#     avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
#     phone_number = models.CharField(max_length=15, null=True, blank=True)
#     shopping_list = models.ForeignKey('ShoppingList', on_delete=models.CASCADE, null=True, blank=True)
#     favorite_list = ArrayField(models.IntegerField(), blank=True, null=True)
#     history_list = ArrayField(models.IntegerField(), blank=True, null=True)

#     # diets = ArrayField(models.CharField(max_length=50), blank=True)


#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

#     def __str__(self):
#         return self.email


# class ShoppingList(models.Model):
#     # owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
#     recipes = models.ManyToManyField(Recipe, blank=True)

#     def __str__(self):
#         return f"{self.owner}'s Shopping List"

# USER
# SHoppingList
