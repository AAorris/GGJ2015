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

        girl.animations.add('girlmove', [6,7,8,9,10,11],0,true);   
        girl.animations.add('girlidle', [0,1,2] ,4,true);
        girl.animations.add('girlsmack',[3,4,5] ,8,true);
        girl.anchor.setTo(.5,1);      
        girl.animations.play('girlidle');

		this.controls = {
			jump : game.input.keyboard.addKey(Phaser.Keyboard.W),
			left : game.input.keyboard.addKey(Phaser.Keyboard.A),
			right : game.input.keyboard.addKey(Phaser.Keyboard.D),
			attack : game.input.keyboard.addKey(Phaser.Keyboard.S)
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
        if(game.camera.x > 0 && game.camera.x < 2560){
            fGround.body.velocity.x =+ girlSpeed*1.3;
            treeline.body.velocity.x =- girlSpeed*0.3;
        }
    }
    else if(controls.right.isDown){
        girl.body.velocity.x = girlSpeed;
        girl.scale.x=1;
        girl.animations.play('girlmove',8,true);
        if(game.camera.x > 0 && game.camera.x < 2560){
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
    if (controls.jump.isDown && game.time.now > jumpTimer)
    {
        //console.log("Jumping");
        girl.body.velocity.y = -300;
        jumpTimer = game.time.now + 450;
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