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

explore: players {

}

explore: shots {
  join: games {
    relationship: many_to_one
    sql_on: ${shots.game_id} = ${games.id} ;;
  }

  join: table_state {
    relationship: one_to_many
    sql_on: ${shots.id} = ${table_state.current_shot_id} ;;
  }

}
