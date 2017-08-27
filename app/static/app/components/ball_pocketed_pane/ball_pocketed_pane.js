
class BallPocketedPane {
  constructor ($element, params) {
    this.initBallOptions = params["ballOptions"].slice()
    this.ballsPocketed = params["ballsPocketed"].slice()
    this.ballOptions = params["ballOptions"].filter((option) => {
      return !this.ballsPocketed.find((ballPocketed) => {
        return ballPocketed["number"] == option
      })
    })
    this.title = params["title"]
    
    this.$element = loadTemplate($element, "ball_pocketed_pane.html")

    let $scratchCheckbox = this.$element.find("#scratch-toggle")
    this.scratchCheckbox = new Checkbox($scratchCheckbox, {
      "value": params["isTableScratch"]
    })

    this.$title = this.$element.find("#title")
    this.$clearButton = this.$element.find("#clear-button")
    this.$continueButton = this.$element.find("#continue-button")
    this.$gutter = this.$element.find("#gutter")
    this.$backButton = this.$element.find("#back-button")

    this.setupTitle()
    this.setupBallSelector()
    this.setupPocketSelector()
    this.setupClearButton()
    this.updateGutter()
  }

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

  setupTitle () {
    this.$title.text(this.title)
  }

  get isSelectionComplete () {
    return this.currentBallNumber != null && this.currentPocketId != null
  }

  maybeCollectSelection () {
    if (this.isSelectionComplete) {
      this.ballsPocketed.push({
        "number": this.ballSelector.value,
        "pocket": this.pocketSelector.value
      })
      this.ballOptions = this.ballOptions.filter((number) => number != this.currentBallNumber)
      this.setupBallSelector()
      this.setupPocketSelector()
      this.maybeCollectSelection()
      this.updateGutter()
    }
  }

  clear () {
    this.ballsPocketed = []
    this.ballOptions = this.initBallOptions
    this.setupBallSelector()
    this.setupPocketSelector()
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
    this.maybeCollectSelection()
  }

  setupPocketSelector () {
    this.pocketSelector = new PocketSelector($("pocket-selector"), {})
    this.pocketSelector.change( (value) => {
      this.maybeCollectSelection()
    })
  }

  get isTableScratch () {
    return this.scratchCheckbox.value
  }

  get currentOutputState () {
    return {
      "ballsPocketed": this.ballsPocketed,
      "isTableScratch": this.isTableScratch
    }
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
