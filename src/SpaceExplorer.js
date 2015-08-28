//var Phaser = require('phaser');

var MainPanel = require('./MainPanel');

var SpaceExplorer = function(){};

window.SpaceExplorer = SpaceExplorer;

SpaceExplorer.prototype = {
	init: function(){
		this.game = new Phaser.Game(480, 256, Phaser.AUTO, '');
		this.game.state.add('Boot', SpaceExplorer.Boot);
		this.game.state.add('Preload', SpaceExplorer.Preload);
		this.game.state.add('Game', SpaceExplorer.Game);
		this.game.state.start('Boot');
	}
};

SpaceExplorer.Boot = function(){};

SpaceExplorer.Boot.prototype = {
	preload: function() {
		//this.load.image('preloadbar', 'assets/images/preloader-bar.png');

	},
	create: function() {
		this.game.stage.backgroundColor = '#000';
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		// this.scale.setScreenSize(true);
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.state.start('Preload');
	} 
};

SpaceExplorer.Preload = function(){};

SpaceExplorer.Preload.prototype = {
	preload: function() {
		//this.load.image('preloadbar', 'img/preloader-bar.png');
		this.load.tilemap('prologueLevel', 'maps/prologue.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('gameTiles', 'img/map.png');
		this.load.spritesheet('player', 'img/player.png', 16, 16);
		this.load.spritesheet('bullets', 'img/bullets.png', 16, 16);
		// this.load.audio('fire', 'img/fire.wav');
	},
	create: function() {
		this.state.start('Game');
	}
};

SpaceExplorer.Game = function(){};

SpaceExplorer.Game.prototype = {
	create: function() {
		var mainPanel = new MainPanel(this.game);
		this.currentPanel = mainPanel;
		mainPanel.init();
		mainPanel.show();
	},
	update: function(){
		this.currentPanel.update();
	}
};

module.exports = SpaceExplorer;