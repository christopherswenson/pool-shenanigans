class GamesPage {
  constructor ($element, params) {
    this.$element = Template.load($element, "games_page.html")

    this.$newGameButton = this.$element.find("#new-game-button")
    this.$logoutButton = this.$element.find("#logout-button")
    this.$adminButton = this.$element.find("#admin-button")
    this.$gameSelector = this.$element.find("#game-select")
    this.$embedIframe = this.$element.find("#embed-iframe")
    this.$userGreeting = this.$element.find("#user-greeting")
    this.$dbName = this.$element.find("#db-name")
    this.$accountButton = this.$element.find("#account-button")

    this.games = []

    this.setupNewGameButton()
    this.setupLogoutButton()
    this.setupAccountButton()

    this.ensureLogin()
  }

  // Property getters and setters

  get gameId () {
    return parseInt(this.$gameSelector.val())
  }

  get game () {
    return (this.games || []).find((game) => {
      return game.id == this.gameId
    })
  }

  // Content manipulation methods

  loginSuccess () {
    this.setupGameSelector()
    this.updateGreeting()
    this.loadDashboard()
    this.maybeEnableAdminButton()
  }

  maybeEnableAdminButton () {
    let hidden = Authentication.user == null || !Authentication.user.isAdmin
    this.$adminButton.attr("hidden", hidden)
    this.$dbName.html(hidden ? "" : Meta.get("db_name"))
  }

  ensureLogin () {
    Authentication.ensureLogin(() => {
      this.loginSuccess()
    })
  }

  updateGreeting () {
    if (Authentication.user == null) {
      this.$userGreeting.html("")
    } else {
      this.$userGreeting.html(`Hello, ${Authentication.user["fullName"]}`)
    }
  }

  loadDashboard () {
    if (Authentication.user == null) return
    if (this.game == null) return
    GameStore.embed_url(this.game["id"], (embed_url) => {
      this.$embedIframe.attr("src", embed_url)
    })
  }

  updateGameOptions () {
    this.$gameSelector.empty().append(this.games.map((game) => {
      let $option = $("<option></option>").val(game["id"])
      $option.html(game["id"])
      return $option
    }))
  }

  // Setup methods

  setupLogoutButton () {
    this.$logoutButton.click( () => {
      this.$logoutButton.prop("disabled", true)
      Authentication.logout(() => {
        this.$logoutButton.prop("disabled", false)
        this.$embedIframe.attr("src", "")
        this.updateGreeting()
        this.ensureLogin()
      })
    })
  }

  setupAccountButton () {
    this.$accountButton.click( () => {
      new AccountModal(this.$element.find("account-modal-container"))
    })
  }

  setupNewGameButton () {
    this.$newGameButton.click( () => {
      new CreateGameModal(this.$element.find("new-game-modal-container")).complete((game) => {
        this.games.push(game)
        this.updateGameOptions()
        this.$gameSelector.val(game["id"])
        this.loadDashboard()
      })
    })
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
