
const UrlPrefixStore = {
  get (callback) {
    callback($('meta[name="url_prefix"]').attr("content"))
  }
}
