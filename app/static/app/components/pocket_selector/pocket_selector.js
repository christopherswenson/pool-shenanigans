
class PocketSelectorComponent {
  constructor (params) {
    this.value = params["value"] || null
  }

  display ($element) {
    this.$element = loadTemplate($element, 'pocket_selector.html')

    this.$choices = this.$element.find(".choice")
    this.setupChoices()
  }

  onChange (changeCallback) {
    this.changeCallback = changeCallback
  }

  setupChoices () {
    this.$choices.attr("selected", null)
    this.$element.find(`.choice[number="${this.value}"]`).attr("selected", true)
    this.$choices.click((event) => {
      let $target = $(event.target)
      let value = parseInt($target.attr("number"))
      this.$choices.attr("selected", null)
      $target.attr("selected", true)
      this.changeCallback(value)
    })
  }
}
