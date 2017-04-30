const Human = require('./gameobjects/human')

class GameState {

  preload() { }

  create() {
    this.humansKilled = 0
    this.timeElapsed = -1
    this.timer = this.time.create()
    this.timer.loop(Phaser.Timer.SECOND, this.updateScore, this)
    this.buildMap()
    this.splats = this.add.group()
    this.corpses = this.add.group()
    this.humans = this.add.group()
    this.shadows = this.add.group()
    this.shoes = this.add.group()
    this.buildPlayerObject()
    this.addHumans(40, this.world.centerX, this.world.centerY)
    this.world.bringToTop( this.shoes )
    this.refocusCamera()
    this.buildInterface()
    this.screamSound = this.add.audio('scream')
    this.splatSound = this.add.audio('splat')
    this.stepSound = this.add.audio('step', 0.2)
  }

  buildInterface() {
    this.scoreText = this.add.bitmapText(5,5,'dripfont', '', 24)
    this.updateScore()
    this.scoreText.fixedToCamera = true
    if (!this.seenInstructions) {
      this.instructions = this.add.image(this.rightShoe.centerX, this.rightShoe.centerY + 80, 'instructions1')
      this.instructions.anchor.setTo(0.95,0)
    }
  }

  updateScore() {
    this.timeElapsed++
    this.scoreText.text = 'humans killed: ' + this.humansKilled + "\n" +
      'elapsed time: ' + this.timeElapsed
  }

  nextInstructions() {
    if (this.instructions2) return
    this.instructions2 = this.add.image(this.leftShoe.centerX, this.leftShoe.centerY + 80, 'instructions2')
    this.instructions2.anchor.setTo(0.05,0)
  }

  killInstructions() {
    if (this.instructions && this.instructions.alive) {
      this.instructions.kill()
      this.seenInstructions = true
    }
    if (this.instructions2 && this.instructions2.alive) {
      this.instructions2.kill()
    }
  }

  addHumans(count, x, y) {
    this.humans.enableBody = true
    for (let i=0; i<count;i++) {
      const xPos = this.game.rnd.between(this.shoes.centerX - (this.camera.width/2), this.shoes.centerX + (this.camera.width/2))
      const yPos = this.game.rnd.between(this.shoes.centerY - (this.camera.height/2), this.shoes.centerY + (this.camera.height/2))
      let human = new Human(this.game, xPos, yPos, this.shoes)
      this.humans.add( human )
    }
  }

  buildMap() {
    this.map = this.add.tilemap('road')
    this.map.addTilesetImage('RoadTiles', 'roadtiles')
    this.layer = this.map.createLayer('Road')
    this.layer.resizeWorld()
  }

  buildPlayerObject() {
    this.leftShoe = this.buildShoe(this.world.centerX - 100, this.world.centerY, 'leftshoe', 'leftshadow')
    this.rightShoe = this.buildShoe(this.world.centerX + 100, this.world.centerY, 'rightshoe', 'rightshadow')
    this.shoes.enableBody = true
    this.shoes.add( this.leftShoe )
    this.shoes.add( this.rightShoe )
  }

  buildShoe(x, y, name, shadowName) {
    let shoe = this.add.sprite( x, y, name )
    shoe.anchor.setTo(0.5, 0.5)
    shoe.scale.setTo(0.5,0.5)
    shoe.inputEnabled = true;
    shoe.input.enableDrag(true)
    shoe.events.onDragStart.add(this.onStartMove, this)
    shoe.events.onDragStop.add(this.onEndMove, this)
    shoe.events.onDragUpdate.add(this.onMove, this)
    let shadow = this.add.sprite( x, y, shadowName )
    shadow.anchor.setTo(0.5, 0.5)
    shadow.scale.setTo(0.5,0.5)
    shadow.alpha = 0.5
    shoe.shadow = shadow
    return shoe
  }

  refocusCamera() {
    // Update the camera position to focus on the shoe sprites
    let xPos = this.shoes.centerX - (this.camera.width/2)
    let yPos = this.shoes.centerY - (this.camera.height/2)
    this.camera.setPosition( xPos, yPos )
  }

  teleportOffscreenHumans() {
    const newCameraX = this.shoes.centerX - (this.camera.width/2)
    const newCameraY = this.shoes.centerY - (this.camera.height/2)
    const xDelta = Math.abs( newCameraX - this.camera.position.x )
    const yDelta = Math.abs( newCameraY - this.camera.position.y )
    this.humans.children.forEach(function(human) {
      if (!human.inCamera) {
        let possiblePlaces = []
        if ( xDelta > 15 ) possiblePlaces.push('x')
        if ( yDelta > 15 ) possiblePlaces.push('y')
        const place = this.rnd.pick( possiblePlaces )
        switch( place ) {
          case 'x':
            human.x = this.rnd.between( this.camera.position.x, newCameraX ) +
              (this.camera.position.x > newCameraX ? 0 : this.camera.width)
            human.y = this.rnd.between( this.camera.position.y, this.camera.position.y + this.camera.height )
          break
          case 'y':
            human.x = this.rnd.between( this.camera.position.x, this.camera.position.x + this.camera.width )
            human.y = this.rnd.between( this.camera.position.y, newCameraY ) +
              (this.camera.position.y > newCameraY ? 0 : this.camera.height)
          break
        }
      }
    }.bind(this))
  }

