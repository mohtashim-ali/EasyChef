from rest_framework.permissions import AllowAny
from django.http import Http404, JsonResponse
from rest_framework import status, generics, filters
from rest_framework.generics import get_object_or_404, ListAPIView, CreateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
import json
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response

from django.core.files.base import ContentFile

from datetime import timedelta

from recipes.models import Favorite, Comment, RecipeIngredient, Ingredient, Interactions, Diet, RecipeStep, StepPhoto, \
    RecipePhoto, RecipeVideo, ShoppingListRecipes, ShoppingListIngredients, CommentVideo, CommentPhoto, StepVideo, Rating
from recipes import serializers
from recipes.models import Recipe, CustomUser, Recipe, ShoppingList, Interactions
from recipes.serializers import RecipeSerializer, FavoriteSerializer, InteractionsSerializer, \
    RecipeIngredientSerializer, ShoppingListSerializer, \
    RecipeInfoSerializer, EditRecipeSerializer, ShoppingListIngredientSerializer, \
    ShoppingListIngredientFilterSerializer, ShoppingListRecipeSerializer, RecipeStepSerializer, StepPhotoSerializer, \
    StepVideoSerializer, IngredientSerializer
from rest_framework import filters
from django.db.models import Count, Avg, F, Value, FloatField
from recipes.serializers import RecipeSerializer, FavoriteSerializer, InteractionsSerializer, RecipePhotoSerializer, \
    RecipeVideoSerializer, CommentPhotoSerializer, CommentVideoSerializer

from rest_framework.generics import get_object_or_404, UpdateAPIView, ListAPIView, RetrieveAPIView, \
    RetrieveUpdateAPIView, DestroyAPIView

from django.contrib.auth.models import AnonymousUser

from rest_framework.filters import SearchFilter

from .permissions import IsRecipeCreator

from rest_framework import filters

from django_filters import rest_framework as filters1

from django_filters.rest_framework import DjangoFilterBackend

from django.http import HttpResponseRedirect
from django.urls import reverse

import copy


# class AddRatingView(APIView):
#     """
#     Add Rating View
#     """
#     serializer_class = serializers.AddRatingSerializer
#     permission_classes = [IsAuthenticated]

#     def post(self, request, recipe_id):
#         """
#         Updates the rating of a Recipe given a rating number
#         """
#         serializer = self.serializer_class(data=request.data)
#         if serializer.is_valid():
#             rating = serializer.validated_data.get('rating')
#             recipe_obj = get_object_or_404(Recipe, id=recipe_id)
#             num_ratings = recipe_obj.ratings
#             current_rating = recipe_obj.current_rating
#             recipe_obj.current_rating = (
#                                                 current_rating * num_ratings + rating) / (num_ratings + 1)

#             recipe_obj.ratings += 1
#             recipe_obj.save()
#             try:
#                 interaction = Interactions.objects.get(user=request.user, recipe=recipe_obj)
#                 interaction.save()
#             except Interactions.DoesNotExist:
#                 new_inter = Interactions.objects.create(user=request.user, recipe=recipe_obj)
#                 new_inter.save()
#             return Response({"rating": recipe_obj.current_rating,
#                              "total ratings": recipe_obj.ratings})
#         return Response(
#             serializer.errors,
#             status=status.HTTP_400_BAD_REQUEST
#         )

