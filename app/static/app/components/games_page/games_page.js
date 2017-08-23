class GamesPageComponent {
  display ($element) {
    this.$element = loadTemplate($element, "games_page.html")

    this.$newGameButton = $element.find("#new-game-button")
    this.$newGameModal = $element.find("#new-game-modal")
    this.$gameSelector = $element.find("#game-select")
    this.$embedIframe = $element.find("#embed-iframe")

    this.games = []

    this.setupNewGameButton()
    this.setupGameSelector()
  }

  setupNewGameButton () {
    this.$newGameButton.click( () => {
      let createGamePaneComponent = new CreateGamePaneComponent
      createGamePaneComponent.display(this.$newGameModal.find(".modal-content"))
      this.$newGameModal.modal()
      createGamePaneComponent.onComplete((game) => {
        this.games.push(game)
        this.updateGameOptions()
        this.$gameSelector.val(game["id"])
        this.$newGameModal.modal('hide')
        this.loadDashboard()
      })
    })
  }

  loadDashboard () {
    let id = this.$gameSelector.val()
    this.$embedIframe.attr("src", `https://self-signed.looker.com:9999/embed/dashboards/1?game_id=${id}`)
  }

  updateGameOptions() {
    this.$gameSelector.empty().append(this.games.map((game) => {
      let $option = $("<option></option>").val(game["id"])
      $option.html(game["id"])
      return $option
    }))
  }

  setupGameSelector () {
    this.$gameSelector.change( () => {
      this.loadDashboard()
    })
    GameStore.get((games) => {
      this.games = games
      this.updateGameOptions()
    })
  }
}
