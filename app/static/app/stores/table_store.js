const TableStore = {
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

  join (name, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("POST", Store.url("/api/user/tables/join"), true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send(JSON.stringify({
      "name": name,
    }))
  },

  leave (name, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("POST", Store.url("/api/user/tables/leave"), true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send(JSON.stringify({
      "name": name,
    }))
  },

  create (name, onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("POST", Store.url("/api/user/tables/create"), true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send(JSON.stringify({
      "name": name,
    }))
  },
}