class AddRatingView(APIView):
    """
    Add Rating View
    """
    serializer_class = serializers.AddRatingSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, recipe_id):
        """
        Updates the rating of a Recipe given a rating number
        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # rating = serializer.validated_data.get('rating')
            # recipe_obj = get_object_or_404(Recipe, id=recipe_id)
            # rating_obj, created = Rating.objects.get_or_create(user=request.user, recipe=recipe_obj)
            # if not created:
            #     # If rating already exists for the user, update the rating
            #     recipe_obj.current_rating = ((recipe_obj.current_rating * recipe_obj.ratings) + rating - rating_obj.rating) / recipe_obj.ratings
            #     rating_obj.rating = rating
            #     rating_obj.save()
            # else:
            #     # If rating doesn't exist for the user, create a new rating
            #     rating_obj.rating = rating
            #     recipe_obj.ratings += 1
            #     rating_obj.save()
            #     recipe_obj.save()
            # recipe_obj.current_rating = ((recipe_obj.current_rating * recipe_obj.ratings) + rating) / recipe_obj.ratings
            # recipe_obj.save()
            rating = serializer.validated_data.get('rating')
            recipe_obj = get_object_or_404(Recipe, id=recipe_id)
            rating_obj, created = Rating.objects.get_or_create(user=request.user, recipe=recipe_obj)
            if not created:
                # If rating already exists for the user, update the rating
                old_rating = rating_obj.rating
                rating_obj.rating = rating
                rating_obj.save()
                recipe_obj.current_rating = ((recipe_obj.current_rating * recipe_obj.ratings) - old_rating + rating) / recipe_obj.ratings
            else:
                # If rating doesn't exist for the user, create a new rating
                rating_obj.rating = rating
                rating_obj.save()
                recipe_obj.ratings += 1
                recipe_obj.current_rating = ((recipe_obj.current_rating * (recipe_obj.ratings - 1)) + rating) / recipe_obj.ratings
            recipe_obj.save()
            try:
                interaction = Interactions.objects.get(user=request.user, recipe=recipe_obj)
                interaction.save()
            except Interactions.DoesNotExist:
                new_inter = Interactions.objects.create(user=request.user, recipe=recipe_obj)
                new_inter.save()
            return Response({"rating": recipe_obj.current_rating,
                             "total_ratings": recipe_obj.ratings})
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class MarkFavouriteView(APIView):
    """
    Mark Favourite Recipe View
    """
    serializer_class = serializers.MarkFavoriteSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, recipe_id):
        """
        Generates a Favorite Model using a User and a Recipe and a '0' or '1'
        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            favorite = serializer.validated_data.get('favorite')
            user_obj = get_object_or_404(CustomUser, id=request.user.id)
            recipe_obj = get_object_or_404(Recipe, id=recipe_id)
            favorite_obj, _ = Favorite.objects.get_or_create(
                user=user_obj,
                recipe=recipe_obj
            )
            if favorite == 1:
                favorite_obj.save()
                return Response(
                    {"added as favorite": ""},
                    status=status.HTTP_200_OK
                )
            favorite_obj.delete()
            return Response(
                {"removed from favorite": ""},
                status=status.HTTP_200_OK
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class RecipeCommentView(APIView):
    """
    Comment On A Recipe View
    """
    serializer_class = serializers.RecipeCommentSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, recipe_id):
        """
        Creates a comment model and saves it, references a Recipe and User
        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = request.user
            comment = request.data.get('comment')
            video = request.data.get('video')
            photo = request.data.get('photo')
            if comment == "":
                return Response(status=status.HTTP_400_BAD_REQUEST)
            recipe = get_object_or_404(Recipe, id=recipe_id)
            new_comment = Comment(user=user, recipe=recipe, comment=comment)
            # comment_video = CommentVideo(comment=new_comment, video=video)
            # comment_photo = CommentPhoto(comment=new_comment, photo=photo)
            new_comment.save()
            # comment_video.save()
            # comment_photo.save()
            serializer = self.serializer_class(new_comment)
            try:
                interaction = Interactions.objects.get(user=request.user, recipe=recipe)
                interaction.save()
            except Interactions.DoesNotExist:
                new_inter = Interactions.objects.create(user=request.user, recipe=recipe)
                new_inter.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class RecipeResultPagination(PageNumberPagination):
    """
    Pagination for Recipe Results
    """
    page_size = 6
    page_query_param = 'page'
    max_page_size = 6


class PopularRecipeResultPagination(PageNumberPagination):
    """
    Pagination for Popular Recipe Results
    """
    page_size = 6
    page_query_param = 'page_size'
    max_page_size = 6


class PopularRecipeView(ListAPIView):
    """
    Popular Recipes View
    """
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PopularRecipeResultPagination

    def get_queryset(self):
        """
        Retrieves the Recipe objects by current rating in descending order with pagination
        """
        return Recipe.objects.order_by('-current_rating').all()


class DynamicSearchFilter(filters.SearchFilter):
    """
    Search Filter
    """

    def get_search_fields(self, view, request):
        print('get_search_fields called')
        return request.GET.getlist('search_fields', [])


class AllRecipeView(ListAPIView):
    """
    All Recipes View
    """
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = RecipeResultPagination
    search_fields = ['name', 'owner__username']
    filter_backends = (DynamicSearchFilter,)
    queryset = Recipe.objects.annotate(
        favorite_count=Count('favorites'),
        overall_rating=Avg('ratings'),
        sort_order=F('favorite_count') + F('overall_rating')
    ).order_by('-sort_order')

class RecipeFilter(filters1.FilterSet):
    cuisine = filters1.CharFilter(field_name='cuisine', lookup_expr='exact')
    diet__diet = filters1.CharFilter(field_name='diet__diet', lookup_expr='exact')
    cooking_time = filters1.NumberFilter(field_name='cooking_time', lookup_expr='exact')

    class Meta:
        model = Recipe
        fields = ['cuisine', 'diet__diet', 'cooking_time']

# class RecipeSearchView(ListAPIView):
#     """
#     Search recipes by name, ingredients, or creator.
#     """
#     serializer_class = RecipeSerializer
#     permission_classes = [IsAuthenticated]
#     pagination_class = RecipeResultPagination
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter]
#     filterset_fields = {'cuisine': ["exact"], 'diet__diet': ["exact"] , 'cooking_time':["exact"]}
#     # filterset_fields = RecipeFilter()
#     search_fields = ['name', 'ingredients__ingredient__ingredient_name', 'owner__username']

