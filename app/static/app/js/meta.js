
const Meta = {
  get (metaVarName) {
    return $(`meta[name="${metaVarName}"]`).attr("content")
  }
}
