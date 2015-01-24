Girl = function(game, layer, x, y, id) {
	this.init = function() {
		this.id = id;
		this.game = game;
		//this.girl = game.add.sprite(x,y,'girl');

		this.girl = layer.create(x,y,'girl');//game.add.sprite(x,y,'girl');//113,105
		var girl = this.girl;
		console.log(this.girl);
	    girl.enableBody = true;
	    girl.physicsBodyType = Phaser.Physics.ARCADE;
	    girl.collideWorldBounds = true;
	    //game.physics.enable(girl, Phaser.Physics.ARCADE);
	    //jam.girl = new Girl(this.game, jam.sprites,150,150);
		var body = this.girl.body;
		body.setSize(94,133,43,0);
		body.bounce.y = 0.1;
		girl.anchor.setTo(.5,1);
		girl.animations.add('idle', [0,1,2], 4, true);
		this.walk = girl.animations.add('walk', [3,4,5,6,7,8,9,10], 6, true);
		girl.animations.play('idle');
		this.controls = {
			jump : game.input.keyboard.addKey(Phaser.Keyboard.W),
			left : game.input.keyboard.addKey(Phaser.Keyboard.A),
			right : game.input.keyboard.addKey(Phaser.Keyboard.D),
		};
	    body.checkCollision.up = true;
	    body.checkCollision.down = true;
	    body.checkCollision.left= true;
	    body.checkCollision.right = true;
	    this.body = this.girl.body;
	    this.touching = this.girl.body.touching;
	    this.baseScale = 1.0;
	    game.camera.follow(girl);
	}
}

Girl.prototype.update = function() {
	var controls = this.controls;
	var velocity = this.body.velocity;
	var acceleration = this.body.acceleration;

	acceleration.set(0,0);
	if(controls.jump.isDown) {
        console.log("Jumping");
        velocity.y = -250;
	}
	if(controls.left.isDown) {
		acceleration.x = -800;
	}
	if(controls.right.isDown) {
		acceleration.x = 800;
	}

	velocity.x *= 0.9;

	this.girl.scale.x = this.baseScale * ((velocity.x>0)?1:-1);
	if(Math.abs(velocity.x) > 0.1) {
		this.girl.animations.play('walk');
		this.walk.speed = Math.max(velocity.x*0.05,4);
	} else {
		this.girl.animations.play('idle');
	}

    this.game.network.server.userToServer({
    	x:this.body.x,
    	y:this.body.y,
    	state:"idle"
    });
}

Girl.prototype.remove = function() {
	console.log("Removing");
	this.alive = false;
	this.girl.destroy();
}