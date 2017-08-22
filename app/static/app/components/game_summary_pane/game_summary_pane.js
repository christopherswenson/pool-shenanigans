
class GameSummaryPaneComponent {
  constructor (params) {
    this.game = params["game"]
  }

  display ($element) {
    this.$element = loadTemplate($element, "game_summary_pane.html")
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
      GameStore.post(this.game, () => {
        this.completeCallback()
      })
    })
  }
}
