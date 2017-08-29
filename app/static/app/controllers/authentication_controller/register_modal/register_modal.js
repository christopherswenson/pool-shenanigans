
const MIN_PASSWORD_LENGTH = 8

class RegisterModal {
  constructor ($element, params) {
    this.registering = false

    this.$element = Template.load($element, "register_modal.html")

    this.$usernameInput = this.$element.find("#username-input")
    this.$passwordInput = this.$element.find("#password-input")
    this.$passwordRepeatInput = this.$element.find("#password-repeat-input")
    this.$firstNameInput = this.$element.find("#first-name-input")
    this.$lastNameInput = this.$element.find("#last-name-input")
    this.$errorPane = this.$element.find("#error-pane")
    this.$invitationCodeInput = this.$element.find("#invitation-code-input")
    this.$registerButton = this.$element.find("#register-button")
    this.$closeButton = this.$element.find("#close-button")
    this.$modal = this.$element.find("#register-modal")

    this.$modal.modal()
    this.errorComponent = new ErrorPane(this.$errorPane, {
      "errorMap": {
        "no_password_match": "Passwords do not match",
        "no_first_name": "First name must not be blank",
        "no_last_name": "Last name must not be blank",
        "no_username": "Username must not be blank",
        "user_exists": "Username exists",
        "password_too_short": `Password must be ${MIN_PASSWORD_LENGTH}+ characters`,
        "no_invitation_code": "An invitation code is required",
        "invalid_invitation": "Invalid invitation code"
      }
    })

    this.setupRegisterButton()
    this.setupCloseButton()
    this.setupEnterShortcut()
  }

  // Property getters and setters

  get usernameValue () {
    return this.$usernameInput.val().trim()
  }

  get passwordValue () {
    return this.$passwordInput.val()
  }

  get passwordRepeatValue () {
    return this.$passwordRepeatInput.val()
  }

  get firstNameValue () {
    return this.$firstNameInput.val().trim()
  }

  get lastNameValue () {
    return this.$lastNameInput.val().trim()
  }

  get invitationCodeValue () {
    return this.$invitationCodeInput.val().trim()
  }

  get validationError () {
    if (this.firstNameValue == "") {
      return "no_first_name"
    } else if (this.lastNameValue == "") {
      return "no_last_name"
    } else if (this.usernameValue == "") {
      return "no_username"
    } else if (this.passwordValue.length < MIN_PASSWORD_LENGTH) {
      return "password_too_short"
    } else if (this.passwordRepeatValue != this.passwordValue) {
      return "no_password_match"
    } else if (this.invitationCodeValue == "") {
      return "no_invitation_code"
    }
  }

  // Setup methods

  setupRegisterButton () {
    this.$registerButton.click( () => {
      this.sumbit()
    })
  }

  setupCloseButton () {
    this.$closeButton.click( () => {
      Authentication.ensureLogin()
    })
  }

  setupEnterShortcut () {
    this.$element.keypress((event) => {
      if (event.which == ENTER_KEY) {
        this.sumbit()
      }
    })
  }

  // Controller methods

  updateRegisterButton () {
    this.$registerButton.prop("disabled", this.registering)
  }

  sumbit () {
    this.errorComponent.error = this.validationError
    if (this.validationError == null) {
      this.register()
    }
  }

  register () {
    this.registering = true
    this.updateRegisterButton()
    Authentication.register({
      "username": this.usernameValue,
      "password": this.passwordValue,
      "invitationCode": this.invitationCodeValue
    }, {
      "firstName": this.firstNameValue,
      "lastName": this.lastNameValue
    }, (response) => {
      if (response["status"] == "error") {
        this.errorComponent.error = response["error"]
        this.registering = false
        this.updateRegisterButton()
      } else {
        this.errorComponent.error = null
        this.completeCallback()
      }
    })
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
