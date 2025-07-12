from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Profile
from .serializers import UserRegisterSerializer, ProfileSerializer


class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegisterSerializer


class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Return the logged-in user's profile
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        # Update profile data
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data,
                                       partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated successfully',
                             'data': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
