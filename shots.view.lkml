view: shots {
  derived_table: {
    sql: SELECT * FROM `pool-product-day.pool_shenanigans.shots` ;;
  }

  measure: count {
    type: count
    drill_fields: [detail*]
  }

  dimension: id {
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
    type: number
    sql: ${TABLE}.is_scratch ;;
  }

  dimension: is_break {
    type: number
    sql: ${TABLE}.is_break ;;
  }

  dimension: is_table_open {
    type: number
    sql: ${TABLE}.is_table_open ;;
  }

  dimension: combo_size {
    type: number
    sql: ${TABLE}.combo_size ;;
  }

  dimension: is_bank_shot {
    type: number
    sql: ${TABLE}.is_bank_shot ;;
  }

  dimension: is_jump_shot {
    type: number
    sql: ${TABLE}.is_jump_shot ;;
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
