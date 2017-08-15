view: balls {
  derived_table: {
    sql: SELECT * FROM `pool-product-day.pool_shenanigans.balls`;;
    persist_for: "2 minutes"
  }

  measure: count {
    type: count
    drill_fields: [detail*]
  }

  dimension: number {
    primary_key: yes
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
        label: "stripe"
        sql:  ${number} > 8  ;;
      }
      else: "solid"
    }
  }

  set: detail {
    fields: [number]
  }
}
