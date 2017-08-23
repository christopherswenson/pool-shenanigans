class GamesPageComponent {
  display ($element) {
    this.$element = loadTemplate($element, "games_page.html")

    this.$newGameButton = $element.find("#new-game-button")
    this.$newGameModal = $element.find("#new-game-modal")
    this.$gameSelector = $element.find("#game-select")
    this.$embedIframe = $element.find("#embed-iframe")

    this.setupNewGameButton()
    this.setupGameSelector()
  }

  setupNewGameButton () {
    this.$newGameButton.click( () => {
      let createGamePaneComponent = new CreateGamePaneComponent
      createGamePaneComponent.display(this.$newGameModal.find(".modal-content"))
      this.$newGameModal.modal()
      createGamePaneComponent.onComplete(() => {
        this.$newGameModal.modal('hide')
      })
    })
  }

  setupGameSelector () {
    this.$gameSelector.change( () => {
      let id = this.$gameSelector.val()
      this.$embedIframe.attr("src", `https://self-signed.looker.com:9999/embed/dashboards/1?game_id=${id}`)
    })
    GameStore.get((games) => {
      this.$gameSelector.empty().append(games.map((game) => {
        let $option = $("<option></option>").val(game["id"])
        $option.html(game["id"])
        return $option
      }))
    })
  }
}
