const GameStore = {
  post (game, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("POST", "/api/games", true)
    xhr.setRequestHeader("Content-type", "application/json")
    let cookies = CookieStore.get()
    xhr.setRequestHeader("X-CSRFToken", cookies["csrftoken"])
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send(JSON.stringify({"game": game}))
  }
}
