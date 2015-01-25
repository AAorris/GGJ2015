

/*When communicating over the network we need a standard object for things to share*/
function SyncPackage() {
    this.data = {
        x : 0,
        y : 0,
        velocity : {x:0, y:0},
        acceleration : {x:0, y:0},
        action : '',
    }
};

//set the properties of this object
SyncPackage.prototype.from = function(other) {
    for(var property in this.data) {
        this.data[property] = other[property];
    }
};

//set the properties of another object
SyncPackage.prototype.to = function(other) {
    for(var property in this.data) {
        other[property] = this.data[property];
    }
};

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
		up : game.input.keyboard.addKey(Phaser.Keyboard.UP),
		left : game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
		right : game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
		down : game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
	};

	this.sprite = layer.create(x,y,'ghost');
	this.sprite = enableArcade(this.sprite);
	this.sprite.anchor.setTo(0.5,0.5);
    this.velocity = this.sprite.body.velocity;
	this.sprite.body.gravity.y = .01;
	this.sprite.body.drag.set(0.1,0.1);
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

    if(this.canon) {
        this.sprite.body.acceleration.set(0,-400);

        if(this.controls.left.isDown){
            this.sprite.x -= ghostSpeed;
            ghostFacing = 'left';
            this.sprite.scale.x=-1;
        }
        if(this.controls.right.isDown){
            this.sprite.x += ghostSpeed;
            ghostFacing = 'right';
            this.sprite.scale.x=1;
        }
        if(this.controls.up.isDown){
            this.sprite.y -= ghostSpeed;
            this.sprite.body.velocity.y -= 10;
            this.sprite.body.acceleration.y -= 10;
            ghostFacing = 'up';
        }
        if(this.controls.down.isDown){
            this.sprite.y +=ghostSpeed;
            ghostFacing = 'down';
        }

        this.sync.from(this.sprite.body);
        console.log(this.sync.data);
    }

 //    for(i = 0; i < 5;i++)
 //    {
	//      if(Math.abs((enemies[i].body.center.x - this.sprite.body.center.x)/(enemies[i].body.center.y - this.sprite.body.center.y)) <= .02)
	//      {
	//         if(this.game.input.keyboard.isDown(Phaser.Keyboard.L)){
	//             possess(enemies[i]);
	//         }
	//     }
	// }

    //mouse movement and decision logic
    //var ghostDist = (this.sprite.x - mouse.body.x);
    //var dist = girl.body.x - mouse.body.x;
    //mouse.body.acceleration.x = dist;
    // if(mouse.scale.x > 0 && mouse.body.velocity.x > 0) mouse.scale.x *=-1;
    // if(mouse.scale.x < 0 && mouse.body.velocity.x < 0) mouse.scale.x *=-1;
    // if(Math.abs(ghostDist) < 100) {
    //     mouse.body.acceleration.x = 0;
    //     mouse.body.velocity.x=0;d
    //     mouse.animations.play('ghost',4,true);
    // }


    if(Math.abs(this.sprite.body.acceleration.x) < 0.01) {
        this.sprite.body.velocity.x *= .90;
    }
}

Ghost.prototype.remove = function() {
	console.log("Removing");
	this.girl.alive = false;
	this.girl.destroy();
}

Girl = function(game, layer, x, y, id) {
    this.DRAG_X = 0.7;
    this.SPEED = 400;
    this.SIZE = [94,133,43,0];
    this.BOUNCE = 0.1;
    this.ANCHOR = [0.5,1];
    this.ANIMATIONS = [
        ['idle', [0,1,2], 2, true],
        ['move', [6,7,8,9,10,11], 4, true],
        ['smack', [3,4,5], 8, true],
    ];
    this.controls = {
        jump : game.input.keyboard.addKey(Phaser.Keyboard.W),
        left : game.input.keyboard.addKey(Phaser.Keyboard.A),
        right : game.input.keyboard.addKey(Phaser.Keyboard.D),
        attack : game.input.keyboard.addKey(Phaser.Keyboard.S)
    };

    this.girl = layer.create(x,y,'girl');//this.game.add.sprite(x,y,'girl');//113,105
    var girl = this.girl;
    var body = this.girl.body;

    this.sync = new SyncPackage();
	this.id = id;
	this.game = game;
	//this.girl = this.game.add.sprite(x,y,'girl');

    //standard init from constants
    enableArcade(girl);

	body.setSize.apply(body,this.SIZE);

	body.bounce.y = this.BOUNCE;

    for (var i = 0; i < this.ANIMATIONS.length; i++) {
        girl.animations.add.apply(girl.animations,this.ANIMATIONS[i]);
    };
    girl.anchor.setTo.apply(girl.anchor,this.ANCHOR);

    girl.animations.play('idle');
    girl.body.checkCollision.up = true;
    girl.body.checkCollision.down = true;
    girl.body.checkCollision.left= true;
    girl.body.checkCollision.right = true;
    this.body = this.girl.body;
    this.touching = this.girl.body.touching;
    this.baseScale = 1.0;
}

Girl.prototype.update = function() {
    if(this.girl.body)
        this.sync.from(this.girl.body);
	var controls = this.controls;
	var velocity = this.body.velocity;
	var acceleration = this.body.acceleration;
	var girl = this.girl;
	var game = this.game;
	if(!girl.alive) return;

	//Girl movement decision tree
    //fGround.body.velocity.x = 0;
    //treeline.body.velocity.x = 0;

    if(this.canon) {
        acceleration.set(0,0);
        velocity.x *= this.DRAG_X;

        if(controls.left.isDown) {
            girl.body.velocity.x = -girlSpeed;
            girl.scale.x=-1;
            girl.animations.play('move',8,true);
        }
        else if(controls.right.isDown){
            girl.body.velocity.x = girlSpeed;
            girl.scale.x=1;
            girl.animations.play('move',8,true);
            // if(this.game.camera.x > 0 && this.game.camera.x < 2560){
            //     fGround.body.velocity.x =- girlSpeed*1.3;
            //     treeline.body.velocity.x =+ girlSpeed*0.3;
            // }
        }
         else if(controls.attack.isDown)
         {
             girl.body.velocity.y = +girlSpeed;
             girl.animations.play('smack',12,false);
         }
        else
        {
            girl.animations.play('idle', 8,true);
        }
        if (this.touching.down && controls.jump.isDown && this.game.time.now > jumpTimer)
        {
            //console.log("Jumping");
            girl.body.velocity.y = -300;
            jumpTimer = this.game.time.now + 450;
        }

    	this.girl.scale.x = this.baseScale * ((velocity.x>0)?1:-1);
        this.sync.from(this.girl.body);
        //console.log("my data");
        //console.log(this.sync.data);
        this.sync.data.position = {};
        this.sync.data.position.x = this.girl.body.x;
        this.sync.data.position.y = this.girl.body.y;
    }
}

Girl.prototype.remove = function() {
	console.log("Removing");
	this.girl.alive = false;
	this.girl.destroy();
}