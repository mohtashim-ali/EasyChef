from django.urls import path
from recipes import views
from recipes.views import FavoriteListAPIView, MyHistoryListAPIView
from . views import RecipeInfo, EditRecipe, MyRecipes, DeleteRecipe, UpdateRecipeServings, \
RecipeUploadImage, ViewShoppingList, AddToShoppingList, RemoveFromShoppingList, ViewRecipeInShoppingList, \
UpdateServingsInShoppingList, RecipeUploadVideo, RecipeStepUploadImage, RecipeStepUploadVideo, \
CommentUploadImage, CommentUploadVideo, FetchRecipePhotos, FetchRecipeStepPhotos, FetchRecipeVidoes, FetchRecipeStepVideos, DeleteRecipePhoto, \
DeleteRecipeStepPhoto, DeleteRecipeStepVideo, DeleteRecipeVideo

# from .viewss.shopping_list_views import ViewShoppingList, AddToShoppingList, RemoveFromShoppingList, ViewRecipeInShoppingList, UpdateServingsInShoppingList

urlpatterns = [
    path("recipe/<int:recipe_id>/addRating", views.AddRatingView.as_view()),
    path("recipe/<int:recipe_id>/markFavorite",
         views.MarkFavouriteView.as_view()),
    path("recipe/<int:recipe_id>/comment", views.RecipeCommentView.as_view()),
    path("getPopularRecipes/", views.PopularRecipeView.as_view()),
    path("create/", views.CreateRecipeView.as_view()),
    path("all/", views.AllRecipeView.as_view()),
#     path("search/", views.AllRecipeView.as_view()),
    path("search/", views.RecipeSearchView.as_view()),
    path("search/ingredient/", views.IngredientSearchView.as_view()),
    path('myFavorite/', FavoriteListAPIView.as_view()),
    path('myHistory/', MyHistoryListAPIView.as_view()),
    path("shoppingList/", ViewShoppingList.as_view()),
    path("addToShoppingList/<int:id>/servings/<int:servings>",
         AddToShoppingList.as_view()),
    path("recipe/info/<int:id>", RecipeInfo.as_view()),
    path("recipe/info/edit/<int:id>", EditRecipe.as_view()),
    path("recipe/info/delete/<int:id>", DeleteRecipe.as_view()),
    path("myRecipe", MyRecipes.as_view()),
    path("removeFromShoppingList/<int:id>", RemoveFromShoppingList.as_view()),
    path("shoppingList/<int:id>", ViewRecipeInShoppingList.as_view()),
    path("recipe/info/<int:id>/servings/<int:servings>",
         UpdateRecipeServings.as_view()),
    path("shoppingList/<int:id>/updateServingsTo/<int:servings>",
         UpdateServingsInShoppingList.as_view()),
    path("uploadImage/<int:recipe_id>", RecipeUploadImage.as_view()),
    path("uploadVideo/<int:recipe_id>", RecipeUploadVideo.as_view()),
    path("uploadImage/step/<int:step_id>", RecipeStepUploadImage.as_view()),
    path("uploadVideo/step/<int:step_id>", RecipeStepUploadVideo.as_view()),
    path("<int:recipe_id>/like/", views.RecipeLikeView.as_view()),
    path("uploadImage/comment/<int:comment_id>", CommentUploadImage.as_view()),
    path("uploadVideo/comment/<int:comment_id>", CommentUploadVideo.as_view()),
    path("FetchAllImage/recipe/<int:recipe_id>", FetchRecipePhotos.as_view(), name="recipeimages"),
    path("DeleteImage/recipe/<int:recipe_id>/image/<int:photo_id>", DeleteRecipePhoto.as_view()),
    path("DeleteVideo/recipe/<int:recipe_id>/video/<int:photo_id>", DeleteRecipeVideo.as_view()),
    path("DeleteImage/step/<int:step_id>/image/<int:photo_id>", DeleteRecipeStepPhoto.as_view()),
    path("DeleteVideo/step/<int:step_id>/video/<int:video_id>", DeleteRecipeStepVideo.as_view())
#     path("FetchAllVideos/recipe/<int:recipe_id>", FetchRecipeVidoes.as_view()),
#     path("FetchAllImage/step/<int:step_id>", FetchRecipeStepPhotos.as_view()),
#     path("FetchAllVideos/step/<int:step_id>", FetchRecipeStepVideos.as_view()),
]
