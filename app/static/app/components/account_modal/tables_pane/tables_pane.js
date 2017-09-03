class TablesPane {
  constructor ($element, params) {
    this.$element = Template.load($element, "tables_pane.html")

    this.$tablesContent = this.$element.find("#tables")
    this.$joinButton = this.$element.find("#join-button")
    this.$createButton = this.$element.find("#create-button")
    this.$joinTableNameInput = this.$element.find("#join-table-name-input")
    this.$createTableNameInput = this.$element.find("#create-table-name-input")

    this.$errorPane = this.$element.find("#error-pane")
    this.errorComponent = new ErrorPane(this.$errorPane)

    this.retrieveTables()
    this.setupJoinButton()
    this.setupCreateButton()
    this.setupSpinner()
  }

  // Property getters and setters

  get joinTableName () {
    return this.$joinTableNameInput.val().trim()
  }

  set joinTableName (value) {
    this.$joinTableNameInput.val(value)
  }

  get createTableName () {
    return this.$createTableNameInput.val().trim()
  }

  set createTableName (value) {
    this.$createTableNameInput.val(value)
  }

  set tables (tables) {
    this._tables = tables
    this.$tablesContent.html(tables.map((table, i) => {
      let $listing = Template.load(null, "table_listing.html", {
        "#table-name": table.name
      })
      let $leaveButton = $listing.find("#leave-button")
      $leaveButton.click(() => {
        $leaveButton.prop("disabled", true)
        this.errorComponent.error = null
        API.post("/api/user/tables/leave", {
          "name": table.name
        }, (response) => {
          $leaveButton.prop("disabled", false)
          this.errorComponent.error = response["error"]
          if (response["status"] == "ok") {
            this.tables = this.tables.spliced(i, 1)
          }
        })
      })
      return $listing
    }))
  }

  get tables () {
    return this._tables
  }

  retrieveTables () {
    API.get("/api/user/tables", (data) => {
      this.tables = data["tables"]
    })
  }

  setupJoinButton () {
    this.$joinButton.click( () => {
      if (this.joinTableName == "") {
        this.errorComponent.error = "no_join_table_name"
      } else {
        this.errorComponent.error = null
        this.$joinButton.prop("disabled", true)
        API.post("/api/user/tables/join", {
          "name": this.joinTableName
        }, (response) => {
          this.$joinButton.prop("disabled", false)
          this.errorComponent.error = response["error"]
          if (response["status"] == "ok") {
            this.tables = this.tables.concat(response["table"])
            this.joinTableName = ""
          }
        })
      }
    })
  }

  setupCreateButton () {
    this.$createButton.click( () => {
      if (this.createTableName == "") {
        this.errorComponent.error = "no_create_table_name"
      } else {
        this.errorComponent.error = null
        this.$createButton.prop("disabled", true)
        API.post("/api/user/tables", {
          "name": this.createTableName
        }, (response) => {
          this.$createButton.prop("disabled", false)
          this.errorComponent.error = response["error"]
          if (response["status"] == "ok") {
            this.tables = this.tables.concat(response["table"])
            this.createTableName = ""
          }
        })
      }
    })
  }

  setupSpinner () {
    new Spinner(this.$element.find("spinner"))
  }
}
