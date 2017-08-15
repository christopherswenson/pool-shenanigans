view: table_state {
  derived_table: {
    sql:
      SELECT
        PreviousShots.current_shot_id AS current_shot_id,
        COUNT(*) AS balls_pocketed
      FROM
        (SELECT
          Sh.id as current_shot_id,
          Shots.id as shot_id
        FROM
          (SELECT S.id, S.game_id, S.shot_number FROM `pool-product-day.pool_shenanigans.shots` AS S) AS Sh,
          `pool-product-day.pool_shenanigans.shots` AS Shots,
          `pool-product-day.pool_shenanigans.games` AS Games
        WHERE
          Games.id = Shots.game_id AND
          Sh.game_id = Games.id AND
          Sh.shot_number > Shots.shot_number
          ) AS PreviousShots,
        `pool-product-day.pool_shenanigans.balls_pocketed` AS Pocketed
      WHERE
        PreviousShots.shot_id = Pocketed.shot_id AND
        Pocketed.ball_number <> 0
      GROUP BY current_shot_id
    ;;
    persist_for: "1 hour"
  }


  dimension: current_shot_id {
    type:  number
    sql: ${TABLE}.current_shot_id ;;
    drill_fields: [game_id, balls_left]
  }

  dimension: game_id {
    type:  number
    sql: ${TABLE}.game_id ;;
  }
#
#   dimension: shot_id {
#     type:  number
#     sql: ${TABLE}.shot_id ;;
#   }
#
#   dimension: pocketed_id {
#     type:  number
#     sql:  ${TABLE}.pocketed_id ;;
#   }

  dimension: balls_left {
    type: number
    sql: CASE WHEN (${TABLE}.balls_pocketed IS NULL) THEN 15 ELSE 15 - ${TABLE}.balls_pocketed END ;;
    drill_fields: [game_id, current_shot_id]
  }

}
