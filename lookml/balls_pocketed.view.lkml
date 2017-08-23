view: balls_pocketed {
  derived_table: {
    sql: SELECT * FROM `pool-product-day.pool_shenanigans.balls_pocketed` ;;
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

  dimension: is_called {
    type: yesno
    sql: (${shots.called_ball_number} = ${ball_number} AND ${shots.called_pocket_id} = ${pocket_id}) ;;
  }

  dimension: is_slop {
    type: yesno
    sql: (NOT ${is_called}) ;;
  }

  set: detail {
    fields: [id, ball_number, pocket_id, shot_id]
  }
}
