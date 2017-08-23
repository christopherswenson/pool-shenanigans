const PlayerStore = {
  get (callback) {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", "/api/players", true)
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          callback(JSON.parse(xhr.responseText).players)
      }
    }
    xhr.send()
  }
}
