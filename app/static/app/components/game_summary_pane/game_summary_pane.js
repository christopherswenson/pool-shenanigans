
class GameSummaryPaneComponent {
  constructor (params) {
    this.game = params["game"]
  }

  display ($element) {
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

    this.setupSaveButton()
    this.setupBackButton()
  }

  onComplete (completeCallback) {
    this.completeCallback = completeCallback
  }

  onBacktrack (backtrackCallback) {
    this.backtrackCallback = backtrackCallback
  }

  setupBackButton() {
    this.$backButton.click(() => {
      this.backtrackCallback({
        game: this.game
      })
    })
  }

  setupSaveButton () {
    this.$saveButton.click( () => {
      GameStore.post(this.game, (game) => {
        this.completeCallback(game)
      })
    })
  }
}
