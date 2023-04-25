from rest_framework import permissions
from rest_framework.generics import get_object_or_404
from rest_framework.exceptions import APIException
from rest_framework import status
from . models import Recipe

class IsRecipeCreator(permissions.BasePermission):
    def has_permission(self, request, view):
        if hasattr(view, 'recipe'):
            recipe = get_object_or_404(Recipe, id=view.recipe.id)
            if recipe.owner != request.user:
                raise NotRecipeCreator


        return super().has_permission(request, view)

class NotRecipeCreator(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = {"detail": 'You cannot edit a recipe you do not own'}