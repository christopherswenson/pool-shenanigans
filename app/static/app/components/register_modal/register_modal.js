
const MIN_PASSWORD_LENGTH = 8

class RegisterModalComponent {
  display ($element) {
    this.registering = false

    this.$element = loadTemplate($element, "register_modal.html")

    this.$emailInput = this.$element.find("#email-input")
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
    this.errorComponent = new ErrorComponent(this.$errorPane, {
      "errorMap": {
        "no_password_match": "Passwords do not match",
        "no_first_name": "First name must not be blank",
        "no_last_name": "Last name must not be blank",
        "no_email": "Email must not be blank",
        "user_exists": "Username exists",
        "password_too_short": `Password must be ${MIN_PASSWORD_LENGTH}+ characters`,
        "no_invitation_code": "An invitation code is required",
        "invalid_invitation": "Invalid invitation code",
        "invalid_email": "Invalid email address",
      }
    })

    this.setupRegisterButton()
    this.setupCloseButton()
  }

  onComplete (completeCallback) {
    this.completeCallback = () => {
      this.$modal.modal('hide')
      completeCallback(this.auth.user)
    }
  }

  get emailValue () {
    return this.$emailInput.val().trim()
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

  isEmailValid () {
    let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    return re.test(this.emailValue)
  }

  get validationError () {
    if (this.firstNameValue == "") {
      return "no_first_name"
    } else if (this.lastNameValue == "") {
      return "no_last_name"
    } else if (this.emailValue == "") {
      return "no_email"
    } else if (!this.isEmailValid()) {
      return "invalid_email"
    } else if (this.passwordValue.length < MIN_PASSWORD_LENGTH) {
      return "password_too_short"
    } else if (this.passwordRepeatValue != this.passwordValue) {
      return "no_password_match"
    } else if (this.invitationCodeValue == "") {
      return "no_invitation_code"
    }
  }

  setupRegisterButton () {
    this.$registerButton.click( () => {
      this.errorComponent.error = this.validationError
      if (this.validationError == null) {
        this.register()
      }
    })
  }

  setupCloseButton () {
    this.$closeButton.click( () => {
      AuthenticationController.ensureLogin()
    })
  }

  updateRegisterButton () {
    this.$registerButton.prop("disabled", this.registering)
  }

  register () {
    this.registering = true
    this.updateRegisterButton()
    AuthenticationController.register({
      "email": this.emailValue,
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
}
