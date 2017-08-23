
class BallPocketedPaneComponent {
  constructor (params) {
    this.initBallOptions = params["ballOptions"].slice()
    this.ballsPocketed = params["ballsPocketed"].slice()
    this.ballOptions = params["ballOptions"].filter((option) => {
      return !this.ballsPocketed.find((ballPocketed) => {
        return ballPocketed["number"] == option
      })
    })
    this.title = params.title

    this.currentBallNumber = null
    this.currentPocketId = null
    this.isTableScratch = false
  }

  display ($element) {
    this.$element = loadTemplate($element, "ball_pocketed_pane.html")

    this.$title = this.$element.find("#title")
    this.$clearButton = this.$element.find("#clear-button")
    this.$continueButton = this.$element.find("#continue-button")
    this.$gutter = this.$element.find("#gutter")
    this.$backButton = this.$element.find("#back-button")

    this.setupTitle()
    this.setupBallSelector()
    this.setupPocketSelector()
    this.setupScratchCheckbox()

    this.setupClearButton()
    this.setupContinueButton()
    this.setupBackButton()
    this.updateGutter()
  }

  onComplete (completeCallback) {
    this.completeCallback = completeCallback
  }

  onBacktrack (backtrackCallback) {
    this.backtrackCallback = backtrackCallback
  }

  setupTitle () {
    this.$title.text(this.title)
  }

  isSelectionComplete () {
    return this.currentBallNumber != null && this.currentPocketId != null
  }

  maybeCollectSelection () {
    if (this.isSelectionComplete()) {
      this.ballsPocketed.push({
        number: this.currentBallNumber,
        pocket: this.currentPocketId
      })
      this.ballOptions = this.ballOptions.filter((number) => number != this.currentBallNumber)
      this.setupBallSelector()
      this.setupPocketSelector()
      this.maybeCollectSelection()
      this.updateGutter()
    }
  }

  clearCurrent () {
    this.ballsPocketed = []
    this.ballOptions = this.initBallOptions
    this.setupBallSelector()
    this.setupPocketSelector()
    this.updateGutter()
  }

  setupClearButton () {
    this.$clearButton.click(this.clearCurrent.bind(this))
  }

  setupBallSelector () {
    this.currentBallNumber = null
    this.ballSelectorComponent = new BallSelectorComponent({
      options: this.ballOptions
    })
    this.ballSelectorComponent.display($("ball-selector"))
    this.ballSelectorComponent.onChange( (value) => {
      this.currentBallNumber = value
      this.maybeCollectSelection()
    })
    this.maybeCollectSelection()
  }

  setupPocketSelector () {
    this.currentPocketId = null
    this.pocketSelectorComponent = new PocketSelectorComponent({})
    this.pocketSelectorComponent.display($("pocket-selector"))
    this.pocketSelectorComponent.onChange( (value) => {
      this.currentPocketId = value
      this.maybeCollectSelection()
    })
  }

  setupScratchCheckbox () {
    let checkboxComponent = new CheckboxComponent({value: this.isTableScratch})
    checkboxComponent.display($("checkbox"))
    checkboxComponent.onChange ( (value) => {
      this.isTableScratch = true
    })
  }

  currentOutputState () {
    return {
      "ballsPocketed": this.ballsPocketed,
      "isTableScratch": this.isTableScratch
    }
  }

  setupContinueButton () {
    this.$continueButton.click( (event) => {
      this.completeCallback(this.currentOutputState())
    })
  }

  setupBackButton () {
    this.$backButton.click(() => {
      this.backtrackCallback(this.currentOutputState())
    })
  }

  updateGutter () {
    let $ballsPocketed = this.ballsPocketed.map( (ballPocketed, i) => {
      let $ball = loadTemplate(null, "guttered_ball.html")
      $ball.attr("number", ballPocketed.number)
      $ball.click( () => {
        this.ballsPocketed.splice(i, 1)
        this.ballOptions.push(ballPocketed["number"])
        this.setupBallSelector()
        this.updateGutter()
      })
      return $ball
    })
    this.$gutter.html($ballsPocketed)
  }
}
