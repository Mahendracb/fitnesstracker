from django.urls import path
# from . import views
# from .views import RegisterView, UserDetailView, LogoutView, dashboard_stats, recent_activity, progress_summary
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
#     TokenVerifyView,
# )

# app_name = 'users'

# urlpatterns = [
#     path('register/', views.register_user, name='register'),
#     path('register/', RegisterView.as_view(), name='register'),
#     path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
#     path('logout/', LogoutView.as_view(), name='logout'),
#     path('profile/', UserDetailView.as_view(), name='user-profile'),
#     path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
#     path('dashboard/recent-activity/', recent_activity, name='recent-activity'),
#     path('dashboard/progress-summary/', progress_summary, name='progress-summary'),
#     path('user-detail/', UserDetailView.as_view(), name='user-detail'),
# ]
from django.urls import path
from .views import (
    RegisterView,
    UserDetailView,
    LogoutView,
    # dashboard_stats,
    # recent_activity,
    # progress_summary,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

app_name = 'users'

urlpatterns = [
    # ✅ Registration endpoint
    path('register/', RegisterView.as_view(), name='register'),

    # ✅ JWT Auth endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # ✅ User management
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserDetailView.as_view(), name='user-profile'),
    path('user-detail/', UserDetailView.as_view(), name='user-detail'),
]

#     # # ✅ Dashboard APIs
#     # path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
#     path('dashboard/recent-activity/', recent_activity, name='recent-activity'),
#     path('dashboard/progress-summary/', progress_summary, name='progress-summary'),
# ]
