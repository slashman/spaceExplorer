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