class BallCalledPaneComponent {

  constructor (params) {
    this.ballOptions = params["ballOptions"].slice()
    this.title = params.title

    this.calledBall = params["calledBall"] || null
    this.calledPocket = params["calledPocket"] || null
    this.isJumpShot = params["isJumpShot"] || false
    this.isBankShot = params["isBankShot"] || false
    this.comboCount = params["comboCount"] || 1
  }

  display ($element) {
    this.$element = loadTemplate($element, "ball_called_pane.html")

    this.$title = this.$element.find("#title")
    this.$ballSelector = this.$element.find("ball-selector")
    this.$pocketSelector = this.$element.find("pocket-selector")
    this.$comboSelector = this.$element.find("#combo-count")
    this.$continueButton = this.$element.find("#continue-button")
    this.$successButton = this.$element.find("#success-button")
    this.$backButton = this.$element.find("#back-button")

    this.setupTitle()
    this.setupBallSelector()
    this.setupPocketSelector()
    this.setupJumpCheckbox()
    this.setupBankCheckbox()
    this.setupComboSelector()
    this.setupContinueButton()
    this.setupBackButton()
    this.setupSuccessButton()
  }

  setupTitle () {
    this.$title.text(this.title)
  }

  onBacktrack (backtrackCallback) {
    this.backtrackCallback = backtrackCallback
  }

  onComplete (completeCallback) {
    this.completeCallback = completeCallback
  }

  setupBallSelector () {
    this.ballSelectorComponent = new BallSelectorComponent({
      options: this.ballOptions,
      value: this.calledBall
    })
    this.ballSelectorComponent.display(this.$ballSelector)
    this.ballSelectorComponent.onChange( (value) => {
      this.calledBall = value
      this.maybeEnableContinueButton()
    })
  }

  setupJumpCheckbox () {
    let checkboxComponent = new CheckboxComponent({value: this.isJumpShot})
    checkboxComponent.display($("checkbox#jump"))
    checkboxComponent.onChange ( (value) => {
      this.isJumpShot = value
    })
  }

  setupBankCheckbox () {
    let checkboxComponent = new CheckboxComponent({value: this.isBankShot})
    checkboxComponent.display($("checkbox#bank"))
    checkboxComponent.onChange ( (value) => {
      this.isBankShot = value
    })
  }

  setupComboSelector () {
    this.$comboSelector.change ( () => {
      this.comboCount = parseInt(this.$comboSelector.val())
    })
  }

  maybeEnableContinueButton () {
    let enabled = this.calledPocket != null && this.calledBall != null
    this.$continueButton.prop("disabled", !enabled)
    this.$successButton.prop("disabled", !enabled)
  }

  setupPocketSelector () {
    this.pocketSelectorComponent = new PocketSelectorComponent({
      value: this.calledPocket
    })
    this.pocketSelectorComponent.display(this.$pocketSelector)
    this.pocketSelectorComponent.onChange( (value) => {
      this.calledPocket = value
      this.maybeEnableContinueButton()
    })
    this.maybeEnableContinueButton()
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

  setupContinueButton () {
    this.$continueButton.click( () => {
      this.completeCallback(this.currentOutputState())
    })
  }

  setupSuccessButton () {
    this.$successButton.click( () => {
      this.completeCallback(this.currentOutputState({"success": true}))
    })
  }

  setupBackButton() {
    this.$backButton.click(() => {
      this.backtrackCallback(this.currentOutputState())
    })
  }

}
