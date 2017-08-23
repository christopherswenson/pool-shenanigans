
class SetupComponent {

  constructor (params) {
    this.playerOneId = null
    this.playerTwoId = null
  }

  display ($element) {
    this.$element = loadTemplate($element, "setup_pane.html")

    this.$playerOneSelect = this.$element.find("#player-one-select")
    this.$playerTwoSelect = this.$element.find("#player-two-select")
    this.$breakingPlayerSelect = this.$element.find("#breaking-player-select")
    this.$nextButton = this.$element.find("#next-button")
    this.$backButton = this.$element.find("#back-button")

    PlayerStore.get((players) => {
      this.setPlayers(players)
      this.populatePlayerOptions(players)
      this.populateBreakingPlayerOptions(players)
      this.setupNextButton(players)
      this.setupBackButton()
    })
  }

  onComplete (completeCallback) {
    this.completeCallback = completeCallback
  }

  onBacktrack (backtrackCallback) {
    this.backtrackCallback = backtrackCallback
  }

  setPlayers (players) {
    this.players = players
  }

  playerOptions (players) {
    return players.map(function(player) {
      let name = `${player.firstName} ${player.lastName}`
      return $("<option></option>").attr("value", player.id).text(name)
    })
  }

  populatePlayerOptions (players) {
    this.playerOneId = players[0].id
    this.playerTwoId = players[1].id
    this.breakingPlayerId = this.playerOneId
    this.otherPlayerId = this.playerTwoId

    this.$playerOneSelect.empty().append(this.playerOptions(players)).val(this.playerOneId)
    this.$playerTwoSelect.empty().append(this.playerOptions(players)).val(this.playerTwoId)

    ;[this.$playerOneSelect, this.$playerTwoSelect].forEach( (element) => {
      element.data('previous', element.val())
      element.change(() => {
        let other = element == this.$playerOneSelect ? this.$playerTwoSelect : this.$playerOneSelect
        if (this.$playerOneSelect.val() == this.$playerTwoSelect.val()) {
          let previous = element.data('previous')
          other.val(previous)
          other.data('previous', previous)
          element.data('previous', element.val())
        }
        this.refreshPlayerIds()
        this.populateBreakingPlayerOptions(players)
      })
    })

    this.$breakingPlayerSelect.change(() => {
      this.refreshPlayerIds()
    })
  }

  refreshPlayerIds () {
    this.playerOneId = parseInt(this.$playerOneSelect.val())
    this.playerTwoId = parseInt(this.$playerTwoSelect.val())
    this.breakingPlayerId = parseInt(this.$breakingPlayerSelect.val())
    this.otherPlayerId = (this.breakingPlayerId == this.playerOneId) ? this.playerTwoId : this.playerOneId
  }

  playerWithId (players, id) {
    return players.find((player) => player.id == id)
  }

  populateBreakingPlayerOptions (players) {
    let bothPlayers = [
      this.playerWithId(players, this.playerOneId),
      this.playerWithId(players, this.playerTwoId)
    ]
    this.$breakingPlayerSelect.empty().append(this.playerOptions(bothPlayers))
    this.refreshPlayerIds()
  }

  currentOutputState () {
    let breakingPlayer = this.playerWithId(this.players, this.breakingPlayerId)
    let otherPlayer = this.playerWithId(this.players, this.otherPlayerId)
    return {
      "gamePlayers":[{
        "playerId": this.$playerOneSelect.val()
      }, {
        "playerId": this.$playerTwoSelect.val()
      }],
      "breakingPlayer": breakingPlayer,
      "otherPlayer": otherPlayer,
      "players": this.players
    }
  }

  setupNextButton (players) {
    this.$nextButton.click(() => {
      this.completeCallback(this.currentOutputState())
    })
  }

  setupBackButton () {
    this.$backButton.click(() => {
      this.backtrackCallback(this.currentOutputState())
    })
  }

}