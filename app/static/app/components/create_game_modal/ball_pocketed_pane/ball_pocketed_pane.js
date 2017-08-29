
class BallPocketedPane {
  constructor ($element, params) {
    this.initBallOptions = params["ballOptions"].slice()
    this.ballsPocketed = params["ballsPocketed"].slice()

    this.$element = loadTemplate($element, "ball_pocketed_pane.html")

    this.$clearButton = this.$element.find("#clear-button")
    this.$continueButton = this.$element.find("#continue-button")
    this.$gutter = this.$element.find("#gutter")
    this.$backButton = this.$element.find("#back-button")

    this.setupBallSelector()
    this.setupPocketSelector()
    this.setupClearButton()
    this.updateGutter()
    this.setupScratchCheckbox()

    this.title = params["title"]
    this.isTableScratch = params["isTableScratch"] || false
  }

  // Property getters and setters

  get ballOptions () {
    return this.initBallOptions.filter((option) => {
      return !this.ballsPocketed.find((ballPocketed) => {
        return ballPocketed["number"] == option
      })
    })
  }

  set title (text) {
    let $title = this.$element.find("#title")
    $title.text(text)
  }

  get ballNumber () {
    return this.ballSelector.value
  }

  set ballNumber (value) {
    this.ballSelector.value = value
  }

  get pocketId () {
    return this.pocketSelector.value
  }

  set pocketId (pocket) {
    this.pocketSelector.value = pocket
  }

  get isSelectionComplete () {
    return this.ballNumber != null && this.pocketId != null
  }

  get isTableScratch () {
    return this.scratchCheckbox.value
  }

  set isTableScratch (value) {
    this.scratchCheckbox.value = value
  }

  get currentOutputState () {
    return {
      "ballsPocketed": this.ballsPocketed,
      "isTableScratch": this.isTableScratch
    }
  }

  // Setup methods

  setupScratchCheckbox () {
    let $scratchCheckbox = this.$element.find("#scratch-toggle")
    this.scratchCheckbox = new Checkbox($scratchCheckbox, {})
  }

  maybeCollectSelection () {
    if (this.isSelectionComplete) {
      this.ballsPocketed.push({
        "number": this.ballNumber,
        "pocket": this.pocketId
      })
      this.ballNumber = null
      this.pocketId = null
      this.ballSelector.options = this.ballOptions
      this.maybeCollectSelection()
      this.updateGutter()
    }
  }

  clear () {
    this.ballsPocketed = []
    this.ballSelector.options = this.ballOptions
    this.updateGutter()
  }

  setupClearButton () {
    this.$clearButton.click(() => this.clear())
  }

  setupBallSelector () {
    this.ballSelector = new BallSelector($("ball-selector"), {
      "options": this.ballOptions
    }).change( (value) => {
      this.maybeCollectSelection()
    })
  }

  setupPocketSelector () {
    this.pocketSelector = new PocketSelector($("pocket-selector"), {})
      .change( (value) => {
        this.maybeCollectSelection()
      })
  }

  updateGutter () {
    let $ballsPocketed = this.ballsPocketed.map( (ballPocketed, i) => {
      let $ball = loadTemplate(null, "guttered_ball.html")
      $ball.attr("number", ballPocketed.number)
      $ball.click( () => {
        this.ballsPocketed.splice(i, 1)
        this.ballSelector.options = this.ballOptions
        this.updateGutter()
      })
      return $ball
    })
    this.$gutter.html($ballsPocketed)
  }

  // Event handlres

  complete (completeCallback) {
    this.$continueButton.click( (event) => {
      completeCallback(this.currentOutputState)
    })
    return this
  }

  backtrack (backtrackCallback) {
    this.$backButton.click(() => {
      backtrackCallback(this.currentOutputState)
    })
    return this
  }
}
