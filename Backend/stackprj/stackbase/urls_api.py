from rest_framework.routers import DefaultRouter
from .views_api import QuestionViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = router.urls
