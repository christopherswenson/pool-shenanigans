view: game_players {
  derived_table: {
    sql:
      SELECT id as game_id, player_one_id as player_id FROM `pool-product-day.pool_shenanigans.games`
      UNION ALL
      SELECT id, player_two_id FROM `pool-product-day.pool_shenanigans.games` ;;
  }

  dimension: hidden_id {
    primary_key: yes
    hidden: yes
    sql: CONCAT('{',
      'game_id:', CAST(game_players.game_id AS STRING), ',',
      'player_id:', CAST(game_players.player_id AS STRING),
    '}') ;;
  }

  measure: count {
    type: count
    drill_fields: [detail*]
  }

  dimension: game_id {
    type: number
    sql: ${TABLE}.game_id ;;
  }

  dimension: player_id {
    type: number
    sql: ${TABLE}.player_id ;;
  }

  dimension: is_winner {
    type: yesno
    sql: ${games.winner_id} = ${player_id} ;;
  }

  set: detail {
    fields: [game_id, player_id]
  }
}
