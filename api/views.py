from django.http import HttpResponse, JsonResponse
from django.http import Http404
from django.template import loader
from json import loads as parse_json
from django.views.decorators.csrf import csrf_exempt

from .models import Game, Turn, Shot, Pocket, Ball, BallPocketed, GamePlayer

from .models import Player

def players(request):
    if request.method != 'GET':
        raise Http404

    players = Player.objects.all()
    data = {'players': [ player.toDict() for player in players ]}
    return JsonResponse(data)

@csrf_exempt
def games(request):
    if request.method != 'POST':
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
            is_winner=game_player_json["isWinner"]
        )
        # todo pattern

    for (turn_number, turn_json) in enumerate(game_json["turns"]):
        turn = Turn(
            game=game,
            player=Player.objects.get(pk=turn_json["player"]["id"]),
            number=turn_number)
        turn.save()

        shot_number_in_game = 0
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
                called_ball=called_ball
            )
            shot.save()

            for ball_pocketed_json in shot_json["ballsPocketed"]:
                ball_pocketed = BallPocketed(
                    shot=shot,
                    pocket=Pocket.objects.get(number=ball_pocketed_json["pocket"]),
                    ball=Ball.objects.get(number=ball_pocketed_json["number"]),
                    is_called=ball_pocketed_json["isCalled"],
                    is_slop=ball_pocketed_json["isSlop"]
                )
                ball_pocketed.save()

    return JsonResponse({'status': 'ok'})
