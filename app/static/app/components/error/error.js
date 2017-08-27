
class ErrorPane {
  constructor ($element, params) {
    this.$element = $element
    this.error = params["error"]
    this.errorMap = params["errorMap"] || {}
  }

  set error (value) {
    this._error = value
    if (value == null) {
      this.$element.html("")
    } else {
      loadTemplate(this.$element, "error.html", {
        "#error": this.errorMap[value] || "An unknown error occurred"
      })
    }
  }

  get error () {
    return this._error
  }
}
