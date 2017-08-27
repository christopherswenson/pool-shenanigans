
class SetupPane {

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
    this.errorComponent = new ErrorPane(this.$errorPane, {
      "errorMap": {
        "no_first_name": "Guest's first name must not be blank",
        "no_last_name": "Guest's last name must not be blank"
      }
    })

    this.setupPlayerTwoOptions()
    this.setupGuestCheckbox()
    this.setupPlayerOneLabel ()
    this.setupBreakingPlayerOptions()
    this.setupGuestNameInputs()

    this.playerTwo = params["playerTwo"] || this.playerTwoOptions[0]
    this.breakingPlayer = params["breakingPlayer"]
  }

  // Property getters

  get isPlayerTwoGuest () {
    return this.guestCheckbox.value
  }

  set isPlayerTwoGuest (value) {
    this.guestCheckbox.value = value
  }

  get playerTwoOptions () {
    return this.players.filter((player) => {
      return player["userId"] != Authentication.user["id"] && !player["isGuest"]
    })
  }

  playerOptions (players) {
    return players.map(function(player) {
      let name = player["isGuest"] ? player.fullName : player["fullName"]
      return $("<option></option>").attr("value", player.id).text(name)
    })
  }

  get playerOne () {
    return Authentication.user["player"]
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
    if (this.isPlayerTwoGuest) {
      this.guestPlayer["firstName"] = this.guestFirstName
      this.guestPlayer["lastName"] = this.guestLastName
      this.guestPlayer["fullName"] = `${this.guestPlayer["firstName"]} ${this.guestPlayer["lastName"]}`.trim() || "Guest"
      return this.guestPlayer
    } else return this.playerWithId(parseInt(this.$playerTwoSelect.val()))
  }

  set playerTwo (player) {
    if (player["isGuest"]) {
      this.isPlayerTwoGuest = true
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
    return this.playerWithId(this.$breakingPlayerSelect.val())
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

  // Setup methods

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
  }

  setupBreakingPlayerOptions () {
    let isPlayerOne = this.breakingPlayer == null || (this.breakingPlayer["id"] == this.playerOne["id"])
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
