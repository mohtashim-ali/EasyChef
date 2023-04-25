from django.db import models
# from django.contrib.auth.models import User
from django.conf import settings
from accounts.models import CustomUser
from django.utils.translation import gettext_lazy as _
from django.utils import timezone


# Create your models here.

class Recipe(models.Model):
    def get_combined_rating(self):
        """
        Returns the combination of overall rating and the number of users marked the recipe as a favorite.
        """
        num_favorites = Favorite.objects.filter(recipe=self).count()
        return self.current_rating + num_favorites

    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='recipe')

    # (key: value stored in database, value: what the user sees)
    CUISINES = [
        ('american', 'American'),
        ('chinese', 'Chinese'),
        ('french', 'French'),
        ('indian', 'Indian'),
        ('italian', 'Italian'),
        ('japanese', 'Japanese'),
        ('korean', 'Korean'),
        ('mexican', 'Mexican'),
        ('middle_eastern', 'Middle Eastern'),
        ('thai', 'Thai'),
        ('vietnamese', 'Vietnamese'),
    ]

    name = models.CharField(max_length=200)
    cuisine = models.CharField(max_length=20, choices=CUISINES)
    serving = models.PositiveIntegerField(default=1)
    prep_time = models.PositiveIntegerField(default=1)
    cooking_time = models.PositiveIntegerField(default=1)
    base_recipe = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True,
                                    related_name='derived_recipes')
    ratings = models.IntegerField(default=0)
    current_rating = models.FloatField(default=0)
    description = models.TextField(default="", null=True, blank=True)
    likes = models.ManyToManyField(to=CustomUser, related_name="recipe_likes", blank=True)

    def __str__(self):
        return self.name

    def update_ingredient_quantities(self, new_serving_size):
        old_serving_size = self.serving
        factor = new_serving_size / old_serving_size
        for recipe_ingredient in self.ingredients.all():
            if recipe_ingredient.quantity:
                recipe_ingredient.quantity = f"{float(recipe_ingredient.quantity.split()[0]) * factor}"
                # recipe_ingredient.quantity = f"{float(recipe_ingredient.quantity.split()[0]) * factor} {recipe_ingredient.quantity.split()[1]}"
            recipe_ingredient.save()
        self.serving = new_serving_size
        self.save()


class Diet(models.Model):
    DIETS = [
        ('gluten_free', 'Gluten-free'),
        ('keto', 'Keto'),
        ('low_carb', 'Low-carb'),
        ('paleo', 'Paleo'),
        ('vegan', 'Vegan'),
        ('vegetarian', 'Vegetarian'),
    ]
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='diet')
    diet = models.CharField(max_length=20, choices=DIETS)


class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='comment_owner')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='comments')
    comment = models.CharField(max_length=500, null=True)
    created_at = models.DateTimeField(auto_now=True)


class CommentPhoto(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='photos')
    # user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='photo_owner')
    photo = models.ImageField(upload_to='comment/photos/', null=True)


class CommentVideo(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='videos')
    # user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='video_owner')
    video = models.FileField(upload_to='comment/videos/', null=True)


class Ingredient(models.Model):
    ingredient_name = models.CharField(max_length=100)


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.CharField(max_length=100)


class Favorite(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="favorites")


class RecipeStep(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='step')
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)


class StepPhoto(models.Model):
    photo = models.ImageField(upload_to='steps/photo/', null=True, blank=True)
    recipe_step = models.ForeignKey(RecipeStep, on_delete=models.CASCADE, related_name='photos')

class StepVideo(models.Model):
    video = models.FileField(upload_to='steps/videos/')
    recipe_step = models.ForeignKey(RecipeStep, on_delete=models.CASCADE, related_name='videos')


class RecipePhoto(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='photos/')
    caption = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.caption or 'Untitled'


class RecipeVideo(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='videos')
    # url = models.URLField(null=True, blank=True)
    video = models.FileField(upload_to='videos/', default='')

    caption = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.caption or 'Untitled'


class ShoppingList(models.Model):
    owner = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='shopping_list')


class ShoppingListRecipes(models.Model):
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE, related_name='recipes')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    servings = models.PositiveIntegerField(default=1)


class ShoppingListIngredients(models.Model):
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE, related_name='ingredients')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)


class Interactions(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)

class Rating(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ratingss')
    rating = models.PositiveIntegerField(default=0)