#     def get_queryset(self):
#         queryset = Recipe.objects.all()
#         search_query = self.request.GET.get('search', None)
#         if search_query:
#             queryset = queryset.filter(Q(name__icontains=search_query) |
#                                        Q(ingredients__ingredient__ingredient_name__icontains=search_query) |
#                                        Q(owner__username__icontains=search_query)).distinct()
#         return queryset

# class RecipeSearchView(ListAPIView):
#     """
#     Search recipes by name, ingredients, or creator.
#     """
#     serializer_class = RecipeSerializer
#     permission_classes = [IsAuthenticated]
#     pagination_class = RecipeResultPagination
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter]
#     filterset_fields = ['cuisine', 'diet__diet', 'cooking_time']
#     search_fields = ['name', 'ingredients__ingredient__ingredient_name', 'owner__username']

#     def get_queryset(self):
#         queryset = Recipe.objects.all()
#         search_query = self.request.GET.get('search', None)
#         # search_query = self.request.GET.get('search', None)
#         ingredients = self.request.GET.getlist('ingredients', [])
#         if search_query or ingredients:
#             queryset = queryset.filter(
#                 Q(name__icontains=search_query) |
#                 Q(owner__username__icontains=search_query) |
#                 Q(ingredients__ingredient__ingredient_name__icontains=search_query) |
#                 Q(ingredients__ingredient__ingredient_name__in=ingredients)
#             ).distinct()
#         # if search_query:
#         #     queryset = queryset.filter(Q(name__icontains=search_query) |
#         #                                Q(ingredients__ingredient__ingredient_name__icontains=search_query) |
#         #                                Q(owner__username__icontains=search_query)).distinct()

#         # Get the diet filter value from the request query parameters
#         diet_filter = self.request.GET.get('diet', None)
#         if diet_filter:
#             queryset = queryset.filter(diet__diet=diet_filter)

#         return queryset

class RecipeSearchView(ListAPIView):
    """
    Search recipes by name, ingredients, or creator.
    """
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = RecipeResultPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['cuisine', 'diet__diet', 'cooking_time']
    search_fields = ['name', 'ingredients__ingredient__ingredient_name', 'owner__username']

    def get_queryset(self):
        queryset = Recipe.objects.all()
        search_query = self.request.GET.getlist('name', [])
        creator_query = self.request.GET.getlist('creator', [])
        ingredient_query = self.request.GET.getlist('ingredients', [])
        if search_query or creator_query or ingredient_query:
            name_q = Q()
            for name in search_query:
                name_q |= Q(name__icontains=name)
            creator_q = Q()
            for creator in creator_query:
                creator_q |= Q(owner__username__icontains=creator)
            ingredient_q = Q()
            for ingredient in ingredient_query:
                ingredient_q |= Q(ingredients__ingredient__ingredient_name__icontains=ingredient)

            queryset = queryset.filter(name_q | creator_q | ingredient_q).distinct()

        # Get the diet filter value from the request query parameters
        diet_filter = self.request.GET.get('diet', None)
        if diet_filter:
            queryset = queryset.filter(diet__diet=diet_filter)
        
        queryset = queryset.annotate(
            sort_metric=0.4 * F('current_rating') +
                        0.3 * Avg('current_rating') +
                        0.3 * Count('favorites')
        ).order_by('-sort_metric')

        return queryset


