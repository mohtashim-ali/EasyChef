from django.contrib import admin
from .models import Recipe, Favorite, Interactions, RecipeIngredient, Ingredient, Comment, ShoppingList, RecipePhoto, RecipeStep, \
RecipeVideo, StepPhoto, Diet, ShoppingListIngredients, ShoppingListRecipes, CommentVideo, CommentPhoto

# Register your models here.
admin.site.register(Recipe)
admin.site.register(Favorite)
admin.site.register(Interactions)
admin.site.register(RecipeIngredient)
admin.site.register(Ingredient)
admin.site.register(Comment)
admin.site.register(CommentPhoto)
admin.site.register(ShoppingList)
admin.site.register(RecipeVideo)
admin.site.register(StepPhoto)
admin.site.register(RecipePhoto)
admin.site.register(RecipeStep)
admin.site.register(Diet)
admin.site.register(ShoppingListIngredients)
admin.site.register(ShoppingListRecipes)
