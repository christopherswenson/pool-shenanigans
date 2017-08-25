const AuthenticatedUserStore = {
  login (credentials, onComplete) {
    let url_prefix = Meta.get("url_prefix")
    let xhr = new XMLHttpRequest()
    xhr.open("POST", `${url_prefix}/api/user/login`, true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send(JSON.stringify(credentials))
  },

  logout (onComplete) {
    let url_prefix = Meta.get("url_prefix")
    let xhr = new XMLHttpRequest()
    xhr.open("POST", `${url_prefix}/api/user/logout`, true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send()
  },

  get (onComplete) {
    let url_prefix = Meta.get("url_prefix")
    let xhr = new XMLHttpRequest()
    xhr.open("GET", `${url_prefix}/api/user`, true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText)["user"])
      }
    }
    xhr.send()
  }
}
