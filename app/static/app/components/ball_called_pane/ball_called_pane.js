class BallCalledPane {

  constructor ($element, params) {
    this.$element = loadTemplate($element, "ball_called_pane.html")

    this.$continueButton = this.$element.find("#continue-button")
    this.$successButton = this.$element.find("#success-button")

    this.$comboSelector = this.$element.find("#combo-count")
    this.$comboSelector.change ( () => {
      this.comboCount = parseInt(this.$comboSelector.val())
    }).val(params["comboCount"] || 1)

    this.setupShotCheckboxes()
    this.setupPocketSelector()
    this.setupBallSelector(params["ballOptions"].slice())

    this.title = params["title"]
    this.isBankShot = params["isBankShot"]
    this.isJumpShot = params["isJumpShot"]
    this.calledPocket = params["calledPocket"] || null
    this.calledBall = params["calledBall"] || null

  }

  // Property getters and setters

  set title (text) {
    let $title = this.$element.find("#title")
    $title.text(text)
  }

  get isJumpShot () {
    return this.jumpCheckbox.value
  }

  set isJumpShot (value) {
    this.jumpCheckbox.value = value
  }

  get isBankShot () {
    return this.bankCheckbox.value
  }

  set isBankShot (value) {
    this.bankCheckbox.value = value
  }

  get comboCount () {
    return parseInt(this.$comboSelector.val())
  }

  set comboCount (value) {
    this.$comboSelector.val(value)
  }

  get calledPocket () {
    return this.pocketSelector.value
  }

  set calledPocket (value) {
    this.pocketSelector.value = value
  }

  get calledBall () {
    return this.ballSelector.value
  }

  set calledBall (value) {
    this.ballSelector.value = value
  }

  // Setup functions

  maybeEnableContinueButton () {
    let enabled = this.calledPocket != null && this.calledBall != null
    this.$continueButton.prop("disabled", !enabled)
    this.$successButton.prop("disabled", !enabled)
  }

  setupShotCheckboxes () {
    let $bankCheckbox = this.$element.find("checkbox#bank")
    this.bankCheckbox = new Checkbox($bankCheckbox, {})

    let $jumpCheckbox = this.$element.find("checkbox#jump")
    this.jumpCheckbox = new Checkbox($jumpCheckbox, {})
  }

  setupBallSelector (options) {
    let $ballSelector = this.$element.find("ball-selector")
    this.ballSelector = new BallSelector($ballSelector, {
      "options": options,
    }).change( (value) => {
      this.maybeEnableContinueButton()
    })
  }

  setupPocketSelector () {
    let $pocketSelector = this.$element.find("pocket-selector")
    this.pocketSelector = new PocketSelector($pocketSelector, {})
      .change( (value) => {
        this.maybeEnableContinueButton()
      })
  }

  currentOutputState (options) {
    if (options == null) options = {}
    let ballsPocketed = (options["success"] ? [{
      "number": this.calledBall,
      "pocket": this.calledPocket
    }] : [])
    return {
      "calledBall": this.calledBall,
      "calledPocket": this.calledPocket,
      "isJumpShot": this.isJumpShot,
      "isBankShot": this.isBankShot,
      "comboCount": this.comboCount,
      "ballsPocketed": ballsPocketed
    }
  }

  // Event handlers

  backtrack (backtrackCallback) {
    let $backButton = this.$element.find("#back-button")
    $backButton.click(() => {
      backtrackCallback(this.currentOutputState())
    })
    return this
  }

  complete (completeCallback) {
    this.$continueButton.click( () => {
      completeCallback(this.currentOutputState())
    })
    this.$successButton.click( () => {
      completeCallback(this.currentOutputState({"success": true}))
    })
    return this
  }
}
