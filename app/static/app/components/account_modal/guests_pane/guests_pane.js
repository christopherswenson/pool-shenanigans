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
          API.delete("/api/user/guests", {
            "id": guest.id
          }, (data) => {
            // TODO error?
            $deleteButton.prop("disabled", true)
            let x = this.guests // TODO HACK
            x.splice(i, 1)
            this.guests = x
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
