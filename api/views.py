from django.http import HttpResponse, JsonResponse
from django.http import Http404
from django.template import loader
from json import loads as parse_json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate as app_authenticate, login as app_login, logout as app_logout
from django.contrib.auth.models import User
from os import environ
from django.contrib.auth.decorators import login_required
from django.views import View
from django.utils.decorators import method_decorator

from .models import Game, Turn, Shot, Pocket, Ball, BallPocketed, GamePlayer, BallRemaining, Invitation, Friendship, Table, TableMember

from .models import Player

from .looker_embed import embed_url_for_user

@method_decorator(login_required, name="dispatch")
@method_decorator(csrf_exempt, name="dispatch")
class Players(View):

    def get(self, request):
        players = Player.objects.all()
        tables = request.user.player.table_set.all()
        table_members = [member.player for table in tables for member in table.tablemember_set.all()]
        print tables
        friends = set([
            player
            for player in players
            if Friendship.objects.filter(giver=player, taker=request.user.player).first() is not None
        ] + [request.user.player] + table_members)
        return JsonResponse({
            'players': [ player.to_dict() for player in friends ]
        })

@method_decorator(login_required, name="dispatch")
@method_decorator(csrf_exempt, name="dispatch")
class Friends(View):

    def get(self, request, player_id=None):
        friends = [friendship.taker for friendship in request.user.player.friendship_giver_set.all()]
        if player_id is not None:
            friend = Player.objects.filter(pk=player_id).first()
            if friend is None or friend not in friends:
                return JsonResponse({
                    'status': 'error',
                    'error': 'no_matching_friend'
                })
            else:
                return JsonResponse({
                    'status': 'ok',
                    'friend': friend.to_dict()
                })
        else:
            return JsonResponse({
                'status': 'ok',
                'friends': [ friend.to_dict() for friend in friends ]
            })

    def post(self, request):
        request_json = parse_json(request.body)
        friend = None
        if request_json.get("username", None) is not None:
            if request_json["username"] == request.user.username:
                return JsonResponse({
                    "status": "error",
                    "error": "self_friending"
                })
            user = User.objects.filter(username=request_json["username"]).first()
            if user is None:
                return JsonResponse({
                    "status": "error",
                    "error": "no_matching_username"
                })
            friend = user.player
        if request_json.get("id", None) is not None:
            friend = Player.objects.filter(pk=request_json["id"]).first()
        if friend is None:
            return JsonResponse({
                "status": "error",
                "error": "no_matching_user"
            })
        if Friendship.objects.filter(giver=request.user.player, taker=friend).first() is not None:
            return JsonResponse({
                "status": "error",
                "error": "friendship_exists"
            })
        friendship = Friendship(giver=request.user.player, taker=friend)
        friendship.save()
        return JsonResponse({
            "status": "ok",
            "friend": friend.to_dict()
        })

    def delete(self, request, player_id=None):
        if player_id is None:
            return JsonResponse({
                "status": "error",
                "error": "no_player_id"
            })

        friend = Player.objects.filter(pk=player_id).first()
        friendship = Friendship.objects.filter(giver=request.user.player, taker=friend).first()
        if friendship is not None:
            friendship.delete()
        friendship = Friendship.objects.filter(giver=friend, taker=request.user.player).first()
        if friendship is not None:
            friendship.delete()
        return JsonResponse({
            "status": "ok"
        })

@method_decorator(login_required, name="dispatch")
@method_decorator(csrf_exempt, name="dispatch")
class FriendRequests(View):
    def get(self, request):
        requests = [
            friendship.giver
            for friendship in request.user.player.friendship_taker_set.all()
            if (Friendship.objects.filter(taker=friendship.giver, giver=request.user.player).first() is None and
                not friendship.giver.is_guest)
        ]
        return JsonResponse({
            'friends': [ request.to_dict() for request in requests ]
        })

@method_decorator(login_required, name="dispatch")
@method_decorator(csrf_exempt, name="dispatch")
class Guests(View):

    def get(self, request):
        guests = [friendship.giver for friendship in request.user.player.friendship_taker_set.all() if friendship.giver.is_guest]
        return JsonResponse({
            'guests': [ guest.to_dict() for guest in guests ]
        })

    def delete(self, request):
        request_json = parse_json(request.body)

        guest = Player.objects.filter(pk=request_json["id"]).first()
        if guest is None:
            return JsonResponse({
                "status": "error",
                "error": "no_matching_guest"
            })
        if not guest.is_guest:
            return JsonResponse({
                "status": "error",
                "error": "player_is_not_guest"
            })
        friendship = Friendship.objects.filter(giver=guest, taker=request.user.player).first()
        if friendship is None:
            return JsonResponse({
                "status": "error",
                "error": "not_your_guest"
            })
        friendship.delete()
        return JsonResponse({
            "status": "ok"
        })

