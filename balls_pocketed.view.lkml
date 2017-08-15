view: balls_pocketed {
  derived_table: {
    sql: SELECT * FROM `pool-product-day.pool_shenanigans.balls_pocketed` ;;
  }

  measure: count {
    type: count
    drill_fields: [detail*]
  }

  dimension: id {
    type: number
    sql: ${TABLE}.id ;;
  }

  dimension: ball_number {
    type: number
    sql: ${TABLE}.ball_number ;;
  }

  dimension: pocket_id {
    type: number
    sql: ${TABLE}.pocket_id ;;
  }

  dimension: shot_id {
    type: number
    sql: ${TABLE}.shot_id ;;
  }

  set: detail {
    fields: [id, ball_number, pocket_id, shot_id]
  }
}
