from django.http import HttpResponse, JsonResponse
from django.http import Http404
from django.template import loader
from json import loads as parse_json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate as app_authenticate, login as app_login, logout as app_logout
from django.contrib.auth.models import User
from os import environ
from django.contrib.auth.decorators import login_required

from .models import Game, Turn, Shot, Pocket, Ball, BallPocketed, GamePlayer, BallRemaining, Invitation, Friendship

from .models import Player

from .looker_embed import embed_url_for_user

@login_required
def players(request):
    if request.method != 'GET':
        raise Http404

    players = Player.objects.all()
    tables = request.user.player.table_set.all()
    table_members = [member.player for table in tables for member in table.tablemember_set.all()]
    print tables
    friends = set([
        player
        for player in players
        if Friendship.objects.filter(giver=player, taker=request.user.player).first() is not None
    ] + [request.user.player] + table_members)
    data = {'players': [ player.to_dict() for player in friends ]}
    return JsonResponse(data)

@login_required
@csrf_exempt
def games(request):
    if request.method == 'GET':

        games = Game.objects.all()
        data = {
            'games': [ game.to_dict() for game in games ],
        }
        return JsonResponse(data)

    elif request.method != 'POST':
        raise Http404

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
        player = guest if turn_player_json["isGuest"] else Player.objects.get(pk=turn_player_json["id"])
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

    return JsonResponse({'status': 'ok', 'game': game.to_dict()})

@csrf_exempt
def login(request):
    if request.method != 'POST':
        raise Http404

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

@csrf_exempt
def logout(request):
    app_logout(request)
    return JsonResponse({'status': 'ok'})

@csrf_exempt
def register(request):
    if request.method != 'POST':
        raise Http404

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

def user(request):
    if request.method != 'GET':
        raise Http404

    if request.user.is_authenticated:
        return JsonResponse({
            'user': request.user.to_dict()
        })
    else:
        return JsonResponse({
            'user': None
        })


@login_required
def game_embed_url(request, game_id=None):
    if request.method != 'GET' or game_id is None :
        raise Http404

    return JsonResponse({
        'url': embed_url_for_user(request.user, "/embed/dashboards/309?game_id=%s" % game_id)
    })
