const Store = {
  url (path) {
    let url_prefix = Meta.get("url_prefix")
    if (path.length && path[0] == "/") path = path.slice(1)
    let url = [url_prefix, path].join("/")
    if (url.length && url[0] != "/") url = "/" + url
    return url
  }
}
