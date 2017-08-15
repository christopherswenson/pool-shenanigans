view: games_players {
  derived_table: {
    sql: SELECT id, player_one_id, 'player_one' AS player FROM `pool-product-day.pool_shenanigans.games`
      UNION ALL
      SELECT id, player_two_id, 'player_two' FROM `pool-product-day.pool_shenanigans.games`
       ;;
  }

  dimension: hidden_id {
    primary_key: yes
    hidden: yes
    sql: ${id} || ${player} ;;
  }

  measure: count {
    type: count
    drill_fields: [detail*]
  }

  dimension: id {
    type: number
    sql: ${TABLE}.id ;;
  }

  dimension: player_id {
    type: number
    sql: ${TABLE}.player_one_id ;;
  }

  dimension: player {
    type: string
    sql: ${TABLE}.player ;;
  }

  set: detail {
    fields: [id, player_id, player]
  }
}
