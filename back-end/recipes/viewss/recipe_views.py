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

