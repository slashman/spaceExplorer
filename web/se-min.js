(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/administrator/git/spaceExplorer/src/MainPanel.js":[function(require,module,exports){
var MainPanel = function(phaser){
	this.phaser = phaser;
	this.cursors = this.phaser.input.keyboard.createCursorKeys();
	this.TOP_SPEED = 100;
}

MainPanel.prototype = {
	init: function(){
		this._initMap();
		this._initPanel();
		this._initPlayer();
		
	},
	_initPanel: function(){
		this.bulletGroup = this.phaser.add.group();
		this.bulletGroup.enableBody = true;
		this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE
	},
	_initMap: function() {
		this.map = this.phaser.add.tilemap('prologueLevel');
		this.map.addTilesetImage('Denzi100308-1', 'gameTiles');
	    this.background2Layer = this.map.createLayer('background2');
	    this.background1Layer = this.map.createLayer('background1');
	    this.solidLayer = this.map.createLayer('solid');
	    this.foregroundLayer = this.map.createLayer('foreground');
 		this.map.setCollisionBetween(1, 100000, true, 'solid');
 	   	this.background1Layer.resizeWorld();
 	},
 	_initPlayer: function(){
 	   	this.player = this.phaser.add.sprite(20, 20, 'player', 0);
 	   	this.player.anchor.setTo(.5, 1);
 	   	this.player.walkingRight = true;
		this.player.animations.add('walk', [7,8,9,10,11,12,13]);
		var jumpAnimation = this.player.animations.add('jump', [25,26]);
		jumpAnimation.onComplete.add(this._performJump, this);
		this.phaser.physics.arcade.enable(this.player); 
		this.player.body.gravity.y = 1000;
 		this.phaser.camera.follow(this.player);

 		var space = this.phaser.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    	console.log(space);
    	space.onDown.add(this._shoot, this);
	},
	_shoot: function(){
		//var bullet = this.phaser.add.sprite(this.player.x, this.player.y, 'bullets', 16, this.bulletGroup);
		var dirMod = this.player.walkingRight ? 1 : -1
		var bullet = this.bulletGroup.create(this.player.x, this.player.y-16, 'bullets', 16);
		//console.log("s")
		//this.phaser.physics.arcade.enable(bullet);
		bullet.body.velocity.x = 200 * dirMod;
	},
	_performJump: function(){
		if (this.player.body.blocked.down){
			this.player.loadTexture('player', 27);
			this.player.body.velocity.y -= 400;
		}
		this.isStartingToJump = false;
	},
	show: function(){

	},
	update: function(){
		if(this.player.y >= this.phaser.world.height + 32) {
		    this.phaser.state.start('Game');
		}
		this.phaser.physics.arcade.collide(this.player, this.solidLayer);
		this.phaser.physics.arcade.collide(this.bulletGroup, this.solidLayer, function(sprite){sprite.kill();}, null, this);
		if (this.isStartingToJump)
			return;
		if (this.player.body.blocked.down){
			if(this.cursors.left.isDown) {
				if (Math.abs(this.player.body.velocity.x) < this.TOP_SPEED)
					this.player.body.velocity.x -= 5; 
				this.player.walkingRight = false;
			}
			if(this.cursors.right.isDown) {
				if (Math.abs(this.player.body.velocity.x) < this.TOP_SPEED)
					this.player.body.velocity.x += 5;
				this.player.walkingRight = true;
			}
			if(this.cursors.up.isDown) {
				this._jump();
				return;
			}
			if (Math.abs(this.player.body.velocity.x) > 0){
				if (this.player.isWalking){
					this.player.animations.play('walk', 16, true);
				}
				this.player.isWalking = true;
				var animationSpeed = Math.floor(Math.abs(this.player.body.velocity.x) * 16/50);
				if (animationSpeed < 5)
					animationSpeed = 5;
				this.player.animations.currentAnim.speed = animationSpeed;
			} else {
				this.player.animations.stop();
				this.player.isWalking = false;
			}

			if (this.player.walkingRight){
				this.player.scale.x = 1;
			} else {
				this.player.scale.x = -1;
			}
		}

		if(this.player.body.blocked.down || this.player.body.velocity.x != 0) {
			if (this.player.body.velocity.x > 0){
				this.player.body.velocity.x --;
			} else {
				this.player.body.velocity.x ++;
			}
		}
 	},
 	_jump: function(){
		if(this.player.body.blocked.down) {
			this.isStartingToJump = true;
			//this.player.animations.stop();
			this.player.animations.play('jump', 8, false);
		}  
 	}
}

module.exports = MainPanel;
},{}],"/home/administrator/git/spaceExplorer/src/SpaceExplorer.js":[function(require,module,exports){
// var Phaser = require('phaser');

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
},{"./MainPanel":"/home/administrator/git/spaceExplorer/src/MainPanel.js"}]},{},["/home/administrator/git/spaceExplorer/src/SpaceExplorer.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3BhY2VFeHBsb3Jlci9zcmMvTWFpblBhbmVsLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3BhY2VFeHBsb3Jlci9zcmMvU3BhY2VFeHBsb3Jlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIE1haW5QYW5lbCA9IGZ1bmN0aW9uKHBoYXNlcil7XG5cdHRoaXMucGhhc2VyID0gcGhhc2VyO1xuXHR0aGlzLmN1cnNvcnMgPSB0aGlzLnBoYXNlci5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XG5cdHRoaXMuVE9QX1NQRUVEID0gMTAwO1xufVxuXG5NYWluUGFuZWwucHJvdG90eXBlID0ge1xuXHRpbml0OiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuX2luaXRNYXAoKTtcblx0XHR0aGlzLl9pbml0UGFuZWwoKTtcblx0XHR0aGlzLl9pbml0UGxheWVyKCk7XG5cdFx0XG5cdH0sXG5cdF9pbml0UGFuZWw6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5idWxsZXRHcm91cCA9IHRoaXMucGhhc2VyLmFkZC5ncm91cCgpO1xuXHRcdHRoaXMuYnVsbGV0R3JvdXAuZW5hYmxlQm9keSA9IHRydWU7XG5cdFx0dGhpcy5idWxsZXRHcm91cC5waHlzaWNzQm9keVR5cGUgPSBQaGFzZXIuUGh5c2ljcy5BUkNBREVcblx0fSxcblx0X2luaXRNYXA6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMubWFwID0gdGhpcy5waGFzZXIuYWRkLnRpbGVtYXAoJ3Byb2xvZ3VlTGV2ZWwnKTtcblx0XHR0aGlzLm1hcC5hZGRUaWxlc2V0SW1hZ2UoJ0RlbnppMTAwMzA4LTEnLCAnZ2FtZVRpbGVzJyk7XG5cdCAgICB0aGlzLmJhY2tncm91bmQyTGF5ZXIgPSB0aGlzLm1hcC5jcmVhdGVMYXllcignYmFja2dyb3VuZDInKTtcblx0ICAgIHRoaXMuYmFja2dyb3VuZDFMYXllciA9IHRoaXMubWFwLmNyZWF0ZUxheWVyKCdiYWNrZ3JvdW5kMScpO1xuXHQgICAgdGhpcy5zb2xpZExheWVyID0gdGhpcy5tYXAuY3JlYXRlTGF5ZXIoJ3NvbGlkJyk7XG5cdCAgICB0aGlzLmZvcmVncm91bmRMYXllciA9IHRoaXMubWFwLmNyZWF0ZUxheWVyKCdmb3JlZ3JvdW5kJyk7XG4gXHRcdHRoaXMubWFwLnNldENvbGxpc2lvbkJldHdlZW4oMSwgMTAwMDAwLCB0cnVlLCAnc29saWQnKTtcbiBcdCAgIFx0dGhpcy5iYWNrZ3JvdW5kMUxheWVyLnJlc2l6ZVdvcmxkKCk7XG4gXHR9LFxuIFx0X2luaXRQbGF5ZXI6IGZ1bmN0aW9uKCl7XG4gXHQgICBcdHRoaXMucGxheWVyID0gdGhpcy5waGFzZXIuYWRkLnNwcml0ZSgyMCwgMjAsICdwbGF5ZXInLCAwKTtcbiBcdCAgIFx0dGhpcy5wbGF5ZXIuYW5jaG9yLnNldFRvKC41LCAxKTtcbiBcdCAgIFx0dGhpcy5wbGF5ZXIud2Fsa2luZ1JpZ2h0ID0gdHJ1ZTtcblx0XHR0aGlzLnBsYXllci5hbmltYXRpb25zLmFkZCgnd2FsaycsIFs3LDgsOSwxMCwxMSwxMiwxM10pO1xuXHRcdHZhciBqdW1wQW5pbWF0aW9uID0gdGhpcy5wbGF5ZXIuYW5pbWF0aW9ucy5hZGQoJ2p1bXAnLCBbMjUsMjZdKTtcblx0XHRqdW1wQW5pbWF0aW9uLm9uQ29tcGxldGUuYWRkKHRoaXMuX3BlcmZvcm1KdW1wLCB0aGlzKTtcblx0XHR0aGlzLnBoYXNlci5waHlzaWNzLmFyY2FkZS5lbmFibGUodGhpcy5wbGF5ZXIpOyBcblx0XHR0aGlzLnBsYXllci5ib2R5LmdyYXZpdHkueSA9IDEwMDA7XG4gXHRcdHRoaXMucGhhc2VyLmNhbWVyYS5mb2xsb3codGhpcy5wbGF5ZXIpO1xuXG4gXHRcdHZhciBzcGFjZSA9IHRoaXMucGhhc2VyLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuU1BBQ0VCQVIpO1xuICAgIFx0Y29uc29sZS5sb2coc3BhY2UpO1xuICAgIFx0c3BhY2Uub25Eb3duLmFkZCh0aGlzLl9zaG9vdCwgdGhpcyk7XG5cdH0sXG5cdF9zaG9vdDogZnVuY3Rpb24oKXtcblx0XHQvL3ZhciBidWxsZXQgPSB0aGlzLnBoYXNlci5hZGQuc3ByaXRlKHRoaXMucGxheWVyLngsIHRoaXMucGxheWVyLnksICdidWxsZXRzJywgMTYsIHRoaXMuYnVsbGV0R3JvdXApO1xuXHRcdHZhciBkaXJNb2QgPSB0aGlzLnBsYXllci53YWxraW5nUmlnaHQgPyAxIDogLTFcblx0XHR2YXIgYnVsbGV0ID0gdGhpcy5idWxsZXRHcm91cC5jcmVhdGUodGhpcy5wbGF5ZXIueCwgdGhpcy5wbGF5ZXIueS0xNiwgJ2J1bGxldHMnLCAxNik7XG5cdFx0Ly9jb25zb2xlLmxvZyhcInNcIilcblx0XHQvL3RoaXMucGhhc2VyLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShidWxsZXQpO1xuXHRcdGJ1bGxldC5ib2R5LnZlbG9jaXR5LnggPSAyMDAgKiBkaXJNb2Q7XG5cdH0sXG5cdF9wZXJmb3JtSnVtcDogZnVuY3Rpb24oKXtcblx0XHRpZiAodGhpcy5wbGF5ZXIuYm9keS5ibG9ja2VkLmRvd24pe1xuXHRcdFx0dGhpcy5wbGF5ZXIubG9hZFRleHR1cmUoJ3BsYXllcicsIDI3KTtcblx0XHRcdHRoaXMucGxheWVyLmJvZHkudmVsb2NpdHkueSAtPSA0MDA7XG5cdFx0fVxuXHRcdHRoaXMuaXNTdGFydGluZ1RvSnVtcCA9IGZhbHNlO1xuXHR9LFxuXHRzaG93OiBmdW5jdGlvbigpe1xuXG5cdH0sXG5cdHVwZGF0ZTogZnVuY3Rpb24oKXtcblx0XHRpZih0aGlzLnBsYXllci55ID49IHRoaXMucGhhc2VyLndvcmxkLmhlaWdodCArIDMyKSB7XG5cdFx0ICAgIHRoaXMucGhhc2VyLnN0YXRlLnN0YXJ0KCdHYW1lJyk7XG5cdFx0fVxuXHRcdHRoaXMucGhhc2VyLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy5wbGF5ZXIsIHRoaXMuc29saWRMYXllcik7XG5cdFx0dGhpcy5waGFzZXIucGh5c2ljcy5hcmNhZGUuY29sbGlkZSh0aGlzLmJ1bGxldEdyb3VwLCB0aGlzLnNvbGlkTGF5ZXIsIGZ1bmN0aW9uKHNwcml0ZSl7c3ByaXRlLmtpbGwoKTt9LCBudWxsLCB0aGlzKTtcblx0XHRpZiAodGhpcy5pc1N0YXJ0aW5nVG9KdW1wKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGlmICh0aGlzLnBsYXllci5ib2R5LmJsb2NrZWQuZG93bil7XG5cdFx0XHRpZih0aGlzLmN1cnNvcnMubGVmdC5pc0Rvd24pIHtcblx0XHRcdFx0aWYgKE1hdGguYWJzKHRoaXMucGxheWVyLmJvZHkudmVsb2NpdHkueCkgPCB0aGlzLlRPUF9TUEVFRClcblx0XHRcdFx0XHR0aGlzLnBsYXllci5ib2R5LnZlbG9jaXR5LnggLT0gNTsgXG5cdFx0XHRcdHRoaXMucGxheWVyLndhbGtpbmdSaWdodCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0aWYodGhpcy5jdXJzb3JzLnJpZ2h0LmlzRG93bikge1xuXHRcdFx0XHRpZiAoTWF0aC5hYnModGhpcy5wbGF5ZXIuYm9keS52ZWxvY2l0eS54KSA8IHRoaXMuVE9QX1NQRUVEKVxuXHRcdFx0XHRcdHRoaXMucGxheWVyLmJvZHkudmVsb2NpdHkueCArPSA1O1xuXHRcdFx0XHR0aGlzLnBsYXllci53YWxraW5nUmlnaHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYodGhpcy5jdXJzb3JzLnVwLmlzRG93bikge1xuXHRcdFx0XHR0aGlzLl9qdW1wKCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmIChNYXRoLmFicyh0aGlzLnBsYXllci5ib2R5LnZlbG9jaXR5LngpID4gMCl7XG5cdFx0XHRcdGlmICh0aGlzLnBsYXllci5pc1dhbGtpbmcpe1xuXHRcdFx0XHRcdHRoaXMucGxheWVyLmFuaW1hdGlvbnMucGxheSgnd2FsaycsIDE2LCB0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnBsYXllci5pc1dhbGtpbmcgPSB0cnVlO1xuXHRcdFx0XHR2YXIgYW5pbWF0aW9uU3BlZWQgPSBNYXRoLmZsb29yKE1hdGguYWJzKHRoaXMucGxheWVyLmJvZHkudmVsb2NpdHkueCkgKiAxNi81MCk7XG5cdFx0XHRcdGlmIChhbmltYXRpb25TcGVlZCA8IDUpXG5cdFx0XHRcdFx0YW5pbWF0aW9uU3BlZWQgPSA1O1xuXHRcdFx0XHR0aGlzLnBsYXllci5hbmltYXRpb25zLmN1cnJlbnRBbmltLnNwZWVkID0gYW5pbWF0aW9uU3BlZWQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnBsYXllci5hbmltYXRpb25zLnN0b3AoKTtcblx0XHRcdFx0dGhpcy5wbGF5ZXIuaXNXYWxraW5nID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLnBsYXllci53YWxraW5nUmlnaHQpe1xuXHRcdFx0XHR0aGlzLnBsYXllci5zY2FsZS54ID0gMTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucGxheWVyLnNjYWxlLnggPSAtMTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZih0aGlzLnBsYXllci5ib2R5LmJsb2NrZWQuZG93biB8fCB0aGlzLnBsYXllci5ib2R5LnZlbG9jaXR5LnggIT0gMCkge1xuXHRcdFx0aWYgKHRoaXMucGxheWVyLmJvZHkudmVsb2NpdHkueCA+IDApe1xuXHRcdFx0XHR0aGlzLnBsYXllci5ib2R5LnZlbG9jaXR5LnggLS07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnBsYXllci5ib2R5LnZlbG9jaXR5LnggKys7XG5cdFx0XHR9XG5cdFx0fVxuIFx0fSxcbiBcdF9qdW1wOiBmdW5jdGlvbigpe1xuXHRcdGlmKHRoaXMucGxheWVyLmJvZHkuYmxvY2tlZC5kb3duKSB7XG5cdFx0XHR0aGlzLmlzU3RhcnRpbmdUb0p1bXAgPSB0cnVlO1xuXHRcdFx0Ly90aGlzLnBsYXllci5hbmltYXRpb25zLnN0b3AoKTtcblx0XHRcdHRoaXMucGxheWVyLmFuaW1hdGlvbnMucGxheSgnanVtcCcsIDgsIGZhbHNlKTtcblx0XHR9ICBcbiBcdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNYWluUGFuZWw7IiwiLy8gdmFyIFBoYXNlciA9IHJlcXVpcmUoJ3BoYXNlcicpO1xuXG52YXIgTWFpblBhbmVsID0gcmVxdWlyZSgnLi9NYWluUGFuZWwnKTtcblxudmFyIFNwYWNlRXhwbG9yZXIgPSBmdW5jdGlvbigpe307XG5cbndpbmRvdy5TcGFjZUV4cGxvcmVyID0gU3BhY2VFeHBsb3JlcjtcblxuU3BhY2VFeHBsb3Jlci5wcm90b3R5cGUgPSB7XG5cdGluaXQ6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5nYW1lID0gbmV3IFBoYXNlci5HYW1lKDQ4MCwgMjU2LCBQaGFzZXIuQVVUTywgJycpO1xuXHRcdHRoaXMuZ2FtZS5zdGF0ZS5hZGQoJ0Jvb3QnLCBTcGFjZUV4cGxvcmVyLkJvb3QpO1xuXHRcdHRoaXMuZ2FtZS5zdGF0ZS5hZGQoJ1ByZWxvYWQnLCBTcGFjZUV4cGxvcmVyLlByZWxvYWQpO1xuXHRcdHRoaXMuZ2FtZS5zdGF0ZS5hZGQoJ0dhbWUnLCBTcGFjZUV4cGxvcmVyLkdhbWUpO1xuXHRcdHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnQm9vdCcpO1xuXHR9XG59O1xuXG5TcGFjZUV4cGxvcmVyLkJvb3QgPSBmdW5jdGlvbigpe307XG5cblNwYWNlRXhwbG9yZXIuQm9vdC5wcm90b3R5cGUgPSB7XG5cdHByZWxvYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdC8vdGhpcy5sb2FkLmltYWdlKCdwcmVsb2FkYmFyJywgJ2Fzc2V0cy9pbWFnZXMvcHJlbG9hZGVyLWJhci5wbmcnKTtcblxuXHR9LFxuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZ2FtZS5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzAwMCc7XG5cdFx0dGhpcy5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuXHRcdHRoaXMuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xuXHRcdC8vIHRoaXMuc2NhbGUuc2V0U2NyZWVuU2l6ZSh0cnVlKTtcblx0XHR0aGlzLmdhbWUucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xuXHRcdHRoaXMuc3RhdGUuc3RhcnQoJ1ByZWxvYWQnKTtcblx0fSBcbn07XG5cblNwYWNlRXhwbG9yZXIuUHJlbG9hZCA9IGZ1bmN0aW9uKCl7fTtcblxuU3BhY2VFeHBsb3Jlci5QcmVsb2FkLnByb3RvdHlwZSA9IHtcblx0cHJlbG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0Ly90aGlzLmxvYWQuaW1hZ2UoJ3ByZWxvYWRiYXInLCAnaW1nL3ByZWxvYWRlci1iYXIucG5nJyk7XG5cdFx0dGhpcy5sb2FkLnRpbGVtYXAoJ3Byb2xvZ3VlTGV2ZWwnLCAnbWFwcy9wcm9sb2d1ZS5qc29uJywgbnVsbCwgUGhhc2VyLlRpbGVtYXAuVElMRURfSlNPTik7XG5cdFx0dGhpcy5sb2FkLmltYWdlKCdnYW1lVGlsZXMnLCAnaW1nL21hcC5wbmcnKTtcblx0XHR0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3BsYXllcicsICdpbWcvcGxheWVyLnBuZycsIDE2LCAxNik7XG5cdFx0dGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdidWxsZXRzJywgJ2ltZy9idWxsZXRzLnBuZycsIDE2LCAxNik7XG5cdFx0Ly8gdGhpcy5sb2FkLmF1ZGlvKCdmaXJlJywgJ2ltZy9maXJlLndhdicpO1xuXHR9LFxuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc3RhdGUuc3RhcnQoJ0dhbWUnKTtcblx0fVxufTtcblxuU3BhY2VFeHBsb3Jlci5HYW1lID0gZnVuY3Rpb24oKXt9O1xuXG5TcGFjZUV4cGxvcmVyLkdhbWUucHJvdG90eXBlID0ge1xuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBtYWluUGFuZWwgPSBuZXcgTWFpblBhbmVsKHRoaXMuZ2FtZSk7XG5cdFx0dGhpcy5jdXJyZW50UGFuZWwgPSBtYWluUGFuZWw7XG5cdFx0bWFpblBhbmVsLmluaXQoKTtcblx0XHRtYWluUGFuZWwuc2hvdygpO1xuXHR9LFxuXHR1cGRhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5jdXJyZW50UGFuZWwudXBkYXRlKCk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3BhY2VFeHBsb3JlcjsiXX0=
