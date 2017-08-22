
class CreateGamePaneComponent {

  display ($element) {
    this.$element = $element

    this.players = []
    this.breakingPlayer = null
    this.gamePlayers = []
    this.ballsPocketed = []
    this.isTableOpen = true
    this.ballsRemaining = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

    this.setupGame()
  }

  onComplete (completeCallback) {
    this.completeCallback = completeCallback
  }

  setupGame () {
    let setupComponent = new SetupComponent({})
    setupComponent.display(this.$element)
    setupComponent.onComplete( (results) => {
      let breakingPlayer = results["breakingPlayer"]
      let otherPlayer = results["otherPlayer"]
      this.beginGameplay(breakingPlayer, otherPlayer, (game) => {
        this.gameSummary(game)
      })
    })
  }

  gameSummary (game) {
    let gameSummaryComponent = new GameSummaryPaneComponent({
      "game": game
    })
    gameSummaryComponent.display(this.$element)
    gameSummaryComponent.onComplete( () => {
      this.completeCallback()
    })
  }

  endGame (game, winningPlayer, losingPlayer, gameCompleteCallback) {
    winningPlayer["isWinner"] = true
    losingPlayer["isWinner"] = false
    game["endedAt"] = new Date(Date.now())
    gameCompleteCallback(game)
  }

  continueGameplay (game, shootingPlayer, otherPlayer, ballsRemaining, gameCompleteCallback) {
    this.normalTurn(shootingPlayer, otherPlayer, ballsRemaining, (turn, ballsRemaining) => {
      game["turns"].push(turn)

      if (turn["isFinal"]) {
        if (turn["shots"][turn["shots"].length - 1]["isSuccess"]) {
          this.endGame(game, shootingPlayer, otherPlayer, gameCompleteCallback)
        } else this.endGame(game, otherPlayer, shootingPlayer, gameCompleteCallback)
      } else {
        this.continueGameplay(game, otherPlayer, shootingPlayer, ballsRemaining, gameCompleteCallback)
      }
    })
  }

  beginGameplay (breakingPlayer, otherPlayer, gameCompleteCallback) {
    let game = {
      "gamePlayers": [breakingPlayer, otherPlayer],
      "turns": [],
      "startedAt": new Date(Date.now())
    }
    this.breakingTurn(breakingPlayer, otherPlayer, (turn, ballsRemaining) => {
      game["turns"].push(turn)

      if (turn["isFinal"]) {
        this.endGame(game, otherPlayer, breakingPlayer, gameCompleteCallback)
      } else {
        this.continueGameplay(game, otherPlayer, breakingPlayer, ballsRemaining, gameCompleteCallback)
      }
    })
  }

  getCall (savedCall, shootingPlayer, otherPlayer, ballsRemaining, completeCallback, backtrackCallback) {
    let title = `${shootingPlayer.firstName}'s Shot`
    let ballCalledPaneComponent = new BallCalledPaneComponent({
      "ballOptions": this.calledBallOptions(shootingPlayer, ballsRemaining),
      "title": title,
      "calledBall": savedCall["calledBall"],
      "calledPocket": savedCall["calledPocket"],
      "isJumpShot": savedCall["isJumpShot"],
      "isBankShot": savedCall["isBankShot"],
      "comboCount": savedCall["comboCount"]
    })
    ballCalledPaneComponent.display(this.$element)
    ballCalledPaneComponent.onComplete(completeCallback)
    ballCalledPaneComponent.onBacktrack(backtrackCallback)
  }

  calledBallOptions(shootingPlayer, ballsRemaining) {
    let atLeastOneStripe = ballsRemaining.find((number) => this.patternOfBall(number) == "Stripe")
    let atLeastOneSolid = ballsRemaining.find((number) => this.patternOfBall(number) == "Solid")
    if (shootingPlayer["pattern"] != null) {
      let ballsOfPattern = ballsRemaining.filter((number) => {
        return this.patternOfBall(number) == shootingPlayer["pattern"]
      })
      return ballsOfPattern.length ? ballsOfPattern : [8]
    } else if (!atLeastOneSolid || !atLeastOneStripe) {
      return ballsRemaining
    } else {
      return ballsRemaining.filter((number) => number != 8)
    }
  }

  getOutcome (savedOutcome, shootingPlayer, otherPlayer, ballsRemaining, completeCallback, backtrackCallback) {
    let title = `${shootingPlayer.firstName}'s Shot`
    let pocketedComponent = new PocketedComponent({
      title: title,
      ballOptions: ballsRemaining.concat(0),
      ballsPocketed: savedOutcome["ballsPocketed"],
      isTableScratch: savedOutcome["isTableScratch"]
    })
    pocketedComponent.display(this.$element)
    pocketedComponent.onComplete(completeCallback)
    pocketedComponent.onBacktrack(backtrackCallback)
  }

