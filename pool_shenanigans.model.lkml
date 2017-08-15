connection: "lookerdata_publicdata_standard_sql"

include: "*.view.lkml"         # include all views in this project
include: "*.dashboard.lookml"  # include all dashboards in this project

explore: games {
  join: player_one {
    from: players
    relationship: one_to_one
    sql: ${games.player_one_id} = ${player_one.id} ;;
  }

  join: player_two {
    from: players
    relationship: one_to_one
    sql: ${games.player_two_id} = ${player_two.id} ;;
  }

  join: shots {
    relationship: one_to_many
    sql: ${games.id} = ${shots.game_id} ;;
  }

  join: balls_pocketed {
    relationship: one_to_many
    sql: ${shots.id} = ${balls_pocketed.shot_id} ;;
  }
}

explore: players {

}
