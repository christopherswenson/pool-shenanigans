
const UrlPrefixStore = {
  get (callback) {
    console.log($('meta[name="url_prefix"]').attr("content"))
    callback($('meta[name="url_prefix"]').attr("content"))
  }
}
