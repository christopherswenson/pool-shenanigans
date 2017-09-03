
const Authentication = {

  authenticatedUser: null,

  get user () {
    return this.authenticatedUser
  },

  displayLoginModal (completeCallback) {
    let loginPaneComponent = new LoginModal($("login-modal-container"))
      .complete((user) => {
        this.authenticatedUser = user
        completeCallback(user)
      })
  },

  ensureLogin (completeCallback) {
    API.get("/api/user", (data) => {
      this.authenticatedUser = data["user"]
      if (this.authenticatedUser == null) {
        this.displayLoginModal(completeCallback)
      } else completeCallback(this.authenticatedUser)
    })
  },

  login (username, password, completeCallback) {
    API.post("/api/user/login", {
      "username": username,
      "password": password
    }, (response) => {
      this.authenticatedUser = response["user"]
      completeCallback(response)
    })
  },

  displayRegisterModal (username, password, completeCallback) {
    let registerModalComponent = new RegisterModal($("register-modal-container"))
      .complete((user) => {
        this.authenticatedUser = user
        completeCallback(user)
      })
  },

  register (credentials, player, completeCallback) {
    API.post("/api/user/register", {
      "credentials": credentials,
      "player": player
    }, (response) => {
        this.authenticatedUser = response["user"]
        completeCallback(response)
      }
    )
  },

  logout (completeCallback) {
    API.post("/api/user/logout", null, (response) => {
      this.authenticatedUser = null
      completeCallback()
    })
  }
}
