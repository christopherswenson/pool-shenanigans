
const ALL_BALL_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

class BallSelector {
  constructor ($element, params) {
    if (params == null) params = {}

    this.$element = $element

    this.changeCallback = (() => null)
    this.options = params["options"] || ALL_BALL_NUMBERS
    this.value = params["value"] || null
  }

  get value () {
    return this._value
  }

  set value (number) {
    this._value = number
    this.$choices.forEach(($choice) => {
      $choice.attr("selected", $choice.attr("number") == number)
    })
    this.changeCallback(number)
  }

  change (changeCallback) {
    this.changeCallback = changeCallback
    return this
  }

  set options (options) {
    this.$choices = options.sort( (a, b) => {
      if (a == 0) return 1
      if (b == 0) return -1
      else return a - b
    }).map( (number) => {
      let $choice = loadTemplate(null, 'ball_selector_choice.html')
      $choice.attr("number", number)
      $choice.attr("selected", number == this.value)
      $choice.click((event) => {
        let $target = $(event.target)
        this.value = parseInt($target.attr("number"))
      })
      return $choice
    })

    this.$element.html(this.$choices)
  }
}
