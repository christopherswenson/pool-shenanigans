
const ENTER_KEY = 13

class LoginPaneComponent {

  display ($element) {
    this.authenticating = false

    this.$element = loadTemplate($element, "login_pane.html")

    this.$emailInput = this.$element.find("#email-input")
    this.$passwordInput = this.$element.find("#password-input")
    this.$errorPane = this.$element.find("#error-pane")
    this.$loginButton = this.$element.find("#login-button")
    this.$registerButton = this.$element.find("#register-button")
    this.$modal = this.$element.find("#login-modal")

    this.$modal.modal()

    this.errorComponent = new ErrorComponent(this.$errorPane, {
      "errorMap": {
        "invalid_login_credentials": "Invalid Login Credentials"
      }
    })

    this.setupEnterShortcut()
    this.setupLoginButton()
    this.setupRegisterButton()
  }

  get emailValue () {
    return this.$emailInput.val()
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
      AuthenticationController.displayRegisterModal(this.emailValue, this.passwordValue, () => {
        this.completeCallback(AuthenticationController.user)
      })
    })
  }

  setupLoginButton () {
    this.$loginButton.click( () => {
      this.authenticate()
    })
  }

  onComplete (completeCallback) {
    this.completeCallback = () => {
      this.$modal.modal('hide')
      completeCallback(AuthenticationController.user)
    }
  }

  updateLoginButton () {
    this.$loginButton.prop("disabled", this.authenticating)
  }

  authenticate () {
    this.authenticating = true
    this.errorComponent.error = null
    this.updateLoginButton()
    AuthenticationController.login(
      this.emailValue,
      this.passwordValue,
      (response) => {
        if (response["status"] == "error") {
          this.errorComponent.error = response["error"]
          this.authenticating = false
          this.updateLoginButton()
        } else {
          this.errorComponent.error = null
          this.completeCallback()
        }
      }
    )
  }
}