class IngredientSearchView(ListAPIView):
    """
    All Recipes View
    """
    serializer_class = IngredientSerializer
    permission_classes = [AllowAny]
    pagination_class = RecipeResultPagination
    search_fields = ['ingredient_name']
    # filter_backends = [DynamicSearchFilter]
    filter_backends = [SearchFilter]
    queryset = Ingredient.objects.all()

    # def list(self, request, *args, **kwargs):
    #     queryset = self.filter_queryset(self.get_queryset())
    #     print(queryset)  # add this line
    #     serializer = self.get_serializer(queryset, many=True)
    #     return self.get_paginated_response(serializer.data)


# class CreateRecipeView(APIView):
#     """
#     Create A Recipe View
#     """
#     serializer_class = RecipeSerializer
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         """
#         Creates a Recipe object and saves it
#         """
#         serializer = self.serializer_class(data=request.data)
#         if serializer.is_valid():
#             user = request.user
#             recipe = serializer.save(owner=user)

#             # Save photos
#             photos_data = request.data.get('photos', [])
#             for photo_data in photos_data:
#                 RecipePhoto.objects.create(
#                     recipe=recipe,
#                     image=photo_data.get('image'),
#                     caption=photo_data.get('caption')
#                 )

#             # Save videos
#             videos_data = request.data.get('videos', [])
#             for video_data in videos_data:
#                 RecipeVideo.objects.create(
#                     recipe=recipe,
#                     url=video_data.get('url'),
#                     caption=video_data.get('caption')
#                 )

#             # Save recipe steps and step photos
#             steps_data = request.data.get('step', [])
#             for step_data in steps_data:
#                 photos_data = step_data.pop('photos', [])
#                 recipe_step = RecipeStep.objects.create(recipe=recipe, **step_data)
#                 for photo_data in photos_data:
#                     StepPhoto.objects.create(
#                         photo=photo_data.get('photo'),
#                         recipe_step=recipe_step
#                     )

#             # Save diets
#             diets_data = request.data.get('diet', [])
#             for diet_data in diets_data:
#                 Diet.objects.create(
#                     recipe=recipe,
#                     diets=diet_data.get('diet')
#                 )

#             # Save ingredients
#             ingredients_data = request.data.get('ingredients', [])
#             for ingredient_data in ingredients_data:
#                 ingredient_name = ingredient_data.get('ingredient').get('ingredient_name')
#                 ingredient, created = Ingredient.objects.get_or_create(ingredient_name=ingredient_name)
#                 RecipeIngredient.objects.create(
#                     recipe=recipe,
#                     ingredient=ingredient,
#                     quantity=ingredient_data.get('quantity')
#                 )

#             serializer = self.serializer_class(recipe)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         return Response(
#             serializer.errors,
#             status=status.HTTP_400_BAD_REQUEST
#         )


