const GameStore = {
  post (game, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("POST", Store.url("/api/games"), true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText)["game"])
      }
    }
    xhr.send(JSON.stringify({"game": game}))
  },

  get (onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", Store.url("/api/games"), true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText)["games"])
      }
    }
    xhr.send()
  },

  embed_url (id, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", Store.url(`/api/games/${id}/embed_url`), true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText)["url"])
      }
    }
    xhr.send()
  }
}
