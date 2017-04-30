
class MenuState {

  preload() { }

  create() {

    this.music = this.add.audio('music', 0.25, true)
    this.music.play()

    let titleText = this.add.bitmapText(this.world.centerX , this.world.centerY - 180,
      'dripfont', 'NO STEP ON\nHYOOMINS', 60)
    titleText.anchor.set(0.5)
    titleText.align = 'center'


    let playText = this.add.bitmapText(this.world.centerX , this.world.centerY + 200, 'dripfont', 'Click to Play', 32)
    playText.anchor.set(0.5)

    let storyText = this.add.bitmapText( this.world.centerX, this.world.centerY + 25, 'pixelfont',
      'You were sitting in your living room, playing a video game\n' +
      'and minding your own business until you accidentally ate a\n' +
      'RADIOACTIVE CHEETO. Now you are 500 feet tall and must\n' +
      'get out of the city while causing as little carnage as\n' +
      'possible.\n\n' +
      'Made for LD38 by @makenai',
      32
    )
    storyText.anchor.set(0.5)
    this.input.onTap.addOnce((pointer) => {
      this.state.start('Game')
    })
  }

  update() { }
  render() { }
}

module.exports = MenuState
