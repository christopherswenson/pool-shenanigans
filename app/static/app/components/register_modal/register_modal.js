
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
    this.$modal = this.$element.find("#register-modal")

    this.$modal.modal()
    this.auth = new AuthenticationController

    this.setupRegisterButton()
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

  getError () {
    let error = this.validationError || this.error
    if (error == null) return
    switch (error) {
      case "no_password_match":
        return "Passwords do not match"
      case "no_first_name":
        return "First name must not be blank"
      case "no_last_name":
        return "Last name must not be blank"
      case "no_email":
        return "Email must not be blank"
      case "user_exists":
        return `${this.emailValue} exists`
      case "password_too_short":
        return `Password must be ${MIN_PASSWORD_LENGTH}+ characters`
      case "no_invitation_code":
        return `An invitation code is required`
      case "invalid_invitation":
        return `Invalid invitation code`
      case "invalid_email":
        return `Invalid email address`
      default:
        return "An unknown error occurred"
    }
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

  displayError () {
    this.$errorPane.empty()
    if (this.error == null && this.validationError == null) return
    loadTemplate(this.$errorPane, "login_error.html", {
      "#error": this.getError()
    })
  }

  setupRegisterButton () {
    this.$registerButton.click( () => {
      this.displayError()
      if (this.validationError == null) {
        this.register()
      }
    })
  }

  updateRegisterButton () {
    this.$registerButton.prop("disabled", this.registering)
  }

  register () {
    this.registering = true
    this.updateRegisterButton()
    this.auth.register({
      "email": this.emailValue,
      "password": this.passwordValue,
      "invitationCode": this.invitationCodeValue
    }, {
      "firstName": this.firstNameValue,
      "lastName": this.lastNameValue
    }, (response) => {
      if (response["status"] == "error") {
        this.error = response["error"]
        this.displayError()
        this.registering = false
        this.updateRegisterButton()
      } else {
        this.$errorPane.empty()
        this.completeCallback()
      }
    })
  }
}
