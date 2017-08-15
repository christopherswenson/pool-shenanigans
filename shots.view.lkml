view: shots {
  derived_table: {
    sql: SELECT * FROM `pool-product-day.pool_shenanigans.shots` ;;
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

  dimension: game_id {
    type: number
    sql: ${TABLE}.game_id ;;
  }

  dimension: player_id {
    type: number
    sql: ${TABLE}.player_id ;;
  }

  dimension: shot_number {
    type: number
    sql: ${TABLE}.shot_number ;;
  }

  dimension: called_ball_number {
    type: number
    sql: ${TABLE}.called_ball_number ;;
  }

  dimension: called_pocket_id {
    type: number
    sql: ${TABLE}.called_pocket_id ;;
  }

  dimension: first_ball_number {
    type: number
    sql: ${TABLE}.first_ball_number ;;
  }

  dimension: is_scratch {
    type: yesno
    sql: (CASE WHEN ${TABLE}.is_scratch = 1 THEN true ELSE false END) ;;
  }

  dimension: is_break {
    type: yesno
    sql: (CASE WHEN ${TABLE}.is_break = 1 THEN true ELSE false END) ;;
  }

  dimension: is_table_open {
    type: yesno
    sql: (CASE WHEN ${TABLE}.is_table_open = 1 THEN true ELSE false END) ;;
  }

  dimension: combo_size {
    type: number
    sql: ${TABLE}.combo_size ;;
  }

  dimension: is_bank_shot {
    type: yesno
    sql: (CASE WHEN ${TABLE}.is_bank_shot = 1 THEN true ELSE false END) ;;
  }

  dimension: is_jump_shot {
    type: yesno
    sql: (CASE WHEN ${TABLE}.is_jump_shot = 1 THEN true ELSE false END) ;;
  }

  dimension: is_success {
    type: yesno
    sql: (${called_ball_pocketed.id} IS NOT NULL) AND (NOT ${is_scratch}) ;;
  }

  measure: called_count {
    type: sum
    sql: (CASE WHEN ${called_ball_number} IS NULL THEN 0 ELSE 1 END) ;;
  }

  measure: success_count {
    type: sum
    sql: (CASE WHEN ${is_success} THEN 1 ELSE 0 END) ;;
  }

  measure: success_percentage {
    type: number
    sql: CASE
      WHEN ${called_count} = 0
      THEN NULL
      ELSE (${success_count} / ${called_count}) * 100
    END ;;
    value_format: "0.00\%"
  }

  measure: balls_left {
    type: sum
    sql: ${table_state.balls_left} ;;
  }

  set: detail {
    fields: [
      id,
      game_id,
      player_id,
      shot_number,
      called_ball_number,
      called_pocket_id,
      first_ball_number,
      is_scratch,
      is_break,
      is_table_open,
      combo_size,
      is_bank_shot,
      is_jump_shot
    ]
  }
}
