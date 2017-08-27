from django.db import models
from django.contrib.auth.models import User

def user_to_dict(self):
    return {
        'username': self.get_username(),
        'fullName': self.get_full_name(),
        'shortName': self.get_short_name(),
        "isAdmin": self.is_superuser,
        'id': self.pk,
        "player": self.player.toDict()
    }

User.add_to_class("to_dict", user_to_dict)

class Game(models.Model):
    started_at = models.DateTimeField('date started')
    ended_at = models.DateTimeField('date ended')

    def toDict(self):
        return {
            'id': self.pk
        }

class Player(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)

    def toDict(self):
        return {
            'id': self.pk,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'userId': self.user.pk if self.user else None,
            'fullName': "%s %s" % (self.first_name, self.last_name)
        }

class GamePlayer(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    is_winner = models.BooleanField(default=False)
    pattern = models.CharField(max_length=255, null=True)

class Turn(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    number = models.IntegerField(default=0)

class Ball(models.Model):
    kind = models.CharField(max_length=255)
    number = models.IntegerField(default=0)

class Pocket(models.Model):
    kind = models.CharField(max_length=255)
    number = models.IntegerField(default=0)

class Shot(models.Model):
    turn = models.ForeignKey(Turn, on_delete=models.CASCADE)
    number_in_turn = models.IntegerField(default=0)
    number_in_game = models.IntegerField(default=0)
    is_success = models.BooleanField(default=False)
    is_break = models.BooleanField(default=False)
    is_scratch = models.BooleanField(default=False)
    called_pocket = models.ForeignKey(Pocket, on_delete=models.CASCADE, null=True)
    called_ball = models.ForeignKey(Ball, on_delete=models.CASCADE, null=True)
    is_following_scratch = models.BooleanField(default=False)
    is_table_open = models.BooleanField(default=False)
    combo_count = models.IntegerField(default= 1)

class BallRemaining(models.Model):
    ball = models.ForeignKey(Ball, on_delete=models.CASCADE)
    shot = models.ForeignKey(Shot, on_delete=models.CASCADE)

class BallPocketed(models.Model):
    shot = models.ForeignKey(Shot, on_delete=models.CASCADE)
    pocket = models.ForeignKey(Pocket, on_delete=models.CASCADE)
    ball = models.ForeignKey(Ball, on_delete=models.CASCADE)
    is_called = models.BooleanField(default=False)
    is_slop = models.BooleanField(default=False)

class Invitation(models.Model):
    code = models.CharField(max_length=255)
