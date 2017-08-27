class CheckboxComponent {
  constructor ($element, params) {
    this.$element = loadTemplate($element, "checkbox.html")

    if (params == null) params = {}
    this.changeEvent = (() => null)
    this.value = params['value'] || false
    this.setupClickEvent()
  }

  set value (newValue) {
    this.$element.attr("selected", newValue || null)
    this.changeEvent(this.value)
  }

  get value () {
    return !!this.$element.attr("selected")
  }

  change (callback) {
    this.changeEvent = callback
    return this
  }

  setupClickEvent () {
    this.$element.click( () => {
      this.value = !this.value
    })
  }
}
