from recipes.models import Recipe
from recipes.models import Recipe, Favorite, Interactions, ShoppingList, ShoppingListIngredients, Recipe, \
    RecipeIngredient, ShoppingListRecipes, Ingredient, Diet, RecipePhoto, RecipeStep, RecipeVideo, StepPhoto, Comment, \
    CustomUser, CommentPhoto, CommentVideo, StepVideo, Rating
from rest_framework import serializers
from django.db import models
import json


class DietSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diet
        fields = ['diet']


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['ingredient_name']


class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()

    class Meta:
        model = RecipeIngredient
        fields = ['ingredient', 'quantity']


# class CommentVideoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CommentVideo
#         fields = ['video']


# class CommentPhotoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CommentPhoto
#         fields = ['photo']

class CommentVideoSerializer(serializers.ModelSerializer):

    comment = serializers.ReadOnlyField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not hasattr(self, "comment"):
            self.comment = rep.get("comment", None)
        # rep.pop('comment')
        rep.update({'comment': self.comment.id})
        return rep

    def create(self, validated_data):
        if 'video' not in validated_data:
            raise serializers.ValidationError({"detail": "Video is required"})
        return super().create(validated_data)

    class Meta:
        model = CommentVideo
        fields = ['id', 'video', 'comment']


class RecipeCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['id']

class CommentPhotoSerializer(serializers.ModelSerializer):

    comment = serializers.ReadOnlyField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not hasattr(self, "comment"):
            self.comment = rep.get("comment", None)
        # rep.pop('comment')
        rep.update({'comment': self.comment.id})
        return rep

    def create(self, validated_data):
        if 'photo' not in validated_data:
            raise serializers.ValidationError({"detail": "Image is required"})
        return super().create(validated_data)

    class Meta:
        model = CommentPhoto
        fields = ['id','photo', 'comment']

class CommentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'avatar']

class CommentSerializer(serializers.ModelSerializer):
    videos = CommentVideoSerializer(many=True)
    photos = CommentPhotoSerializer(many=True)
    recipe = RecipeCommentSerializer(many=False)
    user = CommentUserSerializer(many=False)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # print(rep)
        self.owner = rep.get("user", None)
        if self.owner:
            rep.pop('user')
            rep.update({'user': self.owner})

            photos = []
            for photo in CommentPhoto.objects.filter(comment=rep["id"]).all().iterator():
                photos.append(CommentPhotoSerializer(photo).data)

            rep.update({"photos": photos})

            videos = []
            for video in CommentVideo.objects.filter(comment=rep["id"]).all().iterator():
                videos.append(CommentVideoSerializer(video).data)

            rep.update({"videos": videos})

            # videos = []
            # for video in RecipeVideo.objects.filter(recipe=rep['id']).all().iterator():
            #     videos.append(RecipeVideoSerializer(video).data)

            # rep.update({"videos": videos})

        return rep

    class Meta:
        model = Comment
        fields = ['id', 'recipe', 'user', 'comment', 'created_at', 'videos', 'photos']


# class RecipeCommentSerializer(serializers.Serializer):
#     """
#     Add Comment Serializer
#     """
#     comment = CommentSerializer(many=True)
#     class Meta:
#         model = Co

class StepPhotoSerializer(serializers.ModelSerializer):
    recipe_step = serializers.ReadOnlyField()
    
    class Meta:
        model = StepPhoto
        fields = ['id','photo', 'recipe_step']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not hasattr(self, "recipe_step"):
            self.recipe_step = rep.get("recipe_step", None)
        # rep.pop('recipe_step')
        rep.update({'recipe_step': self.recipe_step.id})
        return rep
    
    def create(self, validated_data):
        print(validated_data)
        if 'photo' not in validated_data:
            raise serializers.ValidationError({"detail": "Photo is required"})
        return super().create(validated_data)


