
class CreateGamePaneComponent {

  display ($element) {
    this.$element = $element

    this.players = []
    this.breakingPlayer = null
    this.gamePlayers = []
    this.ballsPocketed = []
    this.isTableOpen = true
    this.ballsRemaining = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

    this.game = {}

    this.setupGame()
  }

  onComplete (completeCallback) {
    this.completeCallback = completeCallback
  }

  setupGame () {
    let setupComponent = new SetupComponent({})
    setupComponent.display(this.$element)
    setupComponent.onComplete( (results) => {
      this.game["breakingPlayer"] = results["breakingPlayer"]
      this.game["otherPlayer"] = results["otherPlayer"]
      this.beginGameplay()
    })
  }

  gameSummary () {
    let gameSummaryComponent = new GameSummaryPaneComponent({
      "game": this.game
    })
    gameSummaryComponent.display(this.$element)
    gameSummaryComponent.onComplete( () => {
      this.completeCallback()
    })
  }

  endGame () {
    let turn = this.getCurrentTurn()
    let isCurrentPlayerWinner = turn["shots"][turn["shots"].length - 1]["isSuccess"]
    this.getCurrentPlayer()["isWinner"] = !!isCurrentPlayerWinner
    this.getOtherPlayer()["isWinner"] = !isCurrentPlayerWinner

    this.game["endedAt"] = new Date(Date.now())
    this.gameSummary()
  }

  beginGameplay () {
    this.game["gamePlayers"] = [this.game["breakingPlayer"], this.game["otherPlayer"]]
    this.game["turns"] = []
    this.game["startedAt"] = new Date(Date.now())
    this.normalTurn()
  }

  getTurnTitle () {
    let kind = this.getCurrentShot()["isBreak"] ? "Break" : "Shot"
    return `${this.getCurrentPlayer()["firstName"]}'s ${kind}`
  }

  getCall () {
    let shot = this.getCurrentShot()
    if (!shot["isBreak"]) {
      let ballCalledPaneComponent = new BallCalledPaneComponent({
        "ballOptions": this.calledBallOptions(),
        "title": this.getTurnTitle(),

        "calledBall": null,
        "calledPocket": null,
        "isJumpShot": false,
        "isBankShot": false,
        "comboCount": 1
      })
      ballCalledPaneComponent.display(this.$element)
      ballCalledPaneComponent.onComplete((call) => {
        shot["calledBall"]    = call["calledBall"]
        shot["calledPocket"]  = call["calledPocket"]
        shot["isJumpShot"]    = call["isJumpShot"]
        shot["isBankShot"]    = call["isBankShot"]
        shot["comboCount"]    = call["comboCount"]

        this.getOutcome(call)
      })
    } else {
      shot["calledBall"]   = null
      shot["calledPocket"] = null
      shot["isJumpShot"]   = false
      shot["isBankShot"]   = false
      shot["comboCount"]   = 1

      this.getOutcome({})
    }
  }

  calledBallOptions() {
    let ballsRemaining = this.getBallsRemaining()
    let atLeastOneStripe = ballsRemaining.find((number) => this.patternOfBall(number) == "Stripe")
    let atLeastOneSolid = ballsRemaining.find((number) => this.patternOfBall(number) == "Solid")

    let pattern = this.getCurrentPlayer()["pattern"]
    if (pattern != null) {
      let ballsOfPattern = ballsRemaining.filter((number) => {
        return this.patternOfBall(number) == pattern
      })
      return ballsOfPattern.length ? ballsOfPattern : [8]
    } else if (!atLeastOneSolid || !atLeastOneStripe) {
      return ballsRemaining
    } else {
      return ballsRemaining.filter((number) => number != 8)
    }
  }

