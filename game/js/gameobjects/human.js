class Human extends Phaser.Sprite {

  constructor(game, x, y) {
    const humanType = game.rnd.between(1,7)
    super(game, x, y, 'human' + humanType, 0)
    this.game = game
    this.animations.add('forward', [0,1,2])
    this.animations.add('back', [4,5,6])
    this.animations.add('left', [8,9,10])
    this.animations.add('right', [11,12,13])
    this.scale.setTo(0.5)
    this.anchor.setTo(0.5, 0.5)
    this.changeDirection()
    this.stopped = false
  }

  freeze() {
    this.stopped = true
    this.animations.stop(false)
  }

  changeDirection() {
    this.currentSpeed = this.game.rnd.between(0,2)
    this.currentDirection = this.game.rnd.pick(['forward', 'back', 'left', 'right'])
    if (this.currentSpeed > 0) {
      this.animations.play(this.currentDirection, 5 + this.currentSpeed, true)
    } else {
      this.animations.stop(true)
    }
  }

  update() {
    if (this.stopped) {
      return
    }
    if (this.game.rnd.between(0,15) == 5) {
      return this.changeDirection()
    }
    const oldX = this.x
    const oldY = this.y
    switch( this.currentDirection ) {
      case 'forward':
        this.y += this.currentSpeed
      break
      case 'back':
        this.y -= this.currentSpeed
      break
      case 'left':
        this.x -= this.currentSpeed
      break
      case 'right':
        this.x += this.currentSpeed
      break
    }
  }

  reactToBump(obj) {
    if (this.stopped) {
      return
    }
    const bumpBackDistance = 5
    this.x += obj.x > this.x ? -bumpBackDistance : bumpBackDistance
    this.y += obj.y > this.y ? -bumpBackDistance : bumpBackDistance
    this.currentSpeed = 6
    switch( this.currentDirection ) {
      case 'forward':
        this.currentDirection = 'back'
      break
      case 'back':
        this.currentDirection = 'forward'
      break
      case 'left':
        this.currentDirection = 'right'
      break
      case 'right':
        this.currentDirection = 'left'
      break
    }
  }

}

module.exports = Human