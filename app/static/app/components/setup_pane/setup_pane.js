
class SetupComponent {

  constructor ($element, params) {
    this.$element = loadTemplate($element, "setup_pane.html")

    this.$playerOneLabel = this.$element.find("#player-one-label")
    this.$playerTwoSelect = this.$element.find("#player-two-select")
    this.$breakingPlayerSelect = this.$element.find("#breaking-player-select")
    this.$nextButton = this.$element.find("#next-button")
    this.$backButton = this.$element.find("#back-button")
    this.$guestFirstName = this.$element.find("#guest-first-name")
    this.$guestLastName = this.$element.find("#guest-last-name")

    this.guestPlayer = {
      "id": "guest",
      "isGuest": true
    }
    this.players = params["players"].concat(this.guestPlayer)

    this.$errorPane = this.$element.find("#error-pane")
    this.errorComponent = new ErrorComponent(this.$errorPane, {
      "errorMap": {
        "no_first_name": "Guest's first name must not be blank",
        "no_last_name": "Guest's last name must not be blank"
      }
    })

    this.setupGuestCheckbox(params["isPlayerTwoGuest"] || false)
    this.setupPlayerOneLabel ()
    this.setupPlayerTwoOptions(params["playerTwo"])
    this.setupBreakingPlayerOptions(params["breakingPlayer"])
    this.setupNextButton()
    this.setupBackButton()
    this.setupGuestNameInputs(params["playerTwo"])
  }

  complete (completeCallback) {
    this.completeCallback = completeCallback
    return this
  }

  onBacktrack (backtrackCallback) {
    this.backtrackCallback = backtrackCallback
  }

  get isPlayerTwoGuest () {
    return this.guestCheckbox.value
  }

  setupPlayerOneLabel () {
    this.$playerOneLabel.val(this.playerOne["fullName"])
  }

  setupGuestCheckbox (initialValue) {
    this.guestCheckbox = new CheckboxComponent($("checkbox#guest"), {
      "value": initialValue
    }).change( (value) => {
      this.$playerTwoSelect.prop("disabled", value)
      this.$guestFirstName.prop("disabled", !value)
      this.$guestLastName.prop("disabled", !value)
      this.setupBreakingPlayerOptions()
    })
  }

  setupGuestNameInputs (playerTwo) {
    ;[this.$guestFirstName, this.$guestLastName].forEach(($element) => {
      $element.keyup(() => {
        this.setupBreakingPlayerOptions()
      })
    })
    if (!playerTwo || !playerTwo["isGuest"]) return
    this.$guestFirstName.val(playerTwo["firstName"])
    this.$guestLastName.val(playerTwo["lastName"])
  }

  playerOptions (players) {
    return players.map(function(player) {
      let name = player["isGuest"] ? player.fullName : player["fullName"]
      return $("<option></option>").attr("value", player.id).text(name)
    })
  }

  setupPlayerTwoOptions (initialValue) {
    let playerTwoOptions = this.players.filter((player) => {
      return player["userId"] != AuthenticationController.user["id"]
    })
    this.$playerTwoSelect.empty().append(this.playerOptions(playerTwoOptions))
    this.$playerTwoSelect.val(initialValue || playerTwoOptions[0]["id"])

    this.$playerTwoSelect.change(() => {
      this.setupBreakingPlayerOptions()
    })
  }

  get playerOne () {
    return AuthenticationController.user["player"]
  }

  get guestFirstName () {
    return this.$guestFirstName.val().trim()
  }

  get guestLastName () {
    return this.$guestLastName.val().trim()
  }

  get playerTwo () {
    if (this.isPlayerTwoGuest) {
      this.guestPlayer["firstName"] = this.guestFirstName
      this.guestPlayer["lastName"] = this.guestLastName
      this.guestPlayer["fullName"] = `${this.guestPlayer["firstName"]} ${this.guestPlayer["lastName"]}`.trim() || "Guest"
      return this.guestPlayer
    } else return this.playerWithId(parseInt(this.$playerTwoSelect.val()))
  }

  get breakingPlayer () {
    return this.playerWithId(this.$breakingPlayerSelect.val())
  }

  get otherPlayer () {
    return this.playerOne["id"] == this.breakingPlayer["id"] ? this.playerTwo : this.playerOne
  }

  playerWithId (id) {
    return this.players.find((player) => player.id == id)
  }

  setupBreakingPlayerOptions () {
    let isPlayerOne = this.breakingPlayer == null || (this.breakingPlayer["id"] == this.playerOne["id"])
    let bothPlayers = [this.playerOne, this.playerTwo]
    this.$breakingPlayerSelect.empty().append(this.playerOptions(bothPlayers))
    this.$breakingPlayerSelect.val(isPlayerOne ? this.playerOne["id"] : this.playerTwo["id"])
  }

  currentOutputState () {
    return {
      "breakingPlayer": this.breakingPlayer,
      "playerTwo": this.playerTwo,
      "otherPlayer": this.otherPlayer
    }
  }

  get validationError () {
    if (this.playerTwo["isGuest"]) {
      if (this.guestFirstName == "") {
        return "no_first_name"
      } else if (this.guestLastName == "") {
        return "no_last_name"
      }
    }
  }

  setupNextButton () {
    this.$nextButton.click(() => {
      this.errorComponent.error = this.validationError
      if (this.validationError == null) {
        this.completeCallback(this.currentOutputState())
      }
    })
  }

  setupBackButton () {
    this.$backButton.click(() => {
      this.backtrackCallback(this.currentOutputState())
    })
  }

}
