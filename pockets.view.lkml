view: pockets {
  derived_table: {
    sql: SELECT * FROM `pool-product-day.pool_shenanigans.pockets`;;
  }

  measure: count {
    type: count
    drill_fields: [detail*]
  }

  dimension: id {
    type: number
    sql: ${TABLE}.id ;;
  }

  set: detail {
    fields: [id]
  }
}
