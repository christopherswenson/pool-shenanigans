class CheckboxComponent {
  constructor (params) {
    if (params == null) params = {}
    this.value = params['value'] || false
    this.changeEvent = (() => null)
  }

  display ($element) {
    this.$element = loadTemplate($element, "checkbox.html")

    this.setValue(this.value)
    this.setupClickEvent()
  }

  onChange (callback) {
    this.changeEvent = callback
  }

  setValue (value) {
    this.value = value
    this.$element.attr("selected", this.value || null)
    this.changeEvent(this.value)
  }

  setupClickEvent () {
    this.$element.click( () => {
      this.setValue(!this.value)
    })
  }
}
