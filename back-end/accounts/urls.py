from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from accounts.views import RegisterView, ProfileUpdateView, ProfileView


urlpatterns = [
    # path('signup/', SignupView.as_view()),
    # path('login/', LoginView.as_view()),
    # path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view()),
    path('edit_profile/', ProfileUpdateView.as_view()),
    path('profile/', ProfileView.as_view()),
    # path('myFavorite/', FavoriteListAPIView.as_view()),
]
