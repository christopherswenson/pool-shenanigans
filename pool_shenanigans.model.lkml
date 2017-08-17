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

  join: winner {
    from: players
    relationship: one_to_one
    sql_on: ${games.winner_id} = ${winner.id} ;;
  }

  join: loser {
    from: players
    relationship: one_to_one
    sql_on: ${games.loser_id} = ${loser.id} ;;
  }

  join: shots {
    relationship: one_to_many
    sql_on: ${games.id} = ${shots.game_id} ;;
  }

  join: called_balls_pocketed {
    relationship: one_to_one
    sql_on: ${shots.id} = ${called_balls_pocketed.shot_id} ;;
  }

  join: balls_pocketed {
    relationship: one_to_many
    sql_on: ${shots.id} = ${balls_pocketed.shot_id} ;;
  }

  join: pockets {
    relationship: one_to_one
    sql_on: ${balls_pocketed.pocket_id} = ${pockets.id} ;;
  }

  join: table_state {
    relationship: one_to_many
    sql_on: ${shots.id} = ${table_state.current_shot_id} ;;
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

  join: opponent {
    from: players
    relationship: many_to_one
    sql_on: ${game_players.opponent_id} = ${opponent.id} ;;
  }

  join: shots {
    relationship: one_to_many
    sql_on: ${games.id} = ${shots.game_id} AND ${shots.player_id} = ${game_players.player_id} ;;
  }

  join: called_balls_pocketed {
    relationship: one_to_one
    sql_on: ${shots.id} = ${called_balls_pocketed.shot_id} ;;
  }

  join: balls_pocketed {
    relationship: one_to_many
    sql_on: ${shots.id} = ${balls_pocketed.shot_id} ;;
  }

  join: table_state {
    relationship: one_to_many
    sql_on: ${shots.id} = ${table_state.current_shot_id} ;;
  }
}

explore: shots {
  join: called_balls_pocketed {
    relationship: one_to_one
    sql_on: ${shots.id} = ${called_balls_pocketed.shot_id} ;;
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

  join: table_state {
    relationship: one_to_many
    sql_on: ${shots.id} = ${table_state.current_shot_id} ;;
  }

  join: balls_remaining {
    relationship: many_to_one
    sql_on: ${shots.id} = ${balls_remaining.shot_id} ;;
  }

  join: balls_remaining_balls {
    from: balls
    relationship: one_to_many
    sql_on: ${balls_remaining_balls.number} = ${balls_remaining.ball_number} ;;
  }
}
