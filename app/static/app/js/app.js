
window.addEventListener('WebComponentsReady', () => {
  gamesPageComponent = new GamesPageComponent
  gamesPageComponent.display($("#app-content"))
})
