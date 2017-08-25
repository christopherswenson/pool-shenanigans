class GamesPageComponent {
  display ($element) {
    this.$element = loadTemplate($element, "games_page.html")

    this.$newGameButton = $element.find("#new-game-button")
    this.$newGameModal = $element.find("#new-game-modal")
    this.$logoutButton = $element.find("#logout-button")
    this.$adminButton = $element.find("#admin-button")
    this.$gameSelector = $element.find("#game-select")
    this.$embedIframe = $element.find("#embed-iframe")
    this.$userGreeting = $element.find("#user-greeting")
    this.$dbName = $element.find("#db-name")

    this.games = []
    this.auth = new AuthenticationController

    this.setupNewGameButton()
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

  loginSuccess () {
    console.log("login success")
    this.setupGameSelector()
    this.updateGreeting()
    this.loadDashboard()
    this.maybeEnableAdminButton()
  }

  maybeEnableAdminButton () {
    let hidden = this.auth.user == null || !this.auth.user.isAdmin
    this.$adminButton.attr("hidden", hidden)
    this.$dbName.html(hidden ? "" : Meta.get("db_name"))
  }

  setupLogoutButton () {
    this.$logoutButton.click( () => {
      this.$logoutButton.prop("disabled", true)
      this.auth.logout(() => {
        this.$logoutButton.prop("disabled", false)
        this.$embedIframe.attr("src", "")
        this.updateGreeting()
        this.ensureLogin()
      })
    })
  }

  ensureLogin () {
    this.auth.ensureLogin(() => {
      this.loginSuccess()
    })
  }

  updateGreeting () {
    if (this.auth.user == null) {
      this.$userGreeting.html("")
    } else {
      this.$userGreeting.html(`Hello, ${this.auth.user["fullName"]}`)
    }
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
    if (this.auth.user == null) return
    if (this.selectedGame == null) return
    GameStore.embed_url(this.selectedGame["id"], (embed_url) => {
      this.$embedIframe.attr("src", embed_url)
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
