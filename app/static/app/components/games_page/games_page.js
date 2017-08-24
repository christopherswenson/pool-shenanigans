class GamesPageComponent {
  display ($element) {
    this.$element = loadTemplate($element, "games_page.html")

    this.$newGameButton = $element.find("#new-game-button")
    this.$newGameModal = $element.find("#new-game-modal")
    this.$loginModal = $element.find("#login-modal")
    this.$logoutButton = $element.find("#logout-button")
    this.$gameSelector = $element.find("#game-select")
    this.$embedIframe = $element.find("#embed-iframe")
    this.$userGreeting = $element.find("#user-greeting")

    this.games = []
    this.authenticatedUser = null

    this.setupNewGameButton()
    this.setupGameSelector()
    this.setupLogoutButton()
    this.ensureLogin()
  }

  get selectedGameId () {
    return parseInt(this.$gameSelector.val())
  }

  get selectedGame () {
    return (this.games || []).find((game) => {
      return game.id == this.selectedGameId
    })
  }

  setupLogoutButton () {
    this.$logoutButton.click( () => {
      this.$logoutButton.prop("disabled", true)
      AuthenticatedUserStore.logout(() => {
        this.$logoutButton.prop("disabled", false)
        this.authenticatedUser = null
        this.updateGreeting()
        this.displayLoginModal()
      })
    })
  }

  ensureLogin () {
    AuthenticatedUserStore.get((user) => {
      this.authenticatedUser = user
      if (this.authenticatedUser == null) {
        this.displayLoginModal()
      } else {
        this.updateGreeting()
        this.loadDashboard()
      }
    })
  }

  updateGreeting () {
    if (this.authenticatedUser == null) {
      this.$userGreeting.html("")
    } else {
      this.$userGreeting.html(`Hello, ${this.authenticatedUser["fullName"]}`)
    }
  }

  displayLoginModal () {
    let loginPaneComponent = new LoginPaneComponent
    loginPaneComponent.display(this.$loginModal.find(".modal-content"))
    loginPaneComponent.onComplete((response) => {
      this.authenticatedUser = response["user"]
      this.$loginModal.modal('hide')
      this.loadDashboard()
      this.updateGreeting()
    })
    this.$loginModal.modal()
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
    if (this.authenticatedUser == null) return
    if (this.selectedGame == null) return
    GameStore.embed_url(this.selectedGame["id"], (embed_url) => {
      this.$embedIframe.attr("src", embed_url)
      // console.log(embed_url)
    })
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
      this.loadDashboard()
    })
  }
}
