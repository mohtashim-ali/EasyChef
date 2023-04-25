from rest_framework.permissions import AllowAny
from django.http import Http404, JsonResponse
from rest_framework import status, generics, filters
from rest_framework.generics import get_object_or_404, ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
import json
from rest_framework.views import APIView
from rest_framework.response import Response

from recipes.models import Favorite, Comment, RecipeIngredient, Ingredient, Interactions, Diet, RecipeStep, StepPhoto, \
    RecipePhoto, RecipeVideo, ShoppingListRecipes, ShoppingListIngredients
from recipes import serializers
from recipes.models import Recipe, CustomUser, Recipe, ShoppingList, Interactions
from recipes.serializers import RecipeSerializer, FavoriteSerializer, InteractionsSerializer, RecipeIngredientSerializer, ShoppingListSerializer, \
    RecipeInfoSerializer, EditRecipeSerializer, ShoppingListIngredientSerializer, ShoppingListIngredientFilterSerializer, ShoppingListRecipeSerializer
from rest_framework import filters
from django.db.models import Count, Avg, F, Value, FloatField
from recipes.serializers import RecipeSerializer, FavoriteSerializer, InteractionsSerializer

from rest_framework.generics import get_object_or_404, UpdateAPIView, ListAPIView, RetrieveAPIView, RetrieveUpdateAPIView, DestroyAPIView

from django.contrib.auth.models import AnonymousUser

from recipes.permissions import IsRecipeCreator

import copy


class ViewShoppingList(RetrieveAPIView):
    serializer_class = ShoppingListSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(ShoppingList, owner=self.request.user)

    def get(self, request, *args, **kwargs):
        shopping_list = self.get_object()
        serializer = self.get_serializer(shopping_list)
        return Response(serializer.data)


class AddToShoppingList(APIView):
    def post(self, request, *args, **kwargs):
        try:
            shopping_list = get_object_or_404(ShoppingList, owner=request.user)
        except Http404:
            return JsonResponse({"detail": "Shopping List does not exists"}, status=404)

        try:
            recipe = get_object_or_404(Recipe, id=self.kwargs['id'])
        except Http404:
            return JsonResponse({"detail": "Recipe does not exists"}, status=404)

        if ShoppingListRecipes.objects.filter(shopping_list=shopping_list, recipe=recipe).exists():
            return Response({'message': 'Recipe already in shopping list.'})
        
        servings = self.kwargs['servings']
        shopping_list_recipe = ShoppingListRecipes.objects.create(
            shopping_list=shopping_list,
            recipe=recipe,
            servings=servings
        )

        shopping_list_recipe.save()


        for ingredient in recipe.ingredients.all():
            try:

                shopping_list_ingredient = ShoppingListIngredients.objects.get(
                    shopping_list=shopping_list,
                    ingredient__ingredient_name=ingredient.ingredient.ingredient_name
                )

                print(int(ingredient.quantity))
                print(shopping_list_ingredient.quantity)
                shopping_list_ingredient.quantity += int(ingredient.quantity) * servings
                print(shopping_list_ingredient.quantity)
                shopping_list_ingredient.save()
            except ShoppingListIngredients.DoesNotExist:
                print(ingredient.quantity)
                print(servings)
                ing = ShoppingListIngredients.objects.create(
                    shopping_list=shopping_list,
                    ingredient=Ingredient.objects.get(ingredient_name=ingredient.ingredient.ingredient_name),
                    quantity=type(ingredient.quantity)(int(ingredient.quantity) * servings)
                )
                print(ing.quantity)
                ing.save()

        return Response({'message': 'Recipe added to shopping list.'})
    

class RemoveFromShoppingList(UpdateAPIView):
    def post(self, request, *args, **kwargs):
        try:
            shopping_list = get_object_or_404(ShoppingList, owner=request.user)
        except Http404:
            return JsonResponse({"detail": "Shopping List does not exist"}, status=404)

        try:
            recipe = get_object_or_404(Recipe, id=self.kwargs['id'])
        except Http404:
            return JsonResponse({"detail": "Recipe does not exist"}, status=404)

        try:
            shopping_list_recipe = ShoppingListRecipes.objects.get(
                shopping_list=shopping_list,
                recipe=recipe
            )
        except ShoppingListRecipes.DoesNotExist:
            return JsonResponse({"detail": "Recipe not in shopping list"}, status=404)

        servings_to_reduce = shopping_list_recipe.servings
        shopping_list_recipe.delete()
        for ingredient in recipe.ingredients.all():
            try:
                shopping_list_ingredient = ShoppingListIngredients.objects.get(
                    shopping_list=shopping_list,
                    ingredient__ingredient_name=ingredient.ingredient.ingredient_name
                )
                quantity = shopping_list_ingredient.quantity - (int(ingredient.quantity) * servings_to_reduce)
                if quantity <= 0:
                    shopping_list_ingredient.delete()
                else:
                    shopping_list_ingredient.quantity = quantity
                    shopping_list_ingredient.save()
            except ShoppingListIngredients.DoesNotExist:
                pass
        
        return Response({'message': 'Recipe removed from shopping list.'})

class ViewRecipeInShoppingList(RetrieveAPIView):
    serializer_class = ShoppingListIngredientFilterSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        shopping_list = get_object_or_404(ShoppingList, owner=self.request.user)
        return shopping_list

    def get(self, request, *args, **kwargs):
        shopping_list = self.get_object()
        recipe_id = self.kwargs.get('id')
        
        try:
            shopping_list_recipe = ShoppingListRecipes.objects.get(
                shopping_list=shopping_list,
                recipe__id=recipe_id
            )
        except ShoppingListRecipes.DoesNotExist:
            return JsonResponse({"detail": "Recipe not in shopping list"}, status=404)
        rec = Recipe.objects.get(id=recipe_id)
        ingredients = RecipeIngredient.objects.filter(
            recipe=rec
        )
        
        serializer = self.get_serializer(ingredients, many=True)
        return Response(serializer.data)


class UpdateServingsInShoppingList(UpdateAPIView):
    serializer_class = ShoppingListRecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        shopping_list = get_object_or_404(ShoppingList, owner=self.request.user)
        recipe_id = self.kwargs.get('id')
        shopping_list_recipe = get_object_or_404(
            ShoppingListRecipes, shopping_list=shopping_list, recipe__id=recipe_id
        )
        return shopping_list_recipe

    def perform_update(self, serializer):
        old_servings = self.get_object().servings
        new_servings = self.kwargs['servings']

        shopping_list_recipe = serializer.save(servings=new_servings)

        recipe = shopping_list_recipe.recipe
        for ingredient in recipe.ingredients.all():
            try:
                shopping_list_ingredient = ShoppingListIngredients.objects.get(
                    shopping_list=shopping_list_recipe.shopping_list,
                    ingredient__ingredient_name=ingredient.ingredient.ingredient_name
                )
                shopping_list_ingredient.quantity -= int(ingredient.quantity) * old_servings
                shopping_list_ingredient.quantity += int(ingredient.quantity) * new_servings
                shopping_list_ingredient.save()
            except ShoppingListIngredients.DoesNotExist:
                quantity = (int(ingredient.quantity) / old_servings) * new_servings
                ShoppingListIngredients.objects.create(
                    shopping_list=shopping_list_recipe.shopping_list,
                    ingredient=Ingredient.objects.get(ingredient_name=ingredient.ingredient.ingredient_name),
                    quantity=quantity
                )
        
        # Obtain the updated shopping list recipe instance and serialize it
        updated_instance = self.get_object()
        serializer_data = self.get_serializer(updated_instance).data

        return JsonResponse(serializer_data)
    