@method_decorator(login_required, name="dispatch")
@method_decorator(csrf_exempt, name="dispatch")
class Tables(View):

    def get(self, request):
        table_members = request.user.player.tablemember_set.all()
        return JsonResponse({
            'tables': [ table_member.table.to_dict() for table_member in table_members ]
        })

    def post(self, request):
        request_json = parse_json(request.body)
        if Table.objects.filter(name=request_json["name"]).first() is not None:
            return JsonResponse({
                "status": "error",
                "error": "table_exists"
            })
        table = Table(name=request_json["name"], creator=request.user.player)
        table.save()
        table_member = TableMember(table=table, player=request.user.player)
        table_member.save()
        return JsonResponse({
            'status': 'ok',
            'table': table.to_dict()
        })

    @method_decorator(login_required, name="dispatch")
    @method_decorator(csrf_exempt, name="dispatch")
    class Join(View):
        def post(self, request):
            request_json = parse_json(request.body)
            table = Table.objects.filter(name=request_json["name"]).first()
            if table is None:
                return JsonResponse({
                    "status": "error",
                    "error": "no_matching_table"
                })
            if TableMember.objects.filter(table=table, player=request.user.player).first() is not None:
                return JsonResponse({
                    "status": "error",
                    "error": "table_member_exists"
                })
            table_member = TableMember(table=table, player=request.user.player)
            table_member.save()
            return JsonResponse({
                'status': 'ok',
                'table': table.to_dict()
            })

    @method_decorator(login_required, name="dispatch")
    @method_decorator(csrf_exempt, name="dispatch")
    class Leave(View):
        def post(self, request):
            request_json = parse_json(request.body)
            table = Table.objects.filter(name=request_json["name"]).first()
            if table is None:
                return JsonResponse({
                    "status": "error",
                    "error": "no_matching_table"
                })
            table_member = TableMember.objects.filter(table=table, player=request.user.player).first()
            if table_member is None:
                return JsonResponse({
                    "status": "error",
                    "error": "no_matching_table_member"
                })
            table_member.delete()
            return JsonResponse({
                "status": "ok"
            })

@method_decorator(login_required, name="dispatch")
@method_decorator(csrf_exempt, name="dispatch")
class Games(View):
    def get(self, request):
        tables = request.user.player.table_set.all()
        games = Game.objects.all()
        my_games = [
            game for game in games
            if (request.user.player.is_in_game(game) or
                any(map((lambda table: game.is_in_table(table)), tables)))
        ]
        return JsonResponse({
            'games': [ game.to_dict() for game in my_games ],
        })

    def post(self, request):
        game_json = parse_json(request.body).get("game")
        print "Log: Received Game with JSON:"
        print game_json

        game = Game(
            started_at = game_json["startedAt"],
            ended_at = game_json["endedAt"]
        )
        game.save()

        guest = None

        for game_player_json in game_json["gamePlayers"]:
            if game_player_json["id"] == "guest":
                guest = Player(
                    first_name=game_player_json["firstName"],
                    last_name=game_player_json["lastName"],
                    user = None,
                    is_guest = True
                )
                guest.save()
                friendship = Friendship(
                    giver=guest,
                    taker=request.user.player
                )
                friendship.save()
            game_player = GamePlayer(
                game=game,
                player=guest if guest is not None else Player.objects.get(pk=game_player_json["id"]),
                is_winner=game_player_json["isWinner"],
                pattern=game_player_json.get("pattern", None)
            )
            game_player.save()

        shot_number_in_game = 0
        for (turn_number, turn_json) in enumerate(game_json["turns"]):
            turn_player_json = turn_json["player"]
            player = guest if turn_player_json["id"] == "guest" else Player.objects.get(pk=turn_player_json["id"])
            turn = Turn(
                game=game,
                player=player,
                number=turn_number)
            turn.save()

            for (shot_number_in_turn, shot_json) in enumerate(turn_json["shots"]):
                called_pocket = None
                if shot_json["calledPocket"] is not None:
                    called_pocket = Pocket.objects.get(number=shot_json["calledPocket"])
                called_ball = None
                if shot_json["calledBall"] is not None:
                    called_ball = Ball.objects.get(number=shot_json["calledBall"])
                shot = Shot(
                    turn=turn,
                    number_in_turn=shot_number_in_turn,
                    number_in_game=shot_number_in_game,
                    is_success=shot_json["isSuccess"],
                    is_break=shot_json["isBreak"],
                    called_pocket=called_pocket,
                    called_ball=called_ball,
                    is_following_scratch=shot_json["isFollowingScratch"],
                    is_table_open=shot_json["isTableOpen"],
                    combo_count=shot_json["comboCount"],
                    is_scratch=shot_json["isScratch"]
                )
                shot.save()

                for ball_remaining_number in shot_json["ballsRemaining"]:
                    ball_remaining = BallRemaining(
                        ball=Ball.objects.get(number=ball_remaining_number),
                        shot=shot
                    )
                    ball_remaining.save()

                for ball_pocketed_json in shot_json["ballsPocketed"]:
                    ball_pocketed = BallPocketed(
                        shot=shot,
                        pocket=Pocket.objects.get(number=ball_pocketed_json["pocket"]),
                        ball=Ball.objects.get(number=ball_pocketed_json["number"]),
                        is_called=ball_pocketed_json["isCalled"],
                        is_slop=ball_pocketed_json["isSlop"]
                    )
                    ball_pocketed.save()

                shot_number_in_game += 1

        return JsonResponse({
            'status': 'ok',
            'game': game.to_dict()
        })

    class EmbedUrl(View):
        def get(self, request, game_id):
            if game_id is None :
                raise Http404

            return JsonResponse({
                'url': embed_url_for_user(request.user, "/embed/dashboards/309?game_id=%s" % game_id)
            })

