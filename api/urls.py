from django.conf.urls import url

from . import views
from .views import Players, Friends, Tables, Guests, Games, Users, FriendRequests

urlpatterns = [

    url(r'^user/players$', Players.as_view()),

    url(r'^user/games$', Games.as_view()),
    url(r'^user/games/(?P<game_id>\d+)/embed-url$', Games.EmbedUrl.as_view()),

    url(r'^user$', Users.as_view()),
    url(r'^user/login$', Users.Login.as_view()),
    url(r'^user/logout$', Users.Logout.as_view()),
    url(r'^user/register$', Users.Register.as_view()),

    url(r'^user/guests$', Guests.as_view()),
    # DELETE url(r'^user/guests/1$', views.guests, name='guests'),

    url(r'^user/tables$', Tables.as_view()),
    url(r'^user/tables/join$', Tables.Join.as_view()),
    # url(r'^user/tables/:name/join$', views.table_join, name='table_join'),
    url(r'^user/tables/leave$', Tables.Leave.as_view()),
    # url(r'^user/tables/:name/leave$', views.table_leave, name='table_leave'),
    # POST url(r'^user/tables/$', views.table_create, name='table_create'),

    url(r'^user/friends$', Friends.as_view()),
    url(r'^user/friend-requests$', FriendRequests.as_view()),
    # url(r'^user/friends/1$', views.friend_requests, name='friend_requests'),

]
