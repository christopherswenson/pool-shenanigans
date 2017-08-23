from django.db import models
# from datetime import datetime
from dateutil.parser import parse as parse_date

class Game(models.Model):
    started_at = models.DateTimeField('date started')
    ended_at = models.DateTimeField('date ended')

class Player(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    def toDict(self):
        return {
            'id': self.pk,
            'firstName': self.first_name,
            'lastName': self.last_name
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
    called_pocket = models.ForeignKey(Pocket, on_delete=models.CASCADE, null=True)
    called_ball = models.ForeignKey(Ball, on_delete=models.CASCADE, null=True)
    is_following_scratch = models.BooleanField(default=False)

class BallRemaining(models.Model):
    ball = models.ForeignKey(Ball, on_delete=models.CASCADE)
    shot = models.ForeignKey(Shot, on_delete=models.CASCADE)

class BallPocketed(models.Model):
    shot = models.ForeignKey(Shot, on_delete=models.CASCADE)
    pocket = models.ForeignKey(Pocket, on_delete=models.CASCADE)
    ball = models.ForeignKey(Ball, on_delete=models.CASCADE)
    is_called = models.BooleanField(default=False)
    is_slop = models.BooleanField(default=False)