class StepVideoSerializer(serializers.ModelSerializer):
    recipe_step = serializers.ReadOnlyField()

    class Meta:
        model = StepVideo
        fields = ['id', 'video', 'recipe_step']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not hasattr(self, "recipe_step"):
            self.recipe_step = rep.get("recipe_step", None)
        # rep.pop('recipe_step')
        rep.update({'recipe_step': self.recipe_step.id})
        return rep

    def create(self, validated_data):
        if 'video' not in validated_data:
            raise serializers.ValidationError({"detail": "Video is required"})
        return super().create(validated_data)


class RecipeStepSerializer(serializers.ModelSerializer):
    photos = StepPhotoSerializer(many=True)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # self.owner = rep.get("owner", None)
        # if self.owner:
        #     rep.pop('owner')
        #     rep.update({'owner': self.owner})
        photos = []
        for photo in StepPhoto.objects.filter(recipe_step=rep["id"]).all().iterator():
            photos.append(StepPhotoSerializer(photo).data)

        rep.update({"photos": photos})

        videos = []
        for video in StepVideo.objects.filter(recipe_step=rep['id']).all().iterator():
            videos.append(StepVideoSerializer(video).data)

        rep.update({"videos": videos})

        return rep

    class Meta:
        model = RecipeStep
        fields = ['id', 'description', 'photos', 'order', 'videos']


# class ImageModelSerializer(serializers.ModelSerializer):
#     restaurant = serializers.ReadOnlyField()

#     def to_representation(self, instance):
#         rep = super().to_representation(instance)
#         if not hasattr(self, "restaurant"):
#             self.restaurant = rep.get("restaurant", None)
#         rep.pop('restaurant')
#         rep.update({'restaurant_id': self.restaurant.id})
#         return rep

#     def create(self, validated_data):
#         if 'ref_img' not in validated_data:
#             raise serializers.ValidationError({"detail": "Image is required"})
#         return super().create(validated_data)

#     class Meta:
#         model = ImageModel
#         fields = ['id', 'ref_img', 'restaurant']




class RecipePhotoSerializer(serializers.ModelSerializer):
    recipe = serializers.ReadOnlyField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not hasattr(self, "recipe"):
            self.recipe = rep.get("recipe", None)
        # rep.pop('recipe')
        rep.update({'recipe': self.recipe.id})
        return rep

    def create(self, validated_data):
        if 'image' not in validated_data:
            raise serializers.ValidationError({"detail": "Image is required"})
        return super().create(validated_data)

    class Meta:
        model = RecipePhoto
        fields = ['id','image', 'caption', 'recipe']


class RecipeVideoSerializer(serializers.ModelSerializer):
    recipe = serializers.ReadOnlyField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if not hasattr(self, "recipe"):
            self.recipe = rep.get("recipe", None)
        # rep.pop('recipe')
        rep.update({'recipe': self.recipe.id})
        return rep

    def create(self, validated_data):
        print(validated_data)
        if 'video' not in validated_data:
            raise serializers.ValidationError({"detail": "Video is required"})
        return super().create(validated_data)

    class Meta:
        model = RecipeVideo
        fields = ['id','video', 'caption', "recipe"]


