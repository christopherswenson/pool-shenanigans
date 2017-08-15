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
}

explore: players {

}
