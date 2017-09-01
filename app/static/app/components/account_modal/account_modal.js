class AccountModal {
  constructor ($element, params) {
    this.$element = Template.load($element, "account_modal.html")
    this.$modal = this.$element.find("#account-modal")
    this.$paneContent = this.$element.find("#pane-content")
    this.$modal.modal()

    this.setupPaneSelector()
    this.selectedPane = "account"
  }

  // Property getters and setters

  get selectedPane () {
    return this.$element.find(".sidebar-item[selected]").data("pane")
  }

  set selectedPane (id) {
    this.$element.find(".sidebar-item").attr("selected", null)
    this.$element.find(`.sidebar-item[data-pane="${id}"]`).attr("selected", true)
    this.initSelectedPane()
  }

  // Setup methods

  initSelectedPane () {
    switch (this.selectedPane) {
      case "guests":
        this.pane = new GuestsPane(this.$paneContent)
        break
      case "friends":
        this.pane = new FriendsPane(this.$paneContent)
        break
      case "tables":
        this.pane = new TablesPane(this.$paneContent)
        break
      default:
        this.pane = new AccountPane(this.$paneContent)
    }
  }

  setupPaneSelector () {
    this.$element.find(".sidebar-item").click( (event) => {
      let $target = $(event.target)
      this.selectedPane = $target.data("pane")
    })
  }
}
