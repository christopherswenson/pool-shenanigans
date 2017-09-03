class FriendsPane {
  constructor ($element, params) {
    this.$element = Template.load($element, "friends_pane.html")

    this.$friendsTakenContent = this.$element.find("#friends-taken")
    this.$friendsGivenContent = this.$element.find("#friends-given")

    this.$errorPane = this.$element.find("#error-pane")
    this.errorComponent = new ErrorPane(this.$errorPane)

    this.$friendUsernameInput = this.$element.find("#friend-username-input")
    this.$addFriendButton = this.$element.find("#add-friend-button")

    this.retrieveFriends()
    this.setupAddFriendButton()
    this.setupSpinners()
  }

  get friendUsername () {
    return this.$friendUsernameInput.val().trim()
  }

  set friendUsername (value) {
    this.$friendUsernameInput.val(value)
  }

  set friendsTaken (friends) {
    this._friendsTaken = friends
    if (friends.length > 0) {
      this.$friendsTakenContent.html(friends.map((friend, i) => {
        let $listing = Template.load(null, "friend_taken_listing.html", {
          "#first-name": friend.firstName,
          "#last-name": friend.lastName
        })
        let $acceptButton = $listing.find("#accept-button")
        $acceptButton.click( () => {
          $acceptButton.prop("disabled", true)
          this.errorComponent.error = null
          API.post("/api/user/friends", {
            "id": friend.id
          }, (response) => {
            $acceptButton.prop("disabled", false)
            this.errorComponent.error = response["error"]
            if (response["status"] == "ok") {
              this.friendsGiven = this.friendsGiven.concat(friend)
              let x = this.friendsTaken // TODO HACK
              x.splice(i, 1)
              this.friendsTaken = x
            }
          })
        })
        return $listing
      }))
    } else {
      Template.load(this.$friendsTakenContent, "friends_taken_empty_listing.html")
    }
  }

  get friendsTaken () {
    return this._friendsTaken
  }

  set friendsGiven (friends) {
    this._friendsGiven = friends
    this.$friendsGivenContent.html(friends.map((friend, i) => {
      let $listing = Template.load(null, "friend_given_listing.html", {
        "#first-name": friend.firstName,
        "#last-name": friend.lastName
      })
      let $unfriendButton = $listing.find("#unfriend-button")
      $unfriendButton.click( () => {
        $unfriendButton.prop("disabled", true)
        this.errorComponent.error = null
        API.delete("api/user/friends", {
          "id": friend.id
        }, (response) => {
          $unfriendButton.prop("disabled", false)
          this.errorComponent.error = response["error"]
          if (response["status"] == "ok") {
            let x = this.friendsGiven // TODO HACK
            x.splice(i, 1)
            this.friendsGiven = x
          }
        })
      })
      return $listing
    }))
  }

  get friendsGiven () {
    return this._friendsGiven
  }

  // Setup methods

  retrieveFriends () {
    API.get("/api/user/friend-requests", (response) => {
      this.friendsTaken = response["friends"]
    })

    API.get("api/user/friends", (response) => {
      this.friendsGiven = response["friends"]
    })
  }

  setupAddFriendButton () {
    this.$addFriendButton.click(() => {
      if (this.friendUsername == "") {
        this.errorComponent.error = "no_friend_username"
      } else {
        this.$addFriendButton.prop("disabled", true)
        this.errorComponent.error = null
        API.post("/api/user/friends", {
          "username": this.friendUsername
        }, (response) => {
          this.$addFriendButton.prop("disabled", false)
          this.errorComponent.error = response["error"]
          if (response["status"] == "ok") {
            this.friendsGiven = this.friendsGiven.concat(response["friend"])
            this.friendUsername = ""
          }
        })
      }
    })
  }

  setupSpinners () {
    new Spinner(this.$element.find("spinner"))
  }
}
