function findTemplate (id) {
  let link = document.getElementById(id)
  if (link == null) {
    throw `Error: Could not find template with id '${id}'.`
  }
  return $(link.import).find('body').children()
}

function applyTemplateParams($template, params) {
  Object.keys(params).forEach((selector) => {
    $template.find(selector).empty().append(params[selector])
  })
}

function loadTemplate ($element, id, params) {
  let $template = findTemplate(id).clone()
  applyTemplateParams($template, params || {})
  if ($element == null) return $template
  $element.html($template)
  return $element
}
