
class GameSummaryPane {
  constructor ($element, params) {
    this.game = params["game"]
    console.log("Log: Game JSON", this.game)

    // TODO Clean this up
    this.$element = loadTemplate($element, "game_summary_pane.html", {
      "#summary-container": this.game["turns"].map((turn) => {
        return loadTemplate(null, "turn_summary.html", {
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
    })
    this.$saveButton = this.$element.find("#save-button")
    this.$backButton = this.$element.find("#back-button")
  }

  complete (completeCallback) {
    this.$saveButton.click( () => {
      this.$saveButton.prop("disabled", true)
      GameStore.post(this.game, (game) => {
        completeCallback(game)
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
