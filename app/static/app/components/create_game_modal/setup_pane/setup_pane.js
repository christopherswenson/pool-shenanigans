
class SetupPane {

  constructor ($element, params) {
    this.$element = Template.load($element, "setup_pane.html")

    this.$playerOneLabel = this.$element.find("#player-one-label")
    this.$playerTwoSelect = this.$element.find("#player-two-select")
    this.$breakingPlayerSelect = this.$element.find("#breaking-player-select")
    this.$nextButton = this.$element.find("#next-button")
    this.$backButton = this.$element.find("#back-button")
    this.$guestFirstName = this.$element.find("#guest-first-name")
    this.$guestLastName = this.$element.find("#guest-last-name")

    this.guestPlayer = {
      "id": "guest",
      "isGuest": true,
      "isNewGuest": true
    }
    this.players = params["players"]

    this.$errorPane = this.$element.find("#error-pane")
    this.errorComponent = new ErrorPane(this.$errorPane)

    this.setupGuestCheckbox()
    this.setupPlayerTwoOptions()
    this.setupPlayerOneLabel()
    this.setupBreakingPlayerOptions()
    this.setupGuestNameInputs()

    this.isPlayerTwoNewGuest = params["isPlayerTwoNewGuest"]
    this.playerTwo = params["playerTwo"] || this.playerTwoOptions[0]
    this.breakingPlayer = params["breakingPlayer"]
  }

  // Property getters and setters

  get isPlayerTwoNewGuest () {
    return this.guestCheckbox.value
  }

  set isPlayerTwoNewGuest (value) {
    this.guestCheckbox.value = value
  }

  get playerTwoOptions () {
    return this.players.filter((player) => {
      return player["id"] != this.playerOne["id"]
    })
  }

  get playerOne () {
    return this.playerWithId(Authentication.user["player"]["id"])
  }

  get guestFirstName () {
    return this.$guestFirstName.val().trim()
  }

  set guestFirstName (value) {
    this.$guestFirstName.val(value)
  }

  get guestLastName () {
    return this.$guestLastName.val().trim()
  }

  set guestLastName (value) {
    this.$guestLastName.val(value)
  }

  get playerTwo () {
    if (this.isPlayerTwoNewGuest) {
      this.guestPlayer["firstName"] = this.guestFirstName
      this.guestPlayer["lastName"] = this.guestLastName
      return this.guestPlayer
    } else return this.playerWithId(parseInt(this.$playerTwoSelect.val()))
  }

  set playerTwo (player) {
    if (this.isPlayerTwoNewGuest || this.playerTwoOptions == []) {
      if (player && player["isGuest"]) {
        this.guestFirstName = player["firstName"]
        this.guestLastName = player["lastName"]
      }
    } else if (player) {
      this.$playerTwoSelect.val(player["id"])
    }
    this.setupBreakingPlayerOptions()
  }

  get breakingPlayer () {
    let id = this.$breakingPlayerSelect.val()
    if (id == "guest") {
      return this.guestPlayer
    } else return this.playerWithId(id)
  }

  set breakingPlayer (player) {
    if (player) this.$breakingPlayerSelect.val(player["id"])
  }

  get otherPlayer () {
    return this.playerOne["id"] == this.breakingPlayer["id"] ? this.playerTwo : this.playerOne
  }

  playerWithId (id) {
    return this.players.find((player) => player.id == id)
  }

  get outputState () {
    return {
      "breakingPlayer": this.breakingPlayer,
      "playerTwo": this.playerTwo,
      "otherPlayer": this.otherPlayer,
      "playerOne": this.playerOne,
      "isPlayerTwoNewGuest": this.isPlayerTwoNewGuest
    }
  }

  get validationError () {
    if (this.isPlayerTwoNewGuest) {
      if (this.guestFirstName == "") {
        return "no_guest_first_name"
      } else if (this.guestLastName == "") {
        return "no_guest_last_name"
      }
    }
  }

  // Setup methods

  nameForPlayer (player) {
    return `${player["firstName"]} ${player["lastName"]} ${player["isGuest"] ? "(guest)" : ""}`
  }

  playerOptions (players) {
    return players.map((player) => {
      return $("<option></option>").attr("value", player.id).text(this.nameForPlayer(player))
    })
  }

  setupPlayerTwoOptions () {
    this.$playerTwoSelect.empty().append(this.playerOptions(this.playerTwoOptions))
    this.$playerTwoSelect.change(() => {
      this.setupBreakingPlayerOptions()
    })
  }

  setupGuestCheckbox () {
    let $guestCheckbox = this.$element.find("checkbox#guest")
    this.guestCheckbox = new Checkbox($guestCheckbox, {
      "value": false
    }).change( (value) => {
      this.$playerTwoSelect.prop("disabled", value)
      this.$guestFirstName.prop("disabled", !value)
      this.$guestLastName.prop("disabled", !value)
      this.setupBreakingPlayerOptions()
    })
    if (this.playerTwoOptions.length == 0) {
      this.guestCheckbox.value = true
      this.guestCheckbox.disabled = true
    }
  }

  setupBreakingPlayerOptions () {
    let id = this.$breakingPlayerSelect.val()
    let isPlayerOne = id == null || id == this.playerOne["id"]
    let bothPlayers = [this.playerOne, this.playerTwo]
    this.$breakingPlayerSelect.empty().append(this.playerOptions(bothPlayers))
    this.$breakingPlayerSelect.val(isPlayerOne ? this.playerOne["id"] : this.playerTwo["id"])
  }

  setupPlayerOneLabel () {
    this.$playerOneLabel.val(this.playerOne["fullName"])
  }

  setupGuestNameInputs () {
    ;[this.$guestFirstName, this.$guestLastName].forEach(($element) => {
      $element.keyup(() => {
        this.setupBreakingPlayerOptions()
      })
    })
  }

  // Event handlers

  complete (completeCallback) {
    this.$nextButton.click(() => {
      this.errorComponent.error = this.validationError
      if (this.validationError == null) {
        completeCallback(this.outputState)
      }
    })
    return this
  }

  backtrack (backtrackCallback) {
    this.$backButton.click(() => {
      backtrackCallback(this.outputState)
    })
    return this
  }
}