  onStartMove(shoe, pointer, x, y) {
    if (!this.timer.running) {
      this.timer.start()
    }
    this.killInstructions()
    shoe.bringToTop()
    shoe.isDragging = true
    this.startTweens = []
    this.startTweens.push( this.add.tween(shoe.scale).to({ x: 0.75, y: 0.75 }, 100, "Linear", true) )
    this.startTweens.push( this.add.tween(shoe.shadow.anchor).to({ x: 0.35, y: 0.45 }, 100, "Linear", true) )
    this.startTweens.push( this.add.tween(shoe.shadow.scale).to({ x: 0.8, y: 0.8 }, 100, "Linear", true) )
  }

  onMove(shoe, pointer, x, y, ) {
    shoe.shadow.x = x
    shoe.shadow.y = y
  }

  onEndMove(shoe, pointer) {
    // Stop any initial tweens
    this.startTweens.forEach(function(tween) {
      if (tween.isRunning) tween.stop()
    })
    const otherShoe = shoe.key == 'leftshoe' ? this.rightShoe : this.leftShoe
    this.physics.arcade.overlap(shoe, otherShoe, this.noStepOnFeet, null, this)
    this.add.tween(shoe.shadow.scale).to({ x: 0.5, y: 0.5 }, 50, "Linear", true)
    this.add.tween(shoe.shadow.anchor).to({ x: 0.5, y: 0.5 }, 50, "Linear", true)
    this.add.tween(shoe.scale).to({ x: 0.5, y: 0.5 }, 50, "Linear", true).onComplete.add(function() {
      this.nextUpdate = function() {
        this.teleportOffscreenHumans()
        this.stepSound.play()
        this.camera.shake(0.005, 250);
        this.refocusCamera()
        shoe.isDragging = false
        this.physics.arcade.overlap(shoe, this.humans, this.humanWasSquashed, this.checkOverlap, this)
        // this.nextInstructions()
        this.checkEndGame()
      }
    }, this)
  }

  // Don't allow players to step on own feet
  noStepOnFeet(shoe, otherShoe) {
    const xDis = Math.abs( shoe.centerX - otherShoe.centerX )
    const yDis = Math.abs( shoe.centerY - otherShoe.centerY )
    let adjustPos = {}
    if ( xDis < 100 ) {
      adjustPos.x = shoe.centerX + (100 - (shoe.key == 'leftshoe' ? -xDis : xDis))
    }
    if ( xDis < 100 ) {
      adjustPos.y = shoe.centerY + (100 - (shoe.key == 'leftshoe' ? -yDis : yDis))
    }
    this.add.tween(shoe).to(adjustPos, 50, "Linear", true)
    this.add.tween(shoe.shadow).to(adjustPos, 50, "Linear", true)
  }

  // Let's see if the game is over!
  checkEndGame() {
    const topBound = this.shoes.centerY - (this.shoes.height/2)
    const bottomBound = this.shoes.centerY + (this.shoes.height/2)
    const leftBound = this.shoes.centerX - (this.shoes.width/2)
    const rightBound = this.shoes.centerX + (this.shoes.width/2)
    if ( topBound < 0 ||
        leftBound < 0 ||
        bottomBound > this.world.height ||
        rightBound > this.world.width ) {
      this.game.score = {
        humansKilled: this.humansKilled,
        timeElapsed: this.timeElapsed
      }
      this.state.start('End')
    }

  }

  checkOverlap(shoe, human) {
    // Oh yeah! Hacky bounds relaxation / checking.
    const relX = human.centerX - (shoe.centerX - (shoe.width/2))
    const relY = human.centerY - (shoe.centerY - (shoe.height/2))
    if (relX < 0 || relY < 0) return false
    if (shoe.key == 'leftshoe') {
      if (relY > 140 && relX < 22) return false
      if (relY > 220 && relX > 90) return false
      if (relY < 50 && (relX < 10 || relX > 90)) return false
    }
    if (shoe.key == 'rightshoe') {
      if (relY > 140 && relX > 80) return false
      if (relY > 220 && relX < 15) return false
      if (relY < 50 && (relX < 10 || relX > 90)) return false
    }
    return true
  }

  humanBumpedShoes(shoe, human) {
    human.reactToBump(shoe)
  }

  humanWasSquashed(shoe, human) {
    human.freeze()
    this.screamSound.play()
    this.splatSound.play()
    this.addSplat( human.x, human.y )
    this.humans.remove( human )
    this.corpses.add( human )
    this.humansKilled++
    this.updateScore()
  }

  addSplat(x, y) {
    const splatRotation = this.game.math.degToRad( this.rnd.between(0,360) )
    const splatScale = this.rnd.between(3, 5) / 10
    const splatType = this.rnd.between(1,5)
    const splat = this.add.image( x, y, 'splat' + splatType )
    splat.anchor.setTo(0.5,0.5)
    splat.scale.setTo( splatScale )
    splat.rotation = splatRotation
    this.splats.add( splat )
  }

  update() {
    if (this.nextUpdate) {
      this.nextUpdate.call(this)
      this.nextUpdate = null
    }
    if (!this.leftShoe.isDragging)
      this.physics.arcade.collide(this.leftShoe, this.humans, this.humanBumpedShoes, null, this);
    if (!this.rightShoe.isDragging)
      this.physics.arcade.collide(this.rightShoe, this.humans, this.humanBumpedShoes, null, this);
  }

  render() {}
}

module.exports = GameState
