from rest_framework.utils import json
from rest_framework import status
from django.core.management import call_command
from recipes.models import Recipe, Favorite, Comment, Diet, RecipeStep, StepPhoto, RecipePhoto, RecipeVideo, \
    RecipeIngredient, Ingredient, CommentVideo, CommentPhoto
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient, APITestCase


class AddRatingViewTest(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            'testuser',
            'testpass'
        )
        self.recipe = Recipe.objects.create(
            owner_id=self.user.id,
            name="Test Recipe",
            cuisine="Italian"
        )
        self.client.force_authenticate(self.user)

    def test_add_rating(self):
        """
        Add a rating test
        """
        data = {
            "rating": 4
        }
        res = self.client.post(f'/recipes/recipe/{self.recipe.id}/addRating', data=data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        recipe = Recipe.objects.get(id=self.user.id)
        self.assertEqual(recipe.current_rating, 4.0)
        self.assertEqual(recipe.ratings, 1)

    def test_invalid_rating(self):
        """
        Tests an invalid rating
        """
        data = {
            "rating": -1
        }
        res = self.client.post(f'/recipes/recipe/{self.recipe.id}/addRating', data=data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        recipe = Recipe.objects.get(id=self.user.id)
        self.assertEqual(recipe.current_rating, 0)
        self.assertEqual(recipe.ratings, 0)

        data = {
            "rating": 6
        }
        res = self.client.post(f'/recipes/recipe/{self.recipe.id}/addRating', data=data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        recipe = Recipe.objects.get(id=self.user.id)
        self.assertEqual(recipe.current_rating, 0)
        self.assertEqual(recipe.ratings, 0)

    def test_valid_rating(self):
        """
        Compares the updated rating with an actual average of a rating
        """
        data1 = {
            "rating": 5
        }
        data2 = {
            "rating": 4
        }
        data3 = {
            "rating": 3
        }
        data4 = {
            "rating": 2
        }
        res1 = self.client.post(f'/recipes/recipe/{self.recipe.id}/addRating', data=data1)
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        res2 = self.client.post(f'/recipes/recipe/{self.recipe.id}/addRating', data=data2)
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        res3 = self.client.post(f'/recipes/recipe/{self.recipe.id}/addRating', data=data3)
        self.assertEqual(res3.status_code, status.HTTP_200_OK)
        res4 = self.client.post(f'/recipes/recipe/{self.recipe.id}/addRating', data=data4)
        self.assertEqual(res4.status_code, status.HTTP_200_OK)

        recipe = Recipe.objects.get(id=self.user.id)
        actual_average = sum([5, 4, 3, 2]) / 4
        self.assertEqual(recipe.current_rating, actual_average)

    def test_invalid_user(self):
        """
        Tests if the user is not logged in
        """
        self.client.logout()
        res1 = self.client.post(f'/recipes/recipe/{self.recipe.id}/addRating')
        self.assertEqual(res1.status_code, status.HTTP_401_UNAUTHORIZED)

    def tearDown(self) -> None:
        super().tearDown()
        call_command('flush', verbosity=0, interactive=False)


class MarkFavoriteViewTest(APITestCase):
    """
    Tests for Mark Favourite
    """

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            'testuser',
            'testpass'
        )
        self.recipe = Recipe.objects.create(
            owner_id=self.user.id,
            name="Test Recipe",
            cuisine="Italian"
        )
        self.client.force_authenticate(self.user)

    def test_mark_favorite(self):
        """
        Marks a recipe as favourite
        """
        fav_obj_count_before = Favorite.objects.count()
        res = self.client.post(f'/recipes/recipe/{self.recipe.id}/markFavorite', data={"favorite": 1})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        fav_obj_count_after = Favorite.objects.count()
        self.assertEqual(fav_obj_count_before + 1, fav_obj_count_after)
        favorite = Favorite.objects.get(recipe_id=self.recipe.id, user_id=self.user.id)
        self.assertEqual(favorite.recipe, self.recipe)
        self.assertEqual(favorite.user, self.user)

    def test_unmark_favorite(self):
        """
        Unmarks a recipe as favourite
        """
        self.client.post(f'/recipes/recipe/{self.recipe.id}/markFavorite', data={"favorite": 1})
        before_count = Favorite.objects.count()
        res = self.client.post(f'/recipes/recipe/{self.recipe.id}/markFavorite', data={"favorite": 0})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        after_count = Favorite.objects.count()
        self.assertEqual(after_count, before_count - 1)

    def test_invalid_user_favorite(self):
        """
        Test Invalid User
        """
        self.client.logout()
        res = self.client.post(f'/recipes/recipe/{self.recipe.id}/markFavorite', data={"favorite": 1})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def tearDown(self) -> None:
        super().tearDown()
        call_command('flush', verbosity=0, interactive=False)


class CommentViewTest(APITestCase):
    """
    Tests for retrieving and making comments
    """

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            'testuser',
            'testpass'
        )
        self.recipe = Recipe.objects.create(
            owner_id=self.user.id,
            name="Test Recipe",
            cuisine="Italian"
        )
        self.client.force_authenticate(self.user)

    def test_adding_comment(self):
        """
        Adds a comment
        """
        data = {
            "comment": "This recipe is amazing!",
            "video": "something here",
            "photo": "t"
        }
        res = self.client.post(f'/recipes/recipe/{self.recipe.id}/comment', data=data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        comment = Comment.objects.get(recipe_id=self.recipe.id)
        comment_videos = CommentVideo.objects.all()
        comment_photos = CommentPhoto.objects.all()
        self.assertEqual(comment.user_id, self.user.id)
        self.assertEqual(comment.recipe_id, self.recipe.id)
        self.assertEqual(comment.comment, "This recipe is amazing!")

    def test_invalid_user_comment(self):
        """
        Tests invalid user login
        """
        self.client.logout()
        res = self.client.post(f'/recipes/recipe/{self.recipe.id}/comment')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_data(self):
        """
        Tests invalid data
        """
        # Nothing inserted

        data = {
            "comment": 1
        }
        res = self.client.post(f'/recipes/recipe/{self.recipe.id}/comment', data=data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        comment = Comment.objects.get(recipe_id=self.recipe.id)
        self.assertEqual(comment.comment, "1")
        data2 = {
            "comment": ""
        }
        res = self.client.post(f'/recipes/recipe/{self.recipe.id}/comment', data=data2)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def tearDown(self) -> None:
        super().tearDown()
        call_command('flush', verbosity=0, interactive=False)


class PopularRecipeViewTest(APITestCase):
    """
    Tests for retrieving the most popular recipes
    """

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            'testuser',
            'testpass'
        )
        for i in range(0, 21):
            Recipe.objects.create(
                owner_id=self.user.id,
                name="Test Recipe",
                cuisine="Italian",
                current_rating=3.0 + (i / 10)
            )
        self.client.force_authenticate(self.user)

    def test_get_popular_recipes(self):
        """
        Test getting top 15 recipes
        """
        res = self.client.get("/recipes/getPopularRecipes/?page=1")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        res_dict = json.loads(res.content)
        results_list = res_dict["results"]
        self.assertEqual(len(results_list), 15)

    def test_check_popular_recipes(self):
        """
        Test checking that the top 15 recipes are actually the top 15
        """
        res = self.client.get("/recipes/getPopularRecipes/?page=1")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        res_dict = json.loads(res.content)
        results_list = res_dict["results"]
        sorted_list = sorted(results_list, key=lambda x: x["current_rating"], reverse=True)
        for i in range(len(sorted_list) - 1):
            self.assertGreaterEqual(sorted_list[i]["current_rating"],
                                    sorted_list[i + 1]["current_rating"])

    def test_next_recipes(self):
        """
        Tests that there is a next button
        """
        res = self.client.get("/recipes/getPopularRecipes/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        res_dict = json.loads(res.content)
        self.assertIn("next", res_dict)
        self.assertEqual(res_dict["next"], 'http://testserver/recipes/getPopularRecipes/?page_size=2')

    def test_back_recipes(self):
        """
        Tests that there is a back button
        """
        res = self.client.get("/recipes/getPopularRecipes/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        res_dict = json.loads(res.content)
        self.assertIn("previous", res_dict)
        self.assertEqual(res_dict["previous"], None)

    def tearDown(self) -> None:
        super().tearDown()
        call_command('flush', verbosity=0, interactive=False)


class GetRecipeViewTest(APITestCase):
    """
    Tests for getting recipes
    """

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            'testuser',
            'testpass'
        )
        for i in range(0, 30):
            Recipe.objects.create(
                owner_id=self.user.id,
                name="Test Recipe",
                cuisine="Italian",
                current_rating=3.0 + (i / 10)
            )
        self.client.force_authenticate(self.user)

    def test_get_recipes(self):
        """
        Test that gets all recipes
        """
        res = self.client.get("/recipes/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        res_dict = json.loads(res.content)
        results_list = res_dict["results"]
        self.assertEqual(len(results_list), 25)

    def test_next_recipes(self):
        """
        Tests that there is a next button
        """
        res = self.client.get("/recipes/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        res_dict = json.loads(res.content)
        self.assertIn("next", res_dict)
        self.assertEqual(res_dict["next"], 'http://testserver/recipes/?page_size=2')

    def test_back_recipes(self):
        """
        Tests that there is a back button
        """
        res = self.client.get("/recipes/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        res_dict = json.loads(res.content)
        self.assertIn("previous", res_dict)
        self.assertEqual(res_dict["previous"], None)

    def tearDown(self) -> None:
        super().tearDown()
        call_command('flush', verbosity=0, interactive=False)


class CreateRecipeViewTest(APITestCase):
    """
    Tests for creating a Recipe
    """

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            'testuser',
            'testpass'
        )
        self.client.force_authenticate(self.user)

    def test_create_recipe(self):
        """
        Tests creating a recipe
        """
        data = {
            "name": "Test1",
            "cuisine": "american",
            "diet": [
                {
                    "diet": "vegetarian"
                },
                {
                    "diet": "paleo"
                }
            ],
            "serving": 3,
            "prep_time": "00:03:00",
            "cooking_time": "00:05:00",
            "ingredients": [
                {
                    "ingredient": {
                        "ingredient_name": "Cheese"
                    },
                    "quantity": "1"
                }
            ],
            "base_recipe": "5",
            "steps": [{
                "Step 1": {
                    "Description": "??",
                    "Photos": {
                    }
                },
                "Step 2": {
                    "Description": "do",
                    "Photos": {
                        "Photo 1": "",
                        "Photo 2": ""
                    }
                }
            }],
            "photos": [
                {
                    "image": "??",
                    "caption": "test"
                }
            ],
            "videos": [
                {
                    "video": "??",
                    "caption": "test"
                }
            ]
        }

        res = self.client.post("/recipes/create/", data=data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        recipe = Recipe.objects.get(owner=self.user)
        diets = Diet.objects.all().filter(recipe=recipe)
        recipe_step = RecipeStep.objects.all().filter(recipe=recipe)
        step_photos = StepPhoto.objects.all()
        self.assertEqual(recipe.name, "Test1")
        self.assertEqual(recipe.cuisine, "american")
        self.assertEqual(recipe.serving, 3)
        self.assertEqual(recipe.prep_time.total_seconds(), 180)
        self.assertEqual(recipe.cooking_time.total_seconds(), 300)
        self.assertEqual(recipe.ratings, 0)
        self.assertEqual(recipe.current_rating, 0.0)

        self.assertEqual(len(diets), 2)
        self.assertEqual(len(recipe_step), 2)
        self.assertEqual(recipe_step[0].description, "??")
        self.assertEqual(recipe_step[1].description, "do")
        self.assertEqual(recipe_step[0].recipe, recipe)
        self.assertEqual(recipe_step[1].recipe, recipe)
        self.assertEqual(len(step_photos), 2)

        recipe_ingredient = RecipeIngredient.objects.all().filter(recipe=recipe)
        self.assertEqual(len(recipe_ingredient), 2)
        self.assertEqual(recipe_ingredient[0].ingredient.ingredient_name, "Ham")
        self.assertEqual(recipe_ingredient[0].quantity, "6oz")
        self.assertEqual(recipe_ingredient[1].ingredient.ingredient_name, "Turkey")
        self.assertEqual(recipe_ingredient[1].quantity, "12oz")

        ingredients = Ingredient.objects.all()
        self.assertEqual(len(ingredients), 2)
        self.assertEqual(ingredients[0].ingredient_name, "Ham")
        self.assertEqual(ingredients[1].ingredient_name, "Turkey")

        photos = RecipePhoto.objects.all()
        self.assertEqual(len(photos), 2)
        self.assertEqual(photos[0].caption, "dsf")
        self.assertEqual(photos[1].caption, "dsfff")
        self.assertEqual(photos[0].recipe, recipe)
        self.assertEqual(photos[1].recipe, recipe)

        videos = RecipeVideo.objects.all()
        self.assertEqual(len(videos), 1)
        self.assertEqual(videos[0].url, "google.ca")
        self.assertEqual(videos[0].caption, "descrr")
        self.assertEqual(videos[0].recipe, recipe)

    """def tearDown(self) -> None:
        super().tearDown()
        call_command('flush', verbosity=0, interactive=False)"""
