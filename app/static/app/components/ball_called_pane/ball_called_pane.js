class BallCalledPane {

  constructor ($element, params) {
    this.title = params.title

    this.$element = loadTemplate($element, "ball_called_pane.html")

    this.$continueButton = this.$element.find("#continue-button")
    this.$successButton = this.$element.find("#success-button")

    this.bankCheckbox = new Checkbox($("checkbox#bank"), {
      "value": params["isBankShot"] || false
    })

    this.jumpCheckbox = new Checkbox($("checkbox#jump"), {
      "value": params["isJumpShot"] || false
    })

    let $ballSelector = this.$element.find("ball-selector")
    this.ballSelectorComponent = new BallSelector($ballSelector, {
      "options": params["ballOptions"].slice(),
      "value": params["calledBall"] || null
    }).change( (value) => {
      this.maybeEnableContinueButton()
    })

    let $pocketSelector = this.$element.find("pocket-selector")
    this.pocketSelector = new PocketSelector($pocketSelector, {
      "value": params["calledPocket"] || null
    }).change( (value) => {
      this.maybeEnableContinueButton()
    })

    this.$comboSelector = this.$element.find("#combo-count")
    this.$comboSelector.change ( () => {
      this.comboCount = parseInt(this.$comboSelector.val())
    }).val(params["comboCount"] || 1)

    this.$element.find("#title").text(params["title"])
  }

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

  get isJumpShot () {
    return this.jumpCheckbox.value
  }

  get isBankShot () {
    return this.bankCheckbox.value
  }

  get comboCount () {
    return parseInt(this.$comboSelector.val())
  }

  maybeEnableContinueButton () {
    let enabled = this.calledPocket != null && this.calledBall != null
    this.$continueButton.prop("disabled", !enabled)
    this.$successButton.prop("disabled", !enabled)
  }

  get calledPocket () {
    return this.pocketSelector.value
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
}
