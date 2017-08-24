const EmbedStore = {
  url (onComplete) {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", "/api/embed/url", true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onComplete(JSON.parse(xhr.responseText))
      }
    }
    xhr.send()
  }
}
