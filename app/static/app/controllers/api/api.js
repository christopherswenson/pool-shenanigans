
const API = {

  url (path) {
    let url_prefix = Meta.get("url_prefix")
    if (path.length && path[0] == "/") path = path.slice(1)
    let url = [url_prefix, path].join("/")
    if (url.length && url[0] != "/") url = "/" + url
    return url
  },

  makeRequest (method, route, data, callback) {
    let xhr = new XMLHttpRequest()
    xhr.open(method, API.url(route), true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        let response = JSON.parse(xhr.responseText)
        Log.info(route, response)
        callback(response)
      }
    }
    xhr.send(data ? JSON.stringify(data) : null)
  },

  get (route, callback) {
    API.makeRequest("GET", route, null, callback)
  },

  post (route, data, callback) {
    API.makeRequest("POST", route, data, callback)
  },

  delete (route, data, callback) {
    API.makeRequest("DELETE", route, data, callback)
  },

  put (route, data, callback) {
    API.makeRequest("PUT", route, data, callback)
  },

  patch (route, data, callback) {
    API.makeRequest("PATCH", route, data, callback)
  }

}