  ballPocketedIsCalled(call, ballPocketed) {
    return call["calledBall"] == ballPocketed["number"] &&
      call["calledPocket"] == ballPocketed["pocket"]
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

  normalShot (savedShot, shootingPlayer, otherPlayer, ballsRemaining, completeCallback, backtrackCallback) {
    let shot = {
      "isSuccess":     savedShot["isSuccess"]     || false,
      "isFinal":       savedShot["isFinal"]       || false,
      "isScratch":     savedShot["isScratch"]     || false,
      "isBreak":       savedShot["isBreak"]       || false,
      "ballsPocketed": savedShot["ballsPocketed"] || [],
      "isTableOpen":   savedShot["isTableOpen"]   || (shootingPlayer["pattern"] == null)
    }

    let getCall = (savedCall, shootingPlayer, otherPlayer, ballsRemaining, callback) => {
      this.getCall(savedCall, shootingPlayer, otherPlayer, ballsRemaining, (call) => {
        shot["calledBall"]    = call["calledBall"]
        shot["calledPocket"]  = call["calledPocket"]
        shot["isJumpShot"]    = call["isJumpShot"]
        shot["isBankShot"]    = call["isBankShot"]
        shot["comboCount"]    = call["comboCount"]

        callback(call)
      }, (savedCall) => {
        backtrackCallback(shot)
      })
    }

    let getOutcome = (savedCall, savedOutcome, shootingPlayer, otherPlayer, ballsRemaining) => {
      this.getOutcome(savedOutcome, shootingPlayer, otherPlayer, ballsRemaining, (outcome) => {
        outcome["ballsPocketed"].forEach((ballPocketed) => {
          let isCalled = this.ballPocketedIsCalled(call, ballPocketed)
          ballPocketed["isCalled"] = isCalled
          ballPocketed["isSlop"] = false
          if (isCalled) {
            shot["isSuccess"] = true
            shootingPlayer["pattern"] = this.patternOfBall(ballPocketed["number"])
            otherPlayer["pattern"] = this.otherPattern(shootingPlayer["pattern"])
            if (ballPocketed["number"] != 0 && ballPocketed["number"] != 8) {
              ballPocketed["isSlop"] = true
            }
          }
          if (ballPocketed["number"] == 0) shot["isScratch"] = true
          if (ballPocketed["number"] == 8) shot["isFinal"] = true
          ballsRemaining = ballsRemaining.filter((number) => number != ballPocketed["number"])
          shot["ballsPocketed"].push(ballPocketed)
        })

        if (outcome["isTableScratch"]) shot["isScratch"] = true
        if (shot["isScratch"]) shot["isSuccess"] = false
        shot["ballsRemaining"] = ballsRemaining.slice()

        completeCallback(shot)
      }, (savedOutcome) => {
        getCall(savedCall, shootingPlayer, otherPlayer, ballsRemaining, (changedCall) => {
          getOutcome(changedCall, savedOutcome, shootingPlayer, otherPlayer, ballsRemaining)
        })
      })
    }

    getCall({}, shootingPlayer, otherPlayer, ballsRemaining, (savedCall) => {
      getOutcome(savedCall, {}, shootingPlayer, otherPlayer, ballsRemaining)
    })

  }

  breakingShot (breakingPlayer, otherPlayer, completeCallback) {
    let ballsRemaining = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    let shot = {
      "isSuccess": false,
      "isFinal": false,
      "isScratch": false,
      "isBreak": true,
      "ballsPocketed": [],
      "comboCount": 1,
      "isJumpShot": false,
      "isBankShot": false,
      "isTableOpen": true,
      "calledPocket": null,
      "calledBall": null,
      "isSlop": false
    }
    this.getOutcome({}, breakingPlayer, otherPlayer, ballsRemaining, (outcome) => {
      outcome["ballsPocketed"].forEach((ballPocketed) => {
        ballPocketed["isCalled"] = false
        ballPocketed["isSlop"] = (ballPocketed["number"] != 0 && ballPocketed["number"] != 8)
        if (ballPocketed["number"] == 0) shot["isScratch"] = true
        if (ballPocketed["number"] == 8) shot["isFinal"] = true
        ballsRemaining = ballsRemaining.filter((number) => number != ballPocketed["number"])
        shot["ballsPocketed"].push(ballPocketed)
      })

      if (outcome["isTableScratch"]) shot["isScratch"] = true
      if (shot["isScratch"]) shot["isSuccess"] = false
      shot["ballsRemaining"] = ballsRemaining.slice()

      completeCallback(shot)
    })
  }

  breakingTurn (breakingPlayer, otherPlayer, completeCallback) {
    let turn = {
      "playerId": breakingPlayer.id,
      "shots": [],
      "isFinal": false
    }
    this.breakingShot(breakingPlayer, otherPlayer, (shot) => {
      turn["shots"].push(shot)
      let ballsRemaining = shot["ballsRemaining"]
      if (shot["isFinal"]) {
        turn["isFinal"] = true
        completeCallback(turn, ballsRemaining)
      } else if (shot["isScratch"] || shot["ballsPocketed"].length == 0) {
        completeCallback(turn, ballsRemaining)
      } else {
        this.continueTurn(turn, breakingPlayer, otherPlayer, ballsRemaining, completeCallback)
      }
    })
  }

  continueTurn (turn, shootingPlayer, otherPlayer, ballsRemaining, completeCallback) {
    this.normalShot({}, shootingPlayer, otherPlayer, ballsRemaining, (shot) => {
      turn["shots"].push(shot)
      let ballsRemaining = shot["ballsRemaining"]
      if (shot["isFinal"]) {
        turn["isFinal"] = true
        completeCallback(turn, ballsRemaining)
      } else if (shot["isSuccess"]) {
        this.continueTurn(turn, shootingPlayer, otherPlayer, ballsRemaining, completeCallback)
      } else completeCallback(turn, ballsRemaining)
    })
  }

  normalTurn (shootingPlayer, otherPlayer, ballsRemaining, completeCallback) {
    let turn = {
      "playerId": shootingPlayer.id,
      "shots": [],
      "isFinal": false
    }
    this.continueTurn(turn, shootingPlayer, otherPlayer, ballsRemaining, completeCallback)
  }

}
