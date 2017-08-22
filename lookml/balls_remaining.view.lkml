# One row per ball remaining per shot
view: balls_remaining {
  derived_table: {
    sql: SELECT
      S2.id AS shot_id,
      B.number AS ball_number
    FROM
      `pool-product-day.pool_shenanigans.balls` as B,
      `pool-product-day.pool_shenanigans.shots` as S2
    WHERE
      B.number <> 0 AND
      B.number NOT IN (
        SELECT
          BP.ball_number AS ball_number
        FROM
          `pool-product-day.pool_shenanigans.balls_pocketed` as BP,
          `pool-product-day.pool_shenanigans.shots` as S,
          `pool-product-day.pool_shenanigans.games` as G
        WHERE
          S.id = S2.id AND
          S.game_id = G.id AND
          G.id IN (
            SELECT BPS.game_id
            FROM `pool-product-day.pool_shenanigans.shots` AS BPS
            WHERE BPS.id = BP.shot_id) AND
          S.shot_number >= (
            SELECT
              S3.shot_number
            FROM
              `pool-product-day.pool_shenanigans.shots` AS S3
            WHERE
              BP.shot_id = S3.id
          )
        ) ;;
    persist_for: "2 minutes"
  }

  dimension: id {
    hidden: yes
    primary_key: yes
    sql: CONCAT('{',
      'shot_id:', CAST(${shot_id} AS STRING), ',',
      'ball_number:', CAST(${ball_number} AS STRING),
    '}') ;;
  }

  measure: count {
    type: count
    drill_fields: [detail*]
  }

  dimension: shot_id {
    type: number
    sql: ${TABLE}.shot_id ;;
  }

  dimension: ball_number {
    type: number
    sql: ${TABLE}.ball_number ;;
  }

  set: detail {
    fields: [shot_id, ball_number]
  }
}
