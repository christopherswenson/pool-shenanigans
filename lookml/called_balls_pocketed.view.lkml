view: called_balls_pocketed {
  derived_table: {
    sql: SELECT
        S.id as shot_id,
        BP.id as ball_pocketed_id,
        BP.pocket_id as pocket_id,
        BP.ball_number as ball_number
      FROM
        `pool-product-day.pool_shenanigans.shots` as S,
        `pool-product-day.pool_shenanigans.balls_pocketed` as BP
      WHERE
        S.id = BP.shot_id AND
        S.called_ball_number = BP.ball_number AND
        S.called_pocket_id = BP.pocket_id
       ;;
    persist_for: "2 minutes"
  }

  measure: count {
    type: count
    drill_fields: [detail*]
  }

  dimension: shot_id {
    type: number
    sql: ${TABLE}.shot_id ;;
  }

  dimension: ball_pocketed_id {
    primary_key: yes
    type: number
    sql: ${TABLE}.ball_pocketed_id ;;
  }

  set: detail {
    fields: [shot_id, ball_pocketed_id]
  }
}
