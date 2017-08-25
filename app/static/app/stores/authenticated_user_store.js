const AuthenticatedUserStore = {
  login (credentials, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("POST", Store.url("/api/user/login"), true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send(JSON.stringify(credentials))
  },

  logout (onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("POST", Store.url("/api/user/logout"), true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send()
  },

  register (credentials, player, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("POST", Store.url("/api/user/register"), true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send(JSON.stringify({
      "credentials": credentials,
      "player": player
    }))
  },

  get (onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", Store.url("/api/user"), true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText)["user"])
      }
    }
    xhr.send()
  }
}
