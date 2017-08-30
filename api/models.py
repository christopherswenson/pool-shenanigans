from django.db import models
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string

def user_to_dict(self):
    return {
        'username': self.get_username(),
        'fullName': self.get_full_name(),
        'shortName': self.get_short_name(),
        "isAdmin": self.is_superuser,
        'id': self.pk,
        "player": self.player.to_dict()
    }

User.add_to_class("to_dict", user_to_dict)

class Game(models.Model):
    started_at = models.DateTimeField('date started')
    ended_at = models.DateTimeField('date ended')

    def to_dict(self):
        return {
            'id': self.pk
        }


def generate_guest_code():
    while True:
        code = get_random_string(6, '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ')
        if Player.objects.filter(guest_code=code).first() is None:
            return code

class Player(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    guest_code = models.CharField(max_length=255, default=generate_guest_code, unique=True)
    is_guest = models.BooleanField(default=False)

    def to_dict(self):
        return {
            'id': self.pk,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'userId': self.user.pk if self.user else None,
            'fullName': "%s %s" % (self.first_name, self.last_name),
            'isGuest': self.is_guest
        }

    def __unicode__(self):
       return 'Player: %s %s' % (self.first_name, self.last_name)

class Friendship(models.Model):
    giver = models.ForeignKey(Player, related_name="friendship_giver_set")
    taker = models.ForeignKey(Player, related_name="friendship_taker_set")

    def __unicode__(self):
       return 'Friendship: %s -> %s' % (self.giver.first_name, self.taker.first_name)

class Table(models.Model):
    name = models.CharField(max_length=64, unique=True)
    creator = models.ForeignKey(Player)

    def __unicode__(self):
       return 'Table: %s' % self.name

class TableMember(models.Model):
    table = models.ForeignKey(Table)
    player = models.ForeignKey(Player)

    def __unicode__(self):
       return 'TableMember: %s (%s)' % (self.player.first_name, self.table.name)

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

    def __unicode__(self):
       return 'Ball #%s' % self.number

class Pocket(models.Model):
    kind = models.CharField(max_length=255)
    number = models.IntegerField(default=0)

    def __unicode__(self):
       return 'Poket #%s' % self.number

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

    def __unicode__(self):
       return 'Invitation: %s' % self.code
