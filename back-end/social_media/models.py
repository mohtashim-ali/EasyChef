from django.db import models
from recipes.models import Recipe
from accounts.models import CustomUser

# Create your models here.

class MyFavorites(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    recipes = models.ManyToManyField(Recipe)

# need models related to social media
# -> Reviews
# -> Likes
# -> Comment
# -> ...