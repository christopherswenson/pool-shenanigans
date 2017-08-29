class Checkbox {
  constructor ($element, params) {
    this.$element = loadTemplate($element, "checkbox.html")

    if (params == null) params = {}
    this.changeEvent = (() => null)
    this.value = params['value'] || false
    this.setupClickEvent()
  }

  // Property getters and setters

  set value (newValue) {
    this.$element.attr("selected", newValue || null)
    this.changeEvent(this.value)
  }

  get value () {
    return !!this.$element.attr("selected")
  }

  // Setup methods

  setupClickEvent () {
    this.$element.click( () => {
      this.value = !this.value
    })
  }

  // Event handlers

  change (callback) {
    this.changeEvent = callback
    return this
  }
}
