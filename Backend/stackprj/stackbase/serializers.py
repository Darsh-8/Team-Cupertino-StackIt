from rest_framework import serializers

from .models import Question, Comment


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'question', 'name', 'content', 'date_created']


class QuestionSerializer(serializers.ModelSerializer):
    comment = CommentSerializer(many=True, read_only=True)
    total_likes = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'user', 'title', 'content', 'date_created',
                  'total_likes', 'comment']

    def get_total_likes(self, obj):
        return obj.total_likes()