class EditRecipeSerializer(serializers.ModelSerializer):
    """
    Recipe Serializer
    """

    diet = DietSerializer(many=True)
    ingredients = RecipeIngredientSerializer(many=True)
    step = RecipeStepSerializer(many=True)
    photos = RecipePhotoSerializer(many=True)
    videos = RecipeVideoSerializer(many=True)

    class Meta:
        model = Recipe
        fields = ['id', 'name', 'cuisine', 'serving', 'prep_time', 'cooking_time', 'diet',
                  'ingredients', 'step', 'photos', 'videos', 'description']

    def update(self, instance, validated_data):
        new_name = validated_data.pop('name', None)
        new_diets = validated_data.pop('diet', None)
        new_ingredients = validated_data.pop('ingredients', None)
        new_steps = validated_data.pop('step', None)
        new_photos = validated_data.pop('photos', None)
        new_videos = validated_data.pop('videos', None)
        new_cooking_time = validated_data.pop('cooking_time', None)
        new_cuisine = validated_data.pop('cuisine', None)
        new_prep_time = validated_data.pop('prep_time', None)
        new_servings = validated_data.pop('servings', None)
        new_description = validated_data.pop('description', None)

        instance = super().update(instance, validated_data)

        if new_name:
            instance.name = new_name
            instance.save()

        if new_cooking_time:
            instance.cooking_time = new_cooking_time
            instance.save()

        if new_cuisine:
            instance.cuisine = new_cuisine
            instance.save()
        
        if new_description:
            instance.description = new_description
            instance.save()

        if new_prep_time:
            instance.prep_time = new_prep_time
            instance.save()
        if new_servings:
            instance.servings = new_servings
            instance.save()
        if new_diets:
            Diet.objects.filter(recipe=instance).delete()
            for diet_dict in new_diets:
                print(diet_dict)
                diet_value = diet_dict['diet']
                recipe = Recipe.objects.get(id=instance.id)
                new_d = Diet.objects.create(recipe=recipe, diet=diet_value)
                instance.diet.add(new_d)
            instance.save()
                # Diet.objects.filter(recipe=instance).delete()
                # for diet_dict in new_diets:
                #     print(diet_dict)
                #     diet_value = json.loads(diet_dict['diet'])['diet']
                #     recipe = Recipe.objects.get(id=instance.id)
                #     new_d = Diet.objects.create(recipe=recipe, diet=diet_value)
                #     instance.diet.add(new_d)
                # instance.save()
        if new_ingredients:
            RecipeIngredient.objects.filter(recipe=instance).delete()
            for ingredient_data in new_ingredients:
                ingredient_name = ingredient_data['ingredient']['ingredient_name']
                ingredient, created = Ingredient.objects.get_or_create(ingredient_name=ingredient_name)
                RecipeIngredient.objects.create(recipe=instance, ingredient=ingredient,
                                                quantity=ingredient_data['quantity'])
            instance.save()
        if new_steps:
            RecipeStep.objects.filter(recipe=instance).delete()
            order_ = 1
            for step in new_steps:
                description = step.pop('description')
                # order = step.pop('order')
                recipe_step = RecipeStep.objects.create(
                    recipe=instance, description=description, order=order_
                )
                instance.step.add(recipe_step)
                order_ += 1
            instance.save()
        if new_photos:
            print(new_photos)
            print(RecipePhoto.objects.filter(recipe=instance))
            # RecipePhoto.objects.filter(recipe=instance).delete()
            # add photos, will complete later
        # else:
        #     RecipePhoto.objects.filter(recipe=instance).delete()

        if new_videos:
            RecipeVideo.objects.filter(recipe=instance).delete()
            # add videos, will complete later
        else:
            RecipeVideo.objects.filter(recipe=instance).delete()
        instance.save()
        return instance


class RecipeSerializer(serializers.ModelSerializer):
    """
    Recipe Serializer
    """

    diet = DietSerializer(many=True)
    ingredients = RecipeIngredientSerializer(many=True)
    step = RecipeStepSerializer(many=True)
    photos = RecipePhotoSerializer(many=True)
    videos = RecipeVideoSerializer(many=True)
    # prep_time_hours = serializers.IntegerField()
    # prep_time_min = serializers.IntegerField()
    # cooking_time_hours = serializers.IntegerField()
    # cooking_time_min = serializers.IntegerField()

    class Meta:
        model = Recipe
        fields = ['id', 'name', 'cuisine', 'serving', 'prep_time', 'cooking_time', 'ratings', 'current_rating', 'diet',
                  'ingredients', 'step', 'photos', 'videos', "description", "base_recipe"]
        
        # 'cooking_time_min', 'cooking_time_hours', 'prep_time_min', 'prep_time_hours'

    # diets = DietSerializer(many=True)

    # class Meta:
    #     model = Recipe
    #     fields = ['id', 'name', 'cuisine', 'serving', 'prep_time', 'cooking_time',
    #               'ratings', 'current_rating', 'diets']


class RecipeOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'username', 'avatar']