class CreateRecipeView(APIView):
    """
    Create A Recipe View
    """
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Creates a Recipe object and saves it
        """
        prep_time_hours = request.data.pop('prep_time_hours', 0)
        prep_time_min = request.data.pop('prep_time_min', 0)
        cooking_time_hours = request.data.pop('cooking_time_hours', 0)
        cooking_time_min = request.data.pop('cooking_time_min', 0)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = request.user
            name = serializer.validated_data.get('name')
            cuisine = serializer.validated_data.get('cuisine')
            serving = serializer.validated_data.get('serving')
            base_recipe = serializer.validated_data.get('base_recipe')
            description = serializer.validated_data.get('description')
            print(base_recipe)
            # print(prep_time_hours, prep_time_min)
            # print(cooking_time_hours, cooking_time_min)
            recipe = Recipe.objects.create(
                owner=user,
                name=name,
                cuisine=cuisine,
                serving=serving,
                description = description,
                prep_time=prep_time_min,
                cooking_time=cooking_time_min,
                base_recipe=base_recipe
            )
            photos = json.loads(str(request.data.get('photos')).replace("'", '"'))
            # photos = photos[0]
            for photo in photos:
                RecipePhoto.objects.create(
                    recipe=recipe,
                    image=photo["photo"]["image"],
                    caption=photo["photo"]["caption"]
                )
            videos = json.loads(str(request.data.get('videos')).replace("'", '"'))
            # videos = videos[0]
            for video in videos:
                RecipeVideo.objects.create(
                    recipe=recipe,
                    video=video["video"],
                    caption=video["caption"]
                )
            steps = json.loads(str(request.data.get('step')).replace("'", '"'))
            # steps = steps[0]
            order = 1
            for step in steps:
                print(step)
                desc = step['description']
                # photos = step['photos']
                recipe_step = RecipeStep.objects.create(
                    recipe=recipe,
                    description=desc,
                    order=order
                )
                # for photo in photos:
                #     StepPhoto.objects.create(
                #         photo=photo,
                #         recipe_step=recipe_step
                #     )
                recipe_step.save()
                order += 1

            diets = json.loads(str(request.data.get('diet')).replace("'", '"'))
            # diets = diets[0]
            for diet in diets:
                d = diet["diet"]
                Diet.objects.create(
                    recipe=recipe,
                    diet=d
                )
            ingredients = json.loads(str(request.data.get('ingredients')).replace("'", '"'))
            # ingredients = ingredients[0]
            for ingredient in ingredients:
                ingredient_name = ingredient["ingredient"]["ingredient_name"]
                ingredient_quantity = ingredient["quantity"]

                t, created = Ingredient.objects.get_or_create(
                    ingredient_name=ingredient_name
                )
                RecipeIngredient.objects.create(
                    recipe=recipe,
                    ingredient=t,
                    quantity=ingredient_quantity
                )
            recipe.save()
            try:
                interaction = Interactions.objects.get(user=request.user, recipe=recipe)
                interaction.save()
            except Interactions.DoesNotExist:
                new_inter = Interactions.objects.create(user=request.user, recipe=recipe)
                new_inter.save()
            serializer = self.serializer_class(recipe)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class LargeResultsSetPagination(PageNumberPagination):
    """
    Large Pagination Size
    """
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 10000


class StandardResultsSetPagination(PageNumberPagination):
    """
    Standard Pagination Size
    """
    page_size = 3
    page_size_query_param = 'page_size'
    max_page_size = 1000


class FavoriteListAPIView(generics.ListAPIView):
    """
    My Favorites View
    """
    serializer_class = FavoriteSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Retrieves Favorite Recipes
        """
        return Favorite.objects.filter(user=self.request.user)


