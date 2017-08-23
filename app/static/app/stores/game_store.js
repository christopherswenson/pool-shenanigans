const GameStore = {
  post (game, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("POST", "/api/games", true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send(JSON.stringify({"game": game}))
  }
}