class FavoriteSerializer(serializers.ModelSerializer):
    recipe = RecipeSerializer()

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'recipe']

# class FavoriteSerializer(serializers.ModelSerializer):
#     user = CommentUserSerializer()

#     class Meta:
#         model = Favorite
#         fields = ['id', 'user', 'recipe']
class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('user', 'rating')

class RecipeInfoSerializer(serializers.ModelSerializer):
    """
    Recipe Serializer
    """
    diet = DietSerializer(many=True)
    ingredients = RecipeIngredientSerializer(many=True)
    step = RecipeStepSerializer(many=True)
    photos = RecipePhotoSerializer(many=True)
    videos = RecipeVideoSerializer(many=True)
    comments = CommentSerializer(many=True)
    owner = RecipeOwnerSerializer(many=False)
    likes_count = serializers.SerializerMethodField()
    base_recipe = RecipeSerializer(many=False)
    favorites = serializers.SerializerMethodField()
    ratingss = RatingSerializer(many=True, read_only=True)

    def get_favorites(self, obj):
        return obj.favorites.all().values_list('user__id', flat=True)

    def get_likes_count(self, obj):
        return obj.likes.count()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        self.owner = rep.get("owner", None)
        if self.owner:
            rep.pop('owner')
            rep.update({'owner': self.owner})

            photos = []
            for photo in RecipePhoto.objects.filter(recipe=rep["id"]).all().iterator():
                photos.append(RecipePhotoSerializer(photo).data)

            rep.update({"photos": photos})

            videos = []
            for video in RecipeVideo.objects.filter(recipe=rep['id']).all().iterator():
                videos.append(RecipeVideoSerializer(video).data)

            rep.update({"videos": videos})

        return rep

    class Meta:
        model = Recipe
        fields = ['id', 'owner', 'name', 'description', 'cuisine', 'serving', 'prep_time', 'cooking_time', 'ratings',
                  'current_rating', 'diet',
                  'ingredients', 'step', 'photos', 'videos', 'comments', 'base_recipe', 'likes_count', 'likes', 'favorites', 'ratingss']


class AddRatingSerializer(serializers.Serializer):
    """
    Add Rating Serializer
    """
    rating = serializers.IntegerField(min_value=0, max_value=5)


class MarkFavoriteSerializer(serializers.Serializer):
    """
    Add Rating Serializer
    """
    favorite = serializers.BooleanField(default=0)


# class FavoriteSerializer(serializers.ModelSerializer):
#     recipe = RecipeSerializer()

#     class Meta:
#         model = Favorite
#         fields = ['id', 'user', 'recipe']


class InteractionsSerializer(serializers.ModelSerializer):
    recipe = RecipeSerializer()

    class Meta:
        model = Interactions
        fields = ['id', 'user', 'recipe']


# class RecipeIngredientSerializer(serializers.ModelSerializer):
#     recipe = RecipeSerializer()

#     class Meta:
#         model = RecipeIngredient
#         fields = ['id', 'recipe', 'ingredient', 'quantity']


class ShoppingListRecipeSerializer(serializers.ModelSerializer):
    recipe = RecipeSerializer()

    class Meta:
        model = ShoppingListRecipes
        fields = ['id', 'shopping_list', 'recipe', 'servings']


class ShoppingListIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()

    class Meta:
        model = ShoppingListIngredients
        fields = ["id", "shopping_list", "ingredient", "quantity"]


class ShoppingListSerializer(serializers.ModelSerializer):
    recipes = ShoppingListRecipeSerializer(many=True)
    ingredients = ShoppingListIngredientSerializer(many=True)

    class Meta:
        model = ShoppingList
        fields = ['id', 'owner', 'recipes', 'ingredients']


class ShoppingListIngredientFilterRecipeInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ["id", "name", "base_recipe"]


class ShoppingListIngredientFilterSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()
    recipe = ShoppingListIngredientFilterRecipeInfoSerializer()

    class Meta:
        model = RecipeIngredient
        fields = ["id", "recipe", "ingredient", "quantity"]
