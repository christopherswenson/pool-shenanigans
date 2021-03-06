
class CreateGameModal {

  constructor ($element, params) {
    this.$element = Template.load($element, "create_game_modal.html")

    this.$modal = this.$element.find("#new-game-modal")
    this.$modalContent = this.$element.find(".modal-content")

    this.game = {}

    API.get("/api/user/players", (response) => {
      this.players = response["players"]
      this.gameSetup()
    })

    this.$modal.modal()
  }

  // Property getters and setters

  get turnTitle () {
    let kind = this.currentShot["isBreak"] ? "Break" : "Shot"
    return `${this.currentPlayer["firstName"]} ${this.currentPlayer["lastName"]}'s ${kind}`
  }

  get calledBallOptions () {
    let ballsRemaining = this.ballsRemaining
    let atLeastOneStripe = ballsRemaining.find((number) => this.patternOfBall(number) == "Stripe")
    let atLeastOneSolid = ballsRemaining.find((number) => this.patternOfBall(number) == "Solid")

    let pattern = this.currentPlayer["pattern"]
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

  get currentTurn () {
    let turns = this.game["turns"]
    if (turns) return turns[turns.length - 1]
    else return null
  }

  get currentShot () {
    let shots = this.currentTurn["shots"]

    if (shots) return shots[shots.length - 1]
    else return null
  }

  get previousShot () {
    let shots = this.game["turns"].map((turn) => {
      return turn["shots"]
    }).flatten()
    if (shots.length > 1) return shots[shots.length - 2]
    else return null
  }

  get currentPlayer () {
    return this.currentTurn["player"]
  }

  get isBreakingTurn () {
    return this.currentTurn["isBreakingTurn"]
  }

  get otherPlayer () {
    return ((this.game["gamePlayers"][0] == this.currentPlayer)
      ? this.game["gamePlayers"][1]
      : this.game["gamePlayers"][0])
  }

  get ballsRemaining () {
    let shot = this.game["turns"].map((turn) => {
      return turn["shots"]
    }).flatten().reverse().find((shot) => {
      return shot["ballsPocketed"]
    })
    if (shot) return shot["ballsRemaining"]
    else return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  }

  // Game progression methods

  backtrack (paneName) {
    let shot = this.currentShot
    switch (paneName) {
      case "game-summary":
        let ballsPocketed = shot["ballsPocketed"]
        shot["ballsPocketed"] = null
        this.shotResult({
          "ballsPocketed": ballsPocketed
        })
        break
      case "ball-pocketed":
        if (shot["isBreak"]) {
          this.gameSetup()
        } else {
          this.shotCall()
        }
        break
      case "ball-called":
        let turn = this.currentTurn
        if (turn["shots"].length == 1) {
          this.game["turns"].pop()
        } else {
          turn["shots"].pop()
        }
        let lastShot = this.currentShot
        let lastBallsPocketed = lastShot["ballsPocketed"]
        if (lastShot["closesTable"]) {
          this.currentPlayer["pattern"] = this.otherPlayer["pattern"] = null
        }
        lastShot["ballsPocketed"] = null
        this.shotResult({
          "ballsPocketed": lastBallsPocketed,
          "isTableScratch": lastShot["isTableScratch"]
        })
        break
    }
    return this
  }

  gameSetup () {
    let setupComponent = new SetupPane(this.$modalContent, {
      "playerTwo": this.game["playerTwo"] || null,
      "breakingPlayer": this.game["breakingPlayer"] || null,
      "players": this.players,
      "isPlayerTwoNewGuest": this.game["isPlayerTwoNewGuest"]
    }).complete((results) => {
      this.game["breakingPlayer"] = results["breakingPlayer"]
      this.game["otherPlayer"] = results["otherPlayer"]
      this.game["playerTwo"] = results["playerTwo"]
      this.game["gamePlayers"] = [results["playerOne"], results["playerTwo"]]
      this.game["turns"] = []
      this.game["isPlayerTwoNewGuest"] = results["isPlayerTwoNewGuest"]
      this.game["startedAt"] = new Date(Date.now())
      this.turnStart()
    })
  }

  gameSummary () {
    let gameSummaryComponent = new GameSummaryPane(this.$modalContent, {
      "game": this.game
    }).complete( (game) => {
      this.completeCallback(game)
    }).backtrack(() => {
      this.backtrack("game-summary")
    })
  }

  gameEnd () {
    let turn = this.currentTurn
    let isCurrentPlayerWinner = turn["shots"][turn["shots"].length - 1]["isSuccess"]
    this.currentPlayer["isWinner"] = !!isCurrentPlayerWinner
    this.otherPlayer["isWinner"] = !isCurrentPlayerWinner

    this.game["endedAt"] = new Date(Date.now())
    this.gameSummary()
  }

  shotCall () {
    let shot = this.currentShot
    if (!shot["isBreak"]) {
      let calledBallOptions = this.calledBallOptions
      new BallCalledPane(this.$modalContent, {
        "ballOptions": calledBallOptions,
        "title": this.turnTitle,

        "calledBall": shot["calledBall"] || (calledBallOptions.length == 1 ? calledBallOptions[0] : null),
        "calledPocket": shot["calledPocket"] || null,
        "isJumpShot": shot["isJumpShot"] || false,
        "isBankShot": shot["isBankShot"] || false,
        "comboCount": shot["comboCount"] || 1
      }).complete((call) => {
        shot["calledBall"]    = call["calledBall"]
        shot["calledPocket"]  = call["calledPocket"]
        shot["isJumpShot"]    = call["isJumpShot"]
        shot["isBankShot"]    = call["isBankShot"]
        shot["comboCount"]    = call["comboCount"]

        this.shotResult({
          "ballsPocketed": call["ballsPocketed"] || []
        })
      }).backtrack(() => {
        this.backtrack("ball-called")
      })
    } else {
      shot["calledBall"]   = null
      shot["calledPocket"] = null
      shot["isJumpShot"]   = false
      shot["isBankShot"]   = false
      shot["comboCount"]   = 1

      this.shotResult({})
    }
  }

  shotResult (params) {
    if (params == null) params = {}
    new BallPocketedPane(this.$modalContent, {
      "title": this.turnTitle,
      "ballOptions": this.ballsRemaining.concat(0),
      "ballsPocketed": params["ballsPocketed"] || [],
      "isTableScratch": params["isTableScratch"]
    }).complete((outcome) => {
      let turn = this.currentTurn
      let shot = this.currentShot
      let previousShot = this.previousShot
      shot["isSuccess"] = false
      shot["isFinal"] = false
      shot["closesTable"] = false
      shot["isScratch"] = shot["isTableScratch"] = outcome["isTableScratch"]
      shot["ballsPocketed"] = outcome["ballsPocketed"]
      shot["ballsRemaining"] = shot["ballsRemainingBefore"].slice()
      shot["isFollowingScratch"] = !!((previousShot != null) && previousShot["isScratch"])
      shot["ballsPocketed"].forEach((ballPocketed) => {
        let isCalled = this.ballPocketedIsCalled(shot, ballPocketed)
        ballPocketed["isCalled"] = isCalled
        ballPocketed["isSlop"] = false
        if (isCalled) {
          shot["isSuccess"] = true
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
      if (shot["isSuccess"]) {
        let ballPattern = this.patternOfBall(shot["calledBall"])
        if (this.currentPlayer["pattern"] == null && ballPattern != null) {
          shot["closesTable"] = true
          this.currentPlayer["pattern"] = ballPattern
          this.otherPlayer["pattern"] = this.otherPattern(ballPattern)
        }
      }

      if (shot["isFinal"]) {
        turn["isFinal"] = true
        this.gameEnd()
      } else if (shot["isSuccess"]) {
        this.shotStart()
      } else this.turnStart()
    }).backtrack(() => {
      this.backtrack("ball-pocketed")
    })
  }

  shotStart () {
    let turn = this.currentTurn

    let shot = {}
    shot["number"] = turn["shots"].length
    shot["isBreak"] = turn["isBreakingTurn"] && shot["number"] == 0
    shot["isTableOpen"] = this.currentPlayer["pattern"] == null
    shot["ballsRemainingBefore"] = this.ballsRemaining

    turn["shots"].push(shot)

    this.shotCall()
  }

  turnStart () {
    let turn = {}
    turn["number"] = this.game["turns"].length
    turn["isBreakingTurn"] = turn["number"] == 0
    turn["player"] = turn["isBreakingTurn"] ? this.game["breakingPlayer"] : this.otherPlayer
    turn["shots"] = []

    this.game["turns"].push(turn)
    this.shotStart()
  }

  // Event handlers

  complete (completeCallback) {
    this.completeCallback = ((game) => {
      this.$modal.modal('hide')
      completeCallback(game)
    })
    return this
  }

  // Helper methods

  ballPocketedIsCalled(shot, ballPocketed) {
    return shot["calledBall"] == ballPocketed["number"] &&
      shot["calledPocket"] == ballPocketed["pocket"]
  }

  patternOfBall (number) {
    if (number >= 1 && number <= 7) {
      return "Solid"
    } else if (number >= 9 && number <= 15) {
      return "Stripe"
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
}
