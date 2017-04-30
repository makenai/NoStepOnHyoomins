
class PreloadState {

  preload() {
    this.preloadBar = this.game.add.sprite(
      this.world.centerX,
      this.world.centerY,
      'preload')
    this.preloadBar.anchor.set(.5)
    this.load.setPreloadSprite(this.preloadBar)

    this.load.image('leftshoe', 'img/left-shoe-low.png')
    this.load.image('rightshoe', 'img/right-shoe-low.png')
    this.load.image('leftshadow', 'img/left-shadow.png')
    this.load.image('rightshadow', 'img/right-shadow.png')


    this.load.tilemap('road', 'tilemaps/road.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('roadtiles', 'tilemaps/RoadTiles-lo.png');

    this.load.atlasJSONHash('human1', 'spritemaps/brungirl.png', 'spritemaps/human.json')
    this.load.atlasJSONHash('human2', 'spritemaps/brunguy.png', 'spritemaps/human.json')
    this.load.atlasJSONHash('human3', 'spritemaps/blondeguy.png', 'spritemaps/human.json')
    this.load.atlasJSONHash('human4', 'spritemaps/baldguy.png', 'spritemaps/human.json')
    this.load.atlasJSONHash('human5', 'spritemaps/beardguy.png', 'spritemaps/human.json')
    this.load.atlasJSONHash('human6', 'spritemaps/elf.png', 'spritemaps/human.json')
    this.load.atlasJSONHash('human7', 'spritemaps/superguy.png', 'spritemaps/human.json')

    this.load.image('splat1', 'img/splats/bloodsplats_0003.png')
    this.load.image('splat2', 'img/splats/bloodsplats_0004.png')
    this.load.image('splat3', 'img/splats/bloodsplats_0005.png')
    this.load.image('splat4', 'img/splats/bloodsplats_0006.png')
    this.load.image('splat5', 'img/splats/bloodsplats_0007.png')

    this.load.bitmapFont('pixelfont', 'fonts/pixels.png', 'fonts/pixels.fnt')
    this.load.bitmapFont('dripfont', 'fonts/drip-bright.png', 'fonts/drip.fnt')
    this.load.image('instructions1', 'img/instructions-1.png')
    this.load.image('instructions2', 'img/instructions-2.png')

    this.load.audio('step', 'sounds/step.mp3')
    this.load.audio('splat', 'sounds/splat.mp3')
    this.load.audio('scream', 'sounds/scream.mp3')
    this.load.audio('music', 'music.mp3')
  }

  create() {
    this.state.start('MainMenu')
  }

  update() { }
  render() { }
}

module.exports = PreloadState
