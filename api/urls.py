from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^players$', views.players, name='players'),
    url(r'^games$', views.games, name='games'),
    url(r'^user/login$', views.login, name='login'),
    url(r'^user/logout$', views.logout, name='logout'),
    url(r'^user$', views.user, name='user'),
    url(r'^embed/url$', views.embed_url, name='embed_url'),
]
