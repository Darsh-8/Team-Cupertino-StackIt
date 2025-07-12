from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .models import Question, Comment
from .serializers import QuestionSerializer, CommentSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter,
                       filters.OrderingFilter]
    search_fields = ['title', 'content']
    filterset_fields = ['user']
    ordering_fields = ['date_created']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        question = self.get_object()
        if request.user in question.likes.all():
            question.likes.remove(request.user)
            return Response({'status': 'unliked'})
        else:
            question.likes.add(request.user)
            return Response({'status': 'liked'})


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-date_created')
    serializer_class = CommentSerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['content', 'name']
    ordering_fields = ['date_created']
