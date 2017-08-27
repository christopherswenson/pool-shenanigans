
const Authentication = {

  authenticatedUser: null,

  get user () {
    return this.authenticatedUser
  },

  displayLoginModal (completeCallback) {
    let loginPaneComponent = new LoginPaneComponent
    loginPaneComponent.display($("login-modal-container"))
    loginPaneComponent.onComplete((user) => {
      this.authenticatedUser = user
      completeCallback(user)
    })
  },

  ensureLogin (completeCallback) {
    AuthenticatedUserStore.get((user) => {
      this.authenticatedUser = user
      if (this.authenticatedUser == null) {
        this.displayLoginModal(completeCallback)
      } else completeCallback(user)
    })
  },

  login (email, password, completeCallback) {
    AuthenticatedUserStore.login({
      "email": email,
      "password": password
    }, (response) => {
      this.authenticatedUser = response["user"]
      completeCallback(response)
    })
  },

  displayRegisterModal (username, password, completeCallback) {
    let registerModalComponent = new RegisterModalComponent
    registerModalComponent.display($("register-modal-container"))
    registerModalComponent.onComplete((user) => {
      this.authenticatedUser = user
      completeCallback(user)
    })
  },

  register (credentials, user, completeCallback) {
    AuthenticatedUserStore.register(
      credentials,
      user,
      (response) => {
        this.authenticatedUser = response["user"]
        completeCallback(response)
      }
    )
  },

  logout (completeCallback) {
    AuthenticatedUserStore.logout(() => {
      this.authenticatedUser = null
      completeCallback()
    })
  }
}
