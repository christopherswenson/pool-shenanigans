from django.conf.urls import url

from . import views
from .views import Players

urlpatterns = [

    url(r'^user/players$', Players.as_view()),

    url(r'^user/games$', views.games, name='games'),
    url(r'^user/games/(?P<game_id>\d+)/embed-url$', views.game_embed_url, name='game_embed_url'),

    # PATCH!
    url(r'^user$', views.user, name='user'),
    url(r'^user/login$', views.login, name='login'),
    url(r'^user/logout$', views.logout, name='logout'),
    url(r'^user/register$', views.register, name='register'),

    url(r'^user/guests$', views.guests, name='guests'),
    # DELETE url(r'^user/guests/1$', views.guests, name='guests'),

    url(r'^user/tables$', views.tables, name='tables'),
    url(r'^user/tables/join$', views.table_join, name='table_join'),
    # url(r'^user/tables/:name/join$', views.table_join, name='table_join'),
    url(r'^user/tables/leave$', views.table_leave, name='table_leave'),
    # url(r'^user/tables/:name/leave$', views.table_leave, name='table_leave'),
    # POST url(r'^user/tables/$', views.table_create, name='table_create'),

    url(r'^user/friends$', views.friends, name='friends'),
    url(r'^user/friend-requests$', views.friend_requests, name='friend_requests'),
    url(r'^user/friends/1$', views.friend_requests, name='friend_requests'),


]
