class EndState {

  preload() { }

  create() {
    const score = this.game.score
    this.game.world.setBounds(0, 0, this.game.width, this.game.height);
    let gameOverText = this.add.bitmapText(this.world.centerX , this.world.centerY - 200, 'dripfont', 'You Made It!', 80)
    gameOverText.anchor.set(0.5)

    const finalScore = score.timeElapsed + (score.humansKilled * 5);

    let scoreMath = this.add.bitmapText(this.world.centerX , this.world.centerY - 60, 'dripfont',
      score.timeElapsed + ' seconds + (' +
      score.humansKilled + ' humans killed * 5 seconds) =', 32)
    scoreMath.anchor.set(0.5)

    let scoreText = this.add.bitmapText(this.world.centerX , this.world.centerY + 50, 'dripfont', finalScore + ' seconds', 60)
    scoreText.anchor.set(0.5)

    let playAgainText = this.add.bitmapText(this.world.centerX , this.world.centerY + 200, 'dripfont', 'Click to Play Again', 32)
    playAgainText.anchor.set(0.5)

    this.input.onTap.addOnce((pointer) => {
      this.state.start('Game')
    })
  }

  update() { }
  render() { }
}

module.exports = EndState
