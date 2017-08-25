
const ENTER_KEY = 13

class LoginPaneComponent {

  display ($element) {
    this.authenticating = false

    this.$element = loadTemplate($element, "login_pane.html")

    this.$usernameInput = this.$element.find("#username-input")
    this.$passwordInput = this.$element.find("#password-input")
    this.$errorPane = this.$element.find("#error-pane")
    this.$loginButton = this.$element.find("#login-button")
    this.$registerButton = this.$element.find("#register-button")
    this.$modal = this.$element.find("#login-modal")

    this.$modal.modal()
    this.auth = new AuthenticationController

    this.setupEnterShortcut()
    this.setupLoginButton()
    this.setupRegisterButton()
  }

  get usernameValue () {
    return this.$usernameInput.val()
  }

  get passwordValue () {
    return this.$passwordInput.val()
  }

  setupEnterShortcut () {
    this.$element.keypress((event) => {
      if (event.which == ENTER_KEY) {
          this.authenticate()
      }
    })
  }

  setupRegisterButton () {
    this.$registerButton.click( () => {
      this.$modal.modal('hide')
      this.auth.displayRegisterModal(this.usernameValue, this.passwordValue, () => {
        this.completeCallback(this.auth.user)
      })
    })
  }

  setupLoginButton () {
    this.$loginButton.click( () => {
      this.authenticate()
    })
  }

  displayError () {
    this.$errorPane.empty()
    if (this.error == null) return
    loadTemplate(this.$errorPane, "login_error.html", {
      "#error": this.getError()
    })
  }

  getError () {
    if (this.error == null) return null
    switch (this.error) {
      case "invalid_login_credentials":
        return "Invalid Login Credentials"
      default:
        return "An unknown error occurred"
    }
  }

  onComplete (completeCallback) {
    this.completeCallback = () => {
      this.$modal.modal('hide')
      completeCallback(this.auth.user)
    }
  }

  updateLoginButton () {
    this.$loginButton.prop("disabled", this.authenticating)
  }

  authenticate () {
    this.authenticating = true
    this.error = null
    this.displayError()
    this.updateLoginButton()
    this.auth.login(
      this.usernameValue,
      this.passwordValue,
      (response) => {
        if (response["status"] == "error") {
          this.error = response["error"]
          this.displayError()
          this.authenticating = false
          this.updateLoginButton()
        } else {
          this.$errorPane.empty()
          this.completeCallback()
        }
      }
    )
  }
}
