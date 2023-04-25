from django.shortcuts import render

# Create your views here.
# from django.contrib.auth.models import User
from .models import CustomUser
from .serializers import RegisterSerializer, EditProfileSerializer
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import CustomUser
from rest_framework.generics import RetrieveAPIView, get_object_or_404, UpdateAPIView, DestroyAPIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate
from rest_framework import status



# @api_view(['POST'])
# @permission_classes([AllowAny])
class RegisterView(generics.CreateAPIView):
    """
    Registers a User
    """
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class ProfileUpdateView(generics.UpdateAPIView):
    """
    Updates a user Profile
    """
    queryset = CustomUser.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = EditProfileSerializer
    http_method_names = ["patch"]

    def update(self, request, *args, **kwargs):
        self.kwargs["pk"] = self.request.user.id # ensures that users can only update their own information.
        print(self.request.data)
        password = self.request.data.get('password', '')
        password2 = self.request.data.get('password2', '')
        if (password == password2 and password != '' and password2 != ''):
            self.request.user.set_password(password)
            self.request.user.save()
            refresh = RefreshToken.for_user(self.request.user)
            response = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response(response, status=status.HTTP_200_OK)
        return super().update(request, *args, **kwargs)


class ProfileView(generics.RetrieveAPIView):
    """
    View your Profile
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = EditProfileSerializer

    def get_object(self):
        return get_object_or_404(CustomUser, id=self.request.user.id)


