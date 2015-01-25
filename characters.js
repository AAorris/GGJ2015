var enableArcade = function(sprite) {
	sprite.enableBody = true;
	sprite.physicsBodyType = Phaser.Physics.ARCADE;
	sprite.collideWorldBounds = true;
	return sprite;
}

Ghost = function(game, layer, x, y, id) {
	this.id = id;
	this.game = game;
	this.layer = layer;
	this.x = x;
	this.y = y;

	this.controls = {
		up : this.game.input.keyboard.addKey(Phaser.Keyboard.W),
		left : this.game.input.keyboard.addKey(Phaser.Keyboard.A),
		right : this.game.input.keyboard.addKey(Phaser.Keyboard.D),
		down : this.game.input.keyboard.addKey(Phaser.Keyboard.S)
	};

	this.sprite = layer.create(x,y,'ghost');
	this.sprite = enableArcade(this.sprite);
	this.sprite.body.gravity.y = .1;
	this.body = this.sprite.body;
}

Ghost.prototype.update = function() {
	if(this.sprite.body.x <= this.game.camera.x){
        this.sprite.body.x = this.game.camera.x;
    }
    if (this.sprite.body.x >= this.game.camera.x + 1280 - this.sprite.body.width) {
        this.sprite.body.x = this.game.camera.x + 1280 - this.sprite.body.width;
    }
    if (this.sprite.body.y <= 0) {
        this.sprite.body.y = this.game.camera.y;
    }
    if (this.sprite.body.y >= 800 - this.sprite.body.height) {
        this.sprite.body.y = 800 - this.sprite.body.height;
    }

    if(this.controls.left.isDown){
        this.sprite.x -= ghostSpeed;
        ghostFacing = 'left';
        this.sprite.scale.x=1;
    }
    if(this.controls.right.isDown){
        this.sprite.x += ghostSpeed;
        ghostFacing = 'right';
        this.sprite.scale.x=-1;
    }
    if(this.controls.up.isDown){
        this.sprite.y -= ghostSpeed;
        ghostFacing = 'up';
    }
    if(this.controls.down.isDown){
        this.sprite.y +=ghostSpeed;
        ghostFacing = 'down';
    }

    for(i = 0; i < 5;i++)
    {
	     if(Math.abs((enemies[i].body.center.x - this.sprite.body.center.x)/(enemies[i].body.center.y - this.sprite.body.center.y)) <= .02)
	     {
	        if(this.game.input.keyboard.isDown(Phaser.Keyboard.L)){
	            possess(enemies[i]);
	        }
	    }
	}

    //mouse movement and decision logic
    var ghostDist = (ghost.x - mouse.body.x);
    //var dist = girl.body.x - mouse.body.x;
    //mouse.body.acceleration.x = dist;
    if(mouse.scale.x > 0 && mouse.body.velocity.x > 0) mouse.scale.x *=-1;
    if(mouse.scale.x < 0 && mouse.body.velocity.x < 0) mouse.scale.x *=-1;
    if(Math.abs(ghostDist) < 100) {
        mouse.body.acceleration.x = 0;
        mouse.body.velocity.x=0;
        mouse.animations.play('ghost',4,true);
    }


    if(Math.abs(this.sprite.body.acceleration.x) < 0.01) {
        this.sprite.body.velocity.x *= .90;
    }
}

Girl = function(game, layer, x, y, id) {
	this.init = function() {
		this.id = id;
		this.game = game;
		//this.girl = this.game.add.sprite(x,y,'girl');

		this.girl = layer.create(x,y,'girl');//this.game.add.sprite(x,y,'girl');//113,105
		var girl = this.girl;
		console.log(this.girl);
		enableArcade(girl);
	    //this.game.physics.enable(girl, Phaser.Physics.ARCADE);
	    //jam.girl = new Girl(this.game, jam.sprites,150,150);
		var body = this.girl.body;
		body.setSize(94,133,43,0);
		body.bounce.y = 0.1;  

        girl.animations.add('girlmove', [6,7,8,9,10,11],0,true);   
        girl.animations.add('girlidle', [0,1,2] ,4,true);
        girl.animations.add('girlsmack',[3,4,5] ,8,true);
        girl.anchor.setTo(.5,1);      
        girl.animations.play('girlidle');

		this.controls = {
			jump : this.game.input.keyboard.addKey(Phaser.Keyboard.W),
			left : this.game.input.keyboard.addKey(Phaser.Keyboard.A),
			right : this.game.input.keyboard.addKey(Phaser.Keyboard.D),
			attack : this.game.input.keyboard.addKey(Phaser.Keyboard.S)
		};
	    body.checkCollision.up = true;
	    body.checkCollision.down = true;
	    body.checkCollision.left= true;
	    body.checkCollision.right = true;
	    this.body = this.girl.body;
	    this.touching = this.girl.body.touching;
	    this.baseScale = 1.0;
	}
}

Girl.prototype.update = function() {
	var controls = this.controls;
	var velocity = this.body.velocity;
	var acceleration = this.body.acceleration;
	var girl = this.girl;
	var game = this.game;
	if(!girl.alive) return;

	var floored = (girl.body.onFloor() || girl.body.touching.down);

	//Girl movement decision tree
    fGround.body.velocity.x = 0;
    treeline.body.velocity.x = 0;

    if(controls.left.isDown){
        girl.body.velocity.x = -girlSpeed;
        girl.scale.x=-1;
        girl.animations.play('girlmove',8,true);
        if(this.game.camera.x > 0 && this.game.camera.x < 2560){
            fGround.body.velocity.x =+ girlSpeed*1.3;
            treeline.body.velocity.x =- girlSpeed*0.3;
        }
    }
    else if(controls.right.isDown){
        girl.body.velocity.x = girlSpeed;
        girl.scale.x=1;
        girl.animations.play('girlmove',8,true);
        if(this.game.camera.x > 0 && this.game.camera.x < 2560){
            fGround.body.velocity.x =- girlSpeed*1.3;
            treeline.body.velocity.x =+ girlSpeed*0.3;
        }
    }
     else if(controls.attack.isDown)
     {
         girl.body.velocity.y = +girlSpeed;
         girl.animations.play('girlsmack',12,false);
     }
    else
    {
        girl.animations.play('girlidle', 8,true);
    }
    if(!floored)
    {
        girl.body.velocity.x *=.8
    }
    if (controls.jump.isDown && this.game.time.now > jumpTimer)
    {
        //console.log("Jumping");
        girl.body.velocity.y = -300;
        jumpTimer = this.game.time.now + 450;
    }
    if(Math.abs(girl.body.velocity.y)<0.1 && Math.abs(girl.body.acceleration.x) < 0.01) {
        girl.body.velocity.x *= .90;
    }
    if (girl.body.x >= 1280){

    }

	acceleration.set(0,0);
	if(controls.jump.isDown) {
	}
	if(controls.left.isDown) {
		acceleration.x = -800;
	}
	if(controls.right.isDown) {
		acceleration.x = 800;
	}

	velocity.x *= 0.9;

	this.girl.scale.x = this.baseScale * ((velocity.x>0)?1:-1);
	// if(Math.abs(velocity.x) > 0.1) {
	// 	//this.girl.animations.play('walk');
	// 	//this.walk.speed = Math.max(velocity.x*0.05,4);
	// } else {
	// 	this.girl.animations.play('idle');
	// }

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