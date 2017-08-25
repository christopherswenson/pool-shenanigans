const Store = {
  url (path) {
    let url_prefix = Meta.get("url_prefix")
    let url = [url_prefix, path].join("/")
    if (url.length && url[0] == "/") url = url.slice(1)
    return url
  }
}