class MyHistoryListAPIView(generics.ListAPIView):
    """
    My History View
    """
    serializer_class = InteractionsSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Retrieves Interactions Between Recipes
        """
        return Interactions.objects.filter(user=self.request.user)


class ViewShoppingList(RetrieveAPIView):
    serializer_class = ShoppingListSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(ShoppingList, owner=self.request.user)

    def get(self, request, *args, **kwargs):
        """
        Gets Shopping List
        """
        shopping_list = self.get_object()
        serializer = self.get_serializer(shopping_list)
        return Response(serializer.data)


class RecipeInfo(RetrieveAPIView):
    """
    Gets information of a Recipe
    """
    serializer_class = RecipeInfoSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        """
        Gets information of Recipe
        """
        try:
            self.recipe = get_object_or_404(Recipe, id=self.kwargs["id"])
        except Http404:
            return JsonResponse({"detail": "Recipe does not exist"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def get_object(self):
        return self.recipe

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        # if not isinstance(request.user, AnonymousUser):
        #     try:
        #         interaction = Interactions.objects.get(user=request.user, recipe=self.recipe)
        #         interaction.save()
        #     except Interactions.DoesNotExist:
        #         new_inter = Interactions.objects.create(user=request.user, recipe=self.recipe)
        #         new_inter.save()
        return Response(serializer.data)


class AddToShoppingList(APIView):
    """
    Adds a Recipe to a shopping list
    """
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


class EditRecipe(UpdateAPIView):
    """
    Edits a Recipe
    """
    lookup_field = 'id'
    queryset = Recipe.objects.all()
    serializer_class = EditRecipeSerializer
    permission_classes = [IsAuthenticated, IsRecipeCreator]
    http_method_names = ["patch"]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.recipe = get_object_or_404(
                Recipe, id=self.kwargs['id'])
        except Http404:
            return JsonResponse({"detail": "Recipe not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)


class MyRecipes(ListAPIView):
    """
    Views My Recipes (Created by Me)
    """
    serializer_class = RecipeSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Recipe.objects.filter(owner=self.request.user)


class DeleteRecipe(APIView):
    """
    Deletes a Recipe
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        recipe = get_object_or_404(Recipe, id=id)
        if recipe.owner != request.user:
            return JsonResponse({"detail": "You cannot delete a Recipe you do not own"}, status=403)

        for shopping_list_recipe in recipe.shoppinglistrecipes_set.all():
            shopping_list = shopping_list_recipe.shopping_list
            for ingredient in recipe.ingredients.all():
                try:
                    shopping_list_ingredient = ShoppingListIngredients.objects.get(
                        shopping_list=shopping_list,
                        ingredient__ingredient_name=ingredient.ingredient.ingredient_name
                    )
                    quantity = shopping_list_ingredient.quantity - int(ingredient.quantity)
                    if quantity <= 0:
                        shopping_list_ingredient.delete()
                    else:
                        shopping_list_ingredient.quantity = quantity
                        shopping_list_ingredient.save()
                except ShoppingListIngredients.DoesNotExist:
                    pass

            shopping_list_recipe.delete()

        recipe.delete()

        return JsonResponse({"detail": "Recipe successfully deleted"})


class RemoveFromShoppingList(UpdateAPIView):
    """
    Removes a Recipe from Shopping List
    """
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
    """
    Filters Ingredients List in Shopping List By Recipe ID
    """
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


class UpdateRecipeServings(RecipeInfo):
    """
    View Different Servings of a Recipe
    """
    serializer_class = RecipeInfoSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        recipe = self.get_object()
        recipe_copy = copy.deepcopy(recipe)
        recipe_copy.id = None
        recipe_copy.save()

        for diet in recipe.diet.all():
            Diet.objects.create(recipe=recipe_copy, diet=diet.diet)

        for comment in recipe.comments.all():
            Comment.objects.create(recipe=recipe_copy, user=comment.user, comment=comment.comment)

        for photo in recipe.photos.all():
            RecipePhoto.objects.create(recipe=recipe_copy, image=photo.image, caption=photo.caption)

        for video in recipe.videos.all():
            RecipeVideo.objects.create(recipe=recipe_copy, url=video.url, caption=video.caption)

        servings = self.kwargs['servings']

        for ingredient in recipe.ingredients.all():
            RecipeIngredient.objects.create(recipe=recipe_copy, ingredient=ingredient.ingredient,
                                            quantity=ingredient.quantity)

        if not isinstance(servings, int):
            return JsonResponse({"detail": "Please input an integer value for the servings"})

        recipe_copy.update_ingredient_quantities(servings)

        serializer = self.get_serializer(recipe_copy)

        del recipe_copy

        return Response(serializer.data)


class UpdateServingsInShoppingList(UpdateAPIView):
    """
    Change Servings of a Recipe In Shopping List
    """
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