  getOutcome (completeOutcome) {
    let ballsRemaining = this.getBallsRemaining()

    let ballPocketedPaneComponent = new BallPocketedPaneComponent({
      "title": this.getTurnTitle(),

      "ballOptions": ballsRemaining.concat(0),
      "ballsPocketed": [],
      "isTableScratch": false
    })
    ballPocketedPaneComponent.display(this.$element)
    ballPocketedPaneComponent.onComplete((outcome) => {
      let turn = this.getCurrentTurn()
      let shot = this.getCurrentShot()
      shot["isSuccess"] = false
      shot["ballsPocketed"] = outcome["ballsPocketed"]
      shot["ballsPocketed"].forEach((ballPocketed) => {
        let isCalled = this.ballPocketedIsCalled(shot, ballPocketed)
        ballPocketed["isCalled"] = isCalled
        ballPocketed["isSlop"] = false
        if (isCalled) {
          shot["isSuccess"] = true
          let ballPattern = this.patternOfBall(ballPocketed["number"])
          this.getCurrentPlayer()["pattern"] = ballPattern
          this.getOtherPlayer()["pattern"] = this.otherPattern(ballPattern)
        } else if (ballPocketed["number"] != 0 && ballPocketed["number"] != 8 && !turn["isBreakingTurn"]) {
          ballPocketed["isSlop"] = true
        }
        if (ballPocketed["number"] == 0) shot["isScratch"] = true
        if (ballPocketed["number"] == 8) shot["isFinal"] = true
        shot["ballsRemaining"] = shot["ballsRemaining"].filter((number) => number != ballPocketed["number"])
      })

      if (outcome["isTableScratch"]) shot["isScratch"] = true
      if (shot["isBreak"]) shot["isSuccess"] = shot["ballsPocketed"].length > 0
      if (shot["isScratch"]) shot["isSuccess"] = false

      if (shot["isFinal"]) {
        turn["isFinal"] = true
        this.endGame()
      } else if (shot["isSuccess"]) {
        this.normalShot()
      } else this.normalTurn()
    })

    // ballPocketedPaneComponent.onBacktrack(backtrackCallback)
  }

  ballPocketedIsCalled(shot, ballPocketed) {
    return shot["calledBall"] == ballPocketed["number"] &&
      shot["calledPocket"] == ballPocketed["pocket"]
  }

  patternOfBall (number) {
    if (number >= 1 && number <= 7) {
      return "Stripe"
    } else if (number >= 9 && number <= 15) {
      return "Solid"
    }
  }

  otherPattern (pattern) {
    switch (pattern) {
      case "Stripe":
        return "Solid"
      case "Solid":
        return "Stripe"
    }
  }

  normalShot () {
    let turn = this.getCurrentTurn()

    let shot = {}
    shot["number"] = turn["shots"].length
    shot["isBreak"] = turn["isBreakingTurn"] && shot["number"] == 0
    shot["isTableOpen"] = this.getCurrentPlayer()["pattern"] == null
    shot["ballsRemaining"] = this.getBallsRemaining()

    turn["shots"].push(shot)

    this.getCall()
  }

  getCurrentTurn () {
    let turns = this.game["turns"]
    if (turns) return turns[turns.length - 1]
    else return null
  }

  getCurrentShot () {
    let shots = this.getCurrentTurn()["shots"]

    if (shots) return shots[shots.length - 1]
    else return null
  }

  getCurrentPlayer () {
    return this.getCurrentTurn()["player"]
  }

  isBreakingTurn () {
    return this.getCurrentTurn()["isBreakingTurn"]
  }

  getOtherPlayer () {
    let currentPlayer = this.getCurrentPlayer()

    return (this.game["gamePlayers"][0] == currentPlayer) ? this.game["gamePlayers"][1] : this.game["gamePlayers"][0]
  }

  getBallsRemaining () {
    let turn = this.game["turns"].slice().reverse().find((turn) => {
      return turn["shots"].length > 0
    })
    if (turn) {
      let shot = turn["shots"].slice().reverse()[0]
      return shot["ballsRemaining"]
    }
    else return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  }

  normalTurn () {
    let turn = {}
    turn["number"] = this.game["turns"].length
    turn["isBreakingTurn"] = turn["number"] == 0
    turn["player"] = turn["isBreakingTurn"] ? this.game["breakingPlayer"] : this.getOtherPlayer()
    turn["shots"] = []

    this.game["turns"].push(turn)
    this.normalShot()
  }

}
