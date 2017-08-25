
window.addEventListener('WebComponentsReady', (e) => {
  console.log("document.ready")
  gamesPageComponent = new GamesPageComponent
  gamesPageComponent.display($("#app-content"))
})