class CommentUploadImage(CreateAPIView):
    """
    Upload an Image to a Comment
    """
    queryset = Comment.objects.all()
    serializer_class = CommentPhotoSerializer
    permission_classes = [IsAuthenticated]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.comment = get_object_or_404(Comment, id=self.kwargs['comment_id'])
        except Http404:
            return JsonResponse({"detail": "Comment not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save(comment=self.comment)

class CommentUploadVideo(CreateAPIView):
    """
    Upload a Video to a Comment
    """
    queryset = Comment.objects.all()
    serializer_class = CommentVideoSerializer
    permission_classes = [IsAuthenticated]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.comment = get_object_or_404(Comment, id=self.kwargs['comment_id'])
        except Http404:
            return JsonResponse({"detail": "Comment not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save(comment=self.comment)

class RecipeUploadImage(CreateAPIView):
    """
    Upload an Image to a Recipe
    """
    queryset = Recipe.objects.all()
    serializer_class = RecipePhotoSerializer
    permission_classes = [IsAuthenticated, IsRecipeCreator]
 
    def dispatch(self, request, *args, **kwargs):
        try:
            self.recipe = get_object_or_404(Recipe, id=self.kwargs['recipe_id'])
        except Http404:
            return JsonResponse({"detail": "Recipe not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save(recipe=self.recipe)


class RecipeUploadVideo(CreateAPIView):
    """
    Uploads a Video to a Recipe
    """
    queryset = Recipe.objects.all()
    serializer_class = RecipeVideoSerializer
    permission_classes = [IsAuthenticated, IsRecipeCreator]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.recipe = get_object_or_404(Recipe, id=self.kwargs['recipe_id'])
        except Http404:
            return JsonResponse({"detail": "Recipe not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save(recipe=self.recipe)
    
class FetchRecipePhotos(ListAPIView):

    queryset = RecipePhoto.objects.all()
    serializer_class = RecipePhotoSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        if not (RecipePhoto.objects.filter(recipe = self.kwargs['recipe_id'])):
            return JsonResponse({"detail": "Recipe does not exists"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return RecipePhoto.objects.filter(recipe=self.kwargs['recipe_id'])

class FetchRecipeVidoes(ListAPIView):

    queryset = RecipeVideo.objects.all()
    serializer_class = RecipeVideoSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        if not (RecipeVideo.objects.filter(recipe = self.kwargs['recipe_id'])):
            return JsonResponse({"detail": "Recipe does not exists"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return RecipeVideo.objects.filter(recipe=self.kwargs['recipe_id'])

class DeleteRecipePhoto(DestroyAPIView):
    queryset = RecipePhoto.objects.all()
    serializer_class = RecipePhotoSerializer
    permission_classes = [IsAuthenticated, IsRecipeCreator]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.recipe = get_object_or_404(Recipe, id=self.kwargs['recipe_id'])
        except Http404:
            return JsonResponse({"detail": "Recipe not found"})
        
        return super().dispatch(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        if not RecipePhoto.objects.filter(id=self.kwargs['photo_id'], recipe=self.recipe).exists():
            return JsonResponse({"detail": "Image does not exists"})
        self.kwargs['pk'] = self.kwargs['photo_id']
        return super().destroy(request, *args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        # if response.status_code not in [401, 403, 404]:
        #     return HttpResponseRedirect(reverse("recipeimages", kwargs={'recipe_id': self.recipe.id}))
        if response.status_code == 204:
            return JsonResponse({"detail": "Image Deleted"}, status=200)
        return response

class DeleteRecipeVideo(DestroyAPIView):
    queryset = RecipeVideo.objects.all()
    serializer_class = RecipeVideoSerializer
    permission_classes = [IsAuthenticated, IsRecipeCreator]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.recipe = get_object_or_404(Recipe, id=self.kwargs['recipe_id'])
        except Http404:
            return JsonResponse({"detail": "Recipe not found"})
        
        return super().dispatch(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        if not RecipeVideo.objects.filter(id=self.kwargs['video_id'], recipe=self.recipe).exists():
            return JsonResponse({"detail": "Image does not exists"})
        self.kwargs['pk'] = self.kwargs['video_id']
        return super().destroy(request, *args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        # if response.status_code not in [401, 403, 404]:
        #     return HttpResponseRedirect(reverse("recipeimages", kwargs={'recipe_id': self.recipe.id}))
        if response.status_code == 204:
            return JsonResponse({"detail": "Video Deleted"}, status=200)
        return response


class RecipeStepUploadImage(CreateAPIView):
    """
    Uploads a Image to a Recipe Step
    """
    queryset = RecipeStep.objects.all()
    serializer_class = StepPhotoSerializer
    permission_classes = [IsAuthenticated]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.recipe = get_object_or_404(RecipeStep, id=self.kwargs['step_id'])
        except Http404:
            return JsonResponse({"detail": "Recipe Step not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save(recipe_step=self.recipe)


class RecipeStepUploadVideo(CreateAPIView):
    """
    Upload a Video to a Recipe Step
    """
    queryset = RecipeStep.objects.all()
    serializer_class = StepVideoSerializer
    permission_classes = [IsAuthenticated]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.recipe = get_object_or_404(RecipeStep, id=self.kwargs['step_id'])
        except Http404:
            return JsonResponse({"detail": "Recipe Step not found"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):
        return serializer.save(recipe_step=self.recipe)
    

class FetchRecipeStepPhotos(ListAPIView):

    queryset = StepPhoto.objects.all()
    serializer_class = StepPhotoSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        if not (StepPhoto.objects.filter(step_id = self.kwargs['step_id'])):
            return JsonResponse({"detail": "Step does not exists"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return StepPhoto.objects.filter(step_id=self.kwargs['step_id'])

class FetchRecipeStepVideos(ListAPIView):

    queryset = StepVideo.objects.all()
    serializer_class = StepVideoSerializer
    permission_classes = [AllowAny]

    def dispatch(self, request, *args, **kwargs):
        if not (StepVideo.objects.filter(step_id = self.kwargs['step_id'])):
            return JsonResponse({"detail": "Step does not exists"}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return StepVideo.objects.filter(step_id=self.kwargs['step_id'])


class DeleteRecipeStepVideo(DestroyAPIView):
    queryset = StepVideo.objects.all()
    serializer_class = StepVideoSerializer
    permission_classes = [IsAuthenticated]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.step = get_object_or_404(Recipe, id=self.kwargs['recipe_id'])
        except Http404:
            return JsonResponse({"detail": "Recipe not found"})
        
        return super().dispatch(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        if not RecipeVideo.objects.filter(id=self.kwargs['video_id'], recipe=self.recipe).exists():
            return JsonResponse({"detail": "Image does not exists"})
        self.kwargs['pk'] = self.kwargs['video_id']
        return super().destroy(request, *args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        # if response.status_code not in [401, 403, 404]:
        #     return HttpResponseRedirect(reverse("recipeimages", kwargs={'recipe_id': self.recipe.id}))
        if response.status_code == 204:
            return JsonResponse({"detail": "Video Deleted"}, status=200)
        return response

class DeleteRecipeStepPhoto(DestroyAPIView):
    queryset = StepPhoto.objects.all()
    serializer_class = StepPhotoSerializer
    permission_classes = [IsAuthenticated]

    def dispatch(self, request, *args, **kwargs):
        try:
            self.recipe = get_object_or_404(RecipeStep, id=self.kwargs['step_id'])
        except Http404:
            return JsonResponse({"detail": "Step not found"}, status=404)
        
        return super().dispatch(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        if not StepPhoto.objects.filter(id=self.kwargs['photo_id'], recipe_step=self.recipe).exists():
            return JsonResponse({"detail": "Image does not exists"})
        self.kwargs['pk'] = self.kwargs['photo_id']
        return super().destroy(request, *args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        # if response.status_code not in [401, 403, 404]:
        #     return HttpResponseRedirect(reverse("recipeimages", kwargs={'recipe_id': self.recipe.id}))
        if response.status_code == 204:
            return JsonResponse({"detail": "Image Deleted"}, status=200)
        return response
    


class RecipeLikeView(APIView):
    def post(self, request, recipe_id):
        try:
            recipe = Recipe.objects.get(id=recipe_id)
        except Recipe.DoesNotExist:
            return JsonResponse({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)
        user = request.user
        if recipe.likes.filter(id=user.id).exists():
            try:
                interaction = Interactions.objects.get(user=request.user, recipe=recipe)
                interaction.save()
            except Interactions.DoesNotExist:
                new_inter = Interactions.objects.create(user=request.user, recipe=recipe)
                new_inter.save()
            recipe.likes.remove(user)
            return JsonResponse({"message": "Recipe unliked"}, status=status.HTTP_200_OK)
        else:
            recipe.likes.add(user)
            return JsonResponse({"message": "Recipe liked"}, status=status.HTTP_200_OK)
