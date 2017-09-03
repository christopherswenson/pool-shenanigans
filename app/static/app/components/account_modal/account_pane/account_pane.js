
class AccountPane {
  constructor ($element, params) {
    this.$element = Template.load($element, "account_pane.html")

    this.$usernameInput = this.$element.find("#username-input")
    this.$oldPasswordInput = this.$element.find("#old-password-input")
    this.$passwordInput = this.$element.find("#password-input")
    this.$passwordRepeatInput = this.$element.find("#password-repeat-input")
    this.$firstNameInput = this.$element.find("#first-name-input")
    this.$lastNameInput = this.$element.find("#last-name-input")

    this.$firstNameEditButton = this.$element.find("#first-name-edit-button")
    this.$lastNameEditButton = this.$element.find("#last-name-edit-button")
    this.$usernameEditButton = this.$element.find("#username-edit-button")
    this.$passwordEditButton = this.$element.find("#password-edit-button")
    this.$passwordResetButton = this.$element.find("#password-reset-button")
    this.$passwordChangeForm = this.$element.find("#password-change-form")

    let $errorPane = this.$element.find("#error-pane")
    this.errorComponent = new ErrorPane($errorPane)

    this.usernameValue = Authentication.user["username"]
    this.firstNameValue = Authentication.user["player"]["firstName"]
    this.lastNameValue = Authentication.user["player"]["lastName"]

    this.setupFirstNameEditButton()
    this.setupLastNameEditButton()
    this.setupUsernameEditButton()
    this.setupPasswordChangeForm()
  }

  get oldPasswordValue () {
    return this.$oldPasswordInput.val()
  }

  get usernameValue () {
    return this.$usernameInput.val().trim()
  }

  set usernameValue (username) {
    this.$usernameInput.val(username)
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

  set firstNameValue (firstName) {
    this.$firstNameInput.val(firstName)
  }

  get lastNameValue () {
    return this.$lastNameInput.val().trim()
  }

  set lastNameValue (lastName) {
    this.$lastNameInput.val(lastName)
  }

  // Setup methods

  toggleEditButton ($button) {
    $button.toggleClass("btn-success")
    $button.toggleClass("btn-secondary")
    let newLabel = $button.data("kind") == "edit" ? "Save" : "Edit"
    $button.data("kind", $button.data("kind") == "edit" ? "save" : "edit")
    $button.html(newLabel)
  }

  setupLastNameEditButton () {
    this.$lastNameEditButton.click( () => {
      if (this.$lastNameEditButton.data("kind") == "edit") {
        this.toggleEditButton(this.$lastNameEditButton)
        this.$lastNameInput.prop("disabled", false)
        this.$lastNameInput.focus()
      } else {
        if (this.lastNameValue == "") {
          this.errorComponent.error = "no_last_name"
        } else {
          this.$lastNameEditButton.prop("disabled", true)
          this.errorComponent.error = null
          API.patch("/api/user", {
            "lastName": this.lastNameValue
          }, (response) => {
            this.errorComponent.error = response["error"]
            this.$lastNameEditButton.prop("disabled", false)
            if (response["status"] == "ok") {
              this.$lastNameInput.prop("disabled", true)
              this.toggleEditButton(this.$lastNameEditButton)
            }
          })
        }
      }
    })
  }

  setupFirstNameEditButton () {
    this.$firstNameEditButton.click( () => {
      if (this.$firstNameEditButton.data("kind") == "edit") {
        this.toggleEditButton(this.$firstNameEditButton)
        this.$firstNameInput.prop("disabled", false)
        this.$firstNameInput.focus()
      } else {
        if (this.firstNameValue == "") {
          this.errorComponent.error = "no_first_name"
        } else {
          this.$firstNameEditButton.prop("disabled", true)
          this.errorComponent.error = null
          API.patch("/api/user", {
            "firstName": this.firstNameValue
          }, (response) => {
            this.errorComponent.error = response["error"]
            this.$firstNameEditButton.prop("disabled", false)
            if (response["status"] == "ok") {
              this.$firstNameInput.prop("disabled", true)
              this.toggleEditButton(this.$firstNameEditButton)
            }
          })
        }
      }
    })
  }

  setupUsernameEditButton () {
    this.$usernameEditButton.click( () => {
      if (this.$usernameEditButton.data("kind") == "edit") {
        this.toggleEditButton(this.$usernameEditButton)
        this.$usernameInput.prop("disabled", false)
        this.$usernameInput.focus()
      } else {
        if (this.usernameValue == "") {
          this.errorComponent.error = "no_first_name"
        } else {
          this.$usernameEditButton.prop("disabled", true)
          this.errorComponent.error = null
          API.patch("/api/user", {
            "username": this.usernameValue
          }, (response) => {
            this.errorComponent.error = response["error"]
            this.$usernameEditButton.prop("disabled", false)
            if (response["status"] == "ok") {
              this.$usernameInput.prop("disabled", true)
              this.toggleEditButton(this.$usernameEditButton)
            }
          })
        }
      }
    })
  }

  setupPasswordChangeForm () {
    this.$passwordEditButton.click( () => {
      this.$passwordChangeForm.attr("hidden", null)
      this.$passwordEditButton.prop("disabled", true)
      this.$oldPasswordInput.prop("disabled", false)
      this.$oldPasswordInput.focus()
    })
    this.$passwordResetButton.click( () => {
      if (this.passwordValue.length < MIN_PASSWORD_LENGTH) {
        this.errorComponent.error = "password_too_short"
      } else if (this.passwordValue != this.passwordRepeatValue) {
        this.errorComponent.error = "no_password_match"
      } else {
        this.$passwordResetButton.prop("disabled", true)
        this.errorComponent.error = null
        API.patch("/api/user", {
          "oldPassword": this.oldPasswordValue,
          "newPassword": this.passwordValue
        }, (response) => {
          this.errorComponent.error = response["error"]
          this.$passwordResetButton.prop("disabled", false)
          if (response["status"] == "ok") {
            this.$passwordChangeForm.attr("hidden", true)
            this.$passwordEditButton.prop("disabled", false)
            this.$oldPasswordInput.prop("disabled", true)
          }
        })
      }
    })
  }
}
