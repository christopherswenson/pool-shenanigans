
const Template = {
  find (id) {
    let link = document.getElementById(id)
    if (link == null) {
      throw `Error: Could not find template with id '${id}'.`
    }
    return $(link.import.querySelector('template').content).children()
  },

  applyParams($template, params) {
    Object.keys(params).forEach((selector) => {
      $template.find(selector).empty().append(params[selector])
    })
  },

  load ($element, id, params) {
    let $template = Template.find(id).clone()
    Template.applyParams($template, params || {})
    if ($element == null) return $template
    $element.html($template)
    return $element
  }
}
