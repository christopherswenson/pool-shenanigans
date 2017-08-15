connection: "lookerdata_publicdata_standard_sql"

include: "*.view.lkml"         # include all views in this project
include: "*.dashboard.lookml"  # include all dashboards in this project

explore: games {
  join: player_one {
    from: players
    relationship: one_to_one
    sql_on: ${games.player_one_id} = ${player_one.id} ;;
  }

  join: player_two {
    from: players
    relationship: one_to_one
    sql_on: ${games.player_two_id} = ${player_two.id} ;;
  }

  join: shots {
    relationship: one_to_many
    sql_on: ${games.id} = ${shots.game_id} ;;
  }

  # NOTE This join must be made anywhere where shots is joined in as well,
  # so ensure all instances are updated whenever this is modified
  join: called_ball_pocketed {
    from: balls_pocketed
    relationship: one_to_one
    sql_on:
      ${shots.id} = ${called_ball_pocketed.shot_id} AND
      ${shots.called_ball_number} = ${called_ball_pocketed.ball_number} AND
      ${shots.called_pocket_id} = ${called_ball_pocketed.pocket_id} ;;
  }

  join: balls_pocketed {
    relationship: one_to_many
    sql_on: ${shots.id} = ${balls_pocketed.shot_id} ;;
  }

  join: pockets {
    relationship: one_to_one
    sql_on: ${balls_pocketed.pocket_id} = ${pockets.id} ;;
  }
}

explore: game_players {
  join: games {
    relationship: many_to_one
    sql_on: ${game_players.game_id} = ${games.id} ;;
  }

  join: players {
    relationship: many_to_one
    sql_on: ${game_players.player_id} = ${players.id} ;;
  }
}

explore: shots {
  # NOTE This join must be made anywhere where shots is joined in as well,
  # so ensure all instances are updated whenever this is modified
  join: called_ball_pocketed {
    from: balls_pocketed
    relationship: one_to_one
    sql_on:
      ${shots.id} = ${called_ball_pocketed.shot_id} AND
      ${shots.called_ball_number} = ${called_ball_pocketed.ball_number} AND
      ${shots.called_pocket_id} = ${called_ball_pocketed.pocket_id} ;;
  }

  join: games {
    relationship: many_to_one
    sql_on: ${shots.game_id} = ${games.id} ;;
  }

  join: shooter {
    from: players
    relationship: many_to_one
    sql_on: ${shots.player_id} = ${shooter.id} ;;
  }
}
