function findTemplate (id) {
  let link = document.getElementById(id)
  if (link == null) {
    throw `Error: Could not find template with id '${id}'.`
  }
  return $(link.import).find('body').children()
}

function loadTemplate ($element, id) {
  let $template = findTemplate(id).clone()
  if ($element == null) return $template
  $element.html($template)
  return $element
}
