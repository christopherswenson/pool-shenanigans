view: games {
  derived_table: {
    sql: SELECT * FROM `pool-product-day.pool_shenanigans.games` ;;
    persist_for: "2 minutes"
  }

  measure: count {
    type: count
    drill_fields: [detail*]
  }

  dimension: id {
    primary_key: yes
    type: number
    sql: ${TABLE}.id ;;
  }

  dimension: number {
    type: number
    sql: ${TABLE}.id + 1 ;;
    value_format: "\"Game \" 0"
  }

  dimension: player_one_id {
    hidden: yes
    type: number
    sql: ${TABLE}.player_one_id ;;
  }

  dimension: player_two_id {
    hidden: yes
    type: number
    sql: ${TABLE}.player_two_id ;;
  }

  dimension_group: start_time {
    type: time
    sql: ${TABLE}.start_time ;;
  }

  dimension_group: end_time {
    type: time
    sql: ${TABLE}.end_time ;;
  }

  dimension: game_duration {
    type: number
    sql: timestamp_diff(${end_time_raw}, ${start_time_raw}, MINUTE) ;;
    html: {{linked_value}} minutes ;;
  }

  dimension: winner_id {
    hidden: yes
    type: number
    sql: ${TABLE}.winner_id ;;
  }

  dimension: loser_id {
    hidden: yes
    type: number
    sql: CASE
      WHEN ${winner_id} = ${player_one_id}
      THEN ${player_two_id}
      ELSE ${player_one_id}
    END ;;
  }

  measure: average_game_duration {
    type: average
    sql: ${game_duration} ;;
  }

  set: detail {
    fields: [
      id,
      player_one_id,
      player_two_id,
      start_time_time,
      end_time_time,
      winner_id
    ]
  }
}
