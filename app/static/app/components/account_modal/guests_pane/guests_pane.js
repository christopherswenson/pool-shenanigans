class GuestsPane {
  constructor ($element, params) {
    this.$element = Template.load($element, "guests_pane.html")

    this.$guestsContent = this.$element.find("#guests")

    this.$errorPane = this.$element.find("#error-pane")
    this.errorComponent = new ErrorPane(this.$errorPane)

    this.retrieveGuests()
    this.setupSpinner()
  }

  set guests (guests) {
    this._guests = guests
    if (guests.length > 0) {
      this.$guestsContent.html(guests.map((guest, i) => {
        let $listing = Template.load(null, "guest_listing.html", {
          "#first-name": guest.firstName,
          "#last-name": guest.lastName,
          "#guest-code": guest.guestCode
        })
        let $deleteButton = $listing.find("#delete-button")
        $deleteButton.click( () => {
          $deleteButton.prop("disabled", true)
          API.delete(`/api/user/guests/${guest.id}`, null, (data) => {
            $deleteButton.prop("disabled", true)
            this.guests = this.guests.spliced(i, 1)
          })
        })
        return $listing
      }))
    } else {
      Template.load(this.$guestsContent, "guests_empty_listing.html")
    }

  }

  get guests () {
    return this._guests
  }

  // Setup methods

  setupSpinner () {
    new Spinner(this.$element.find("spinner"))
  }

  retrieveGuests () {
    API.get("/api/user/guests", (data) => {
      this.guests = data["guests"]
    })
  }
}
