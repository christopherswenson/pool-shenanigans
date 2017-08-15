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

  dimension: type {
    type:  string
    sql: ${number} ;;
    case: {
      when: {
        label: "cue"
        sql:  ${number} = 0  ;;
      }
      when: {
        label: "eight"
        sql:  ${number} = 8  ;;
      }
      when: {
        label: "solid"
        sql:  ${number} < 8  ;;
      }
      when: {
        label: "stripe"
        sql:  ${number} > 8  ;;
      }
    }
  }

  set: detail {
    fields: [number]
  }
}