@method_decorator(csrf_exempt, name="dispatch")
class Users(View):
    def get(self, request):
        if request.user.is_authenticated:
            return JsonResponse({
                'user': request.user.to_dict()
            })
        else:
            return JsonResponse({
                'user': None
            })

    @method_decorator(login_required)
    def patch(self, request):
        request_json = parse_json(request.body)
        if request_json.get("username", None) is not None:
            if request.user.username != request_json["username"]:
                if User.objects.filter(username=request_json["username"]).first() is not None:
                    return JsonResponse({
                        "status": "error",
                        "error": "user_exists"
                    })
                request.user.username = request_json["username"]
                request.user.save()
        if request_json.get("firstName", None) is not None:
            request.user.player.first_name = request_json["firstName"]
            request.user.player.save()
            request.user.first_name = request_json["firstName"]
            request.user.save()
        if request_json.get("lastName", None) is not None:
            request.user.player.last_name = request_json["lastName"]
            request.user.player.save()
            request.user.last_name = request_json["lastName"]
            request.user.save()
        if request_json.get("newPassword", None) is not None:
            if app_authenticate(username=request.user.username, password=request_json["oldPassword"]) is None:
                return JsonResponse({
                    "status": "error",
                    "error": "bad_password"
                })
            request.user.set_password(request_json["newPassword"])
            request.user.save()
        return JsonResponse({
            "status": "ok"
        })

    @method_decorator(csrf_exempt, name="dispatch")
    class Login(View):
        def post(self, request):
            credentials_json = parse_json(request.body)
            username = credentials_json['username']
            password = credentials_json['password']
            user = app_authenticate(request, username=username, password=password)
            if user is not None:
                app_login(request, user)
                return JsonResponse({
                    'status': 'ok',
                    'user': request.user.to_dict()
                })
            else:
                return JsonResponse({
                    'status': 'error',
                    'error': "invalid_login_credentials"
                })

    @method_decorator(csrf_exempt, name="dispatch")
    class Logout(View):
        def post(self, request):
            app_logout(request)
            return JsonResponse({
                'status': 'ok'
            })

    @method_decorator(csrf_exempt, name="dispatch")
    class Register(View):
        def post(self, request):
            registration_json = parse_json(request.body)
            credentials_json = registration_json["credentials"]
            player_json = registration_json["player"]

            username = credentials_json['username']
            password = credentials_json['password']
            invitation_code = credentials_json['invitationCode']

            existing_user = User.objects.filter(username=username).first()
            if existing_user is not None:
                return JsonResponse({
                    'status': 'error',
                    'error': "user_exists"
                })

            invitation = Invitation.objects.filter(code=invitation_code).first()
            if invitation is None:
                return JsonResponse({
                    'status': 'error',
                    'error': "invalid_invitation"
                })

            user = User.objects.create_user(username, username, password)
            app_login(request, user)

            user.first_name = player_json["firstName"]
            user.last_name = player_json["lastName"]
            user.save()

            player = Player(
                first_name=user.first_name,
                last_name=user.last_name,
                user=user
            )
            player.save()

            return JsonResponse({
                'status': 'ok',
                'user': user.to_dict()
            })
