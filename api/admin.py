
from django.contrib import admin

from .models import Game, GamePlayer, Turn, Shot, Player, Ball, Pocket, Invitation, Friendship

class GameInline(admin.TabularInline):
    model = Game

class GamePlayerInline(admin.StackedInline):
    model = GamePlayer
    max_num = 2
    min_num = 2

class TurnInline(admin.StackedInline):
    model = Turn

class ShotInline(admin.StackedInline):
    model = Shot

class TurnAdmin(admin.ModelAdmin):
    inlines = [ ShotInline ]

class GameAdmin(admin.ModelAdmin):
    inlines = [ GamePlayerInline, TurnInline ]

admin.site.register(Game, GameAdmin)
admin.site.register(Turn, TurnAdmin)
admin.site.register(Player)
admin.site.register(Ball)
admin.site.register(Pocket)
admin.site.register(Invitation)
admin.site.register(Friendship)
