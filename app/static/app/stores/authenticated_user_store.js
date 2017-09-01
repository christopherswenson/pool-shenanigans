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
  },

  guests (onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", Store.url("/api/user/guests"), true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText)["guests"])
      }
    }
    xhr.send()
  },

  removeGuest (id, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("POST", Store.url("/api/user/guests/remove"), true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send(JSON.stringify({
      "id": id
    }))
  },

  friends (onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", Store.url("/api/user/friends"), true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText)["friends"])
      }
    }
    xhr.send()
  },

  unfriend (id, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("POST", Store.url("/api/user/friends/unfriend"), true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send(JSON.stringify({
      "id": id
    }))
  },

  giveFriendship (descriptor, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("POST", Store.url("/api/user/friends/give"), true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send(JSON.stringify(descriptor))
  },

  friendRequests (onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", Store.url("/api/user/friends/requests"), true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText)["friends"])
      }
    }
    xhr.send()
  },

  tables (onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", Store.url("/api/user/tables"), true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText)["tables"])
      }
    }
    xhr.send()
  },

  setUsername (username, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("PUT", Store.url("/api/user/username"), true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send(JSON.stringify({
      "username": username
    }))
  },

  setFirstName (firstName, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("PUT", Store.url("/api/user/first_name"), true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send(JSON.stringify({
      "firstName": firstName
    }))
  },

  setLastName (firstName, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("PUT", Store.url("/api/user/last_name"), true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send(JSON.stringify({
      "lastName": firstName
    }))
  },

  setPassword (oldPassword, newPassword, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("PUT", Store.url("/api/user/password"), true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send(JSON.stringify({
      "oldPassword": oldPassword,
      "newPassword": newPassword
    }))
  }
}
