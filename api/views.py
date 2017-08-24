from django.http import HttpResponse, JsonResponse
from django.http import Http404
from django.template import loader
from json import loads as parse_json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate as app_authenticate, login as app_login, logout as app_logout
from django.contrib.auth.models import User
from os import environ
from django.contrib.auth.decorators import login_required

from .models import Game, Turn, Shot, Pocket, Ball, BallPocketed, GamePlayer, BallRemaining

from .models import Player

from .looker_embed import Looker, EmbedUser, EmbedUrl

@login_required
def players(request):
    if request.method != 'GET':
        raise Http404

    players = Player.objects.all()
    data = {'players': [ player.toDict() for player in players ]}
    return JsonResponse(data)

@login_required
@csrf_exempt
def games(request):
    if request.method == 'GET':

        games = Game.objects.all()
        data = {'games': [ game.toDict() for game in games ]}
        return JsonResponse(data)

    elif request.method != 'POST':
        raise Http404

    game_json = parse_json(request.body).get("game")

    game = Game(
        started_at = game_json["startedAt"],
        ended_at = game_json["endedAt"]
    )
    game.save()

    for game_player_json in game_json["gamePlayers"]:
        game_player = GamePlayer(
            game=game,
            player=Player.objects.get(pk=game_player_json["id"]),
            is_winner=game_player_json["isWinner"],
            pattern=game_player_json.get("pattern", None)
        )
        game_player.save()

    shot_number_in_game = 0
    for (turn_number, turn_json) in enumerate(game_json["turns"]):
        turn = Turn(
            game=game,
            player=Player.objects.get(pk=turn_json["player"]["id"]),
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
                combo_count=shot_json["comboCount"]
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

    return JsonResponse({'status': 'ok', 'game': game.toDict()})

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
            'user': request.user.toDict()
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

def user(request):
    if request.method != 'GET':
        raise Http404

    if request.user.is_authenticated:
        return JsonResponse({
            'user': request.user.toDict()
        })
    else:
        return JsonResponse({
            'user': None
        })


@login_required
def embed_url(request):
    if request.method != 'GET':
        raise Http404

    return JsonResponse({
        'url': getEmbedUrlForUser(request.user)
    })

# # # # # # # # # # # # # # # # # # # # # # # # #
# helpers

def userToDict(self):
    return {
        'username': self.get_username(),
        'fullName': self.get_full_name(),
        'shortName': self.get_short_name()
    }

def getEmbedUrlForUser(user):
    looker = Looker(getEmbedHost(), getEmbedSecret())

    user = EmbedUser(
        user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        permissions=[
            'access_data',
            'create_table_calculations',
            'download_without_limit',
            'explore',
            'manage_spaces',
            'save_content',
            'schedule_look_emails',
            'see_lookml',
            'see_lookml_dashboards',
            'see_looks',
            'see_sql',
            'see_user_dashboards',
            'embed_browse_spaces',
        ],
        models=['pool_shenanigans'],
        group_ids=[28],
        external_group_id='pool_player',
        user_attributes={'db_database': environ.get("DB_NAME")},
        access_filters={}
    )

    fifteen_minutes = 15 * 60

    url = EmbedUrl(looker, user, fifteen_minutes, "/embed/dashboards/309", force_logout_login=True)

    return "https://" + url.to_string()


def getEmbedSecret():
    return environ.get('EMBED_SECRET')

def getEmbedHost():
    return environ.get('EMBED_HOST')

User.add_to_class("toDict", userToDict)
