from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^players$', views.players, name='players'),

    url(r'^games$', views.games, name='games'),
    url(r'^games/(?P<game_id>\d+)/embed_url$', views.game_embed_url, name='game_embed_url'),

    url(r'^user/login$', views.login, name='login'),
    url(r'^user/logout$', views.logout, name='logout'),
    url(r'^user/register$', views.register, name='register'),

    url(r'^user/username$', views.username, name='username'),
    url(r'^user/first_name$', views.first_name, name='first_name'),
    url(r'^user/last_name$', views.last_name, name='last_name'),
    url(r'^user/password$', views.password, name='password'),

    url(r'^user/guests$', views.guests, name='guests'),
    url(r'^user/guests/remove$', views.guest_remove, name='guest_remove'),

    url(r'^user/tables$', views.tables, name='tables'),
    url(r'^user/tables/join$', views.table_join, name='table_join'),
    url(r'^user/tables/leave$', views.table_leave, name='table_leave'),
    url(r'^user/tables/create$', views.table_create, name='table_create'),

    url(r'^user/friends$', views.friends, name='friends'),
    url(r'^user/friends/requests$', views.friend_requests, name='friend_requests'),
    url(r'^user/friends/give$', views.friends_give, name='friends_give'),
    url(r'^user/friends/unfriend$', views.unfriend, name='unfriend'),

    url(r'^user$', views.user, name='user'),
]
