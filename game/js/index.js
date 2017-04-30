// PHASER IS IMPORTED AS AN EXTERNAL BUNDLE IN INDEX.HTML

Phaser.Device.whenReady(() => {
  const bootState     = require('./BootState')
  const preloadState  = require('./PreloadState')
  const menuState     = require('./MenuState')
  const gameState     = require('./GameState')
  const endState      = require('./EndState')

  const game = new Phaser.Game(800, 600, Phaser.AUTO, 'game')

  game.state.add('Boot',      bootState)
  game.state.add('Preload',   preloadState)
  game.state.add('MainMenu',  menuState)
  game.state.add('Game',      gameState)
  game.state.add('End',       endState)

  game.state.start('Boot')
})
