
const ENTER_KEY = 13

class LoginModal {

  constructor ($element) {
    this.$element = Template.load($element, "login_modal.html")

    this.$usernameInput = this.$element.find("#username-input")
    this.$passwordInput = this.$element.find("#password-input")
    this.$errorPane = this.$element.find("#error-pane")
    this.$loginButton = this.$element.find("#login-button")
    this.$registerButton = this.$element.find("#register-button")
    this.$modal = this.$element.find("#login-modal")

    this.$modal.modal()

    this.errorComponent = new ErrorPane(this.$errorPane, {
      "errorMap": {
        "invalid_login_credentials": "Invalid Login Credentials"
      }
    })

    this.setupEnterShortcut()
    this.setupLoginButton()
    this.setupRegisterButton()
  }

  // Property getters and setters

  get usernameValue () {
    return this.$usernameInput.val()
  }

  get passwordValue () {
    return this.$passwordInput.val()
  }

  // Setup methods

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
      Authentication.displayRegisterModal(this.usernameValue, this.passwordValue, () => {
        this.completeCallback(Authentication.user)
      })
    })
  }

  setupLoginButton () {
    this.$loginButton.click( () => {
      this.authenticate()
    })
  }

  // Controller methods

  authenticate () {
    this.errorComponent.error = null
    this.$loginButton.prop("disabled", true)
    Authentication.login(
      this.usernameValue,
      this.passwordValue,
      (response) => {
        if (response["status"] == "error") {
          this.errorComponent.error = response["error"]
          this.$loginButton.prop("disabled", false)
        } else {
          this.errorComponent.error = null
          this.completeCallback()
        }
      }
    )
  }

  // Event handlers

  complete (completeCallback) {
    this.completeCallback = () => {
      this.$modal.modal('hide')
      completeCallback(Authentication.user)
    }
    return this
  }
}
