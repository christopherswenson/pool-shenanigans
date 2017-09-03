
class GameSummaryPane {
  constructor ($element, params) {
    this.game = params["game"]
    Log.info("Game JSON", this.game)

    this.$element = Template.load($element, "game_summary_pane.html")

    this.$saveButton = this.$element.find("#save-button")
    this.$backButton = this.$element.find("#back-button")
    this.$summaryContainer = this.$element.find("#summary-container")

    this.setupSummeryContent()
  }

  // Setup methods

  setupSummeryContent () {
    let $turns = this.game["turns"].map((turn) => {
      return Template.load(null, "turn_summary.html", {
        "#player-name": turn["player"]["firstName"],
        "#shots": turn["shots"].map((shot) => {
          return shot["ballsPocketed"]
        }).flatten().map((ballPocketed) => {
          let $ball = $(`<span class="pool-ball pool-ball-sm"></span>`)
          $ball.attr("number", ballPocketed["number"])
          return $ball
        })
      })
    })

    this.$summaryContainer.html($turns)
  }

  // Event handlers

  complete (completeCallback) {
    this.$saveButton.click( () => {
      this.$saveButton.prop("disabled", true)
      API.post("/api/user/games", {
        "game": this.game
      }, (response) => {
        completeCallback(response["game"])
      })
    })
    return this
  }

  backtrack (backtrackCallback) {
    this.$backButton.click(() => {
      backtrackCallback({
        game: this.game
      })
    })
    return this
  }
}
