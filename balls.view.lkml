view: balls {
  derived_table: {
    sql: SELECT * FROM `pool-product-day.pool_shenanigans.balls`;;
  }

  measure: count {
    type: count
    drill_fields: [detail*]
  }

  dimension: number {
    type: number
    sql: ${TABLE}.number ;;
  }

  set: detail {
    fields: [number]
  }
}
