from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^players$', views.players, name='players'),
    url(r'^games$', views.games, name='games'),
]
