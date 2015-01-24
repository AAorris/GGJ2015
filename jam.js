var jam = function() 
{


    var ready = false;
    var eurecaServer;

    var eurecaClientSetup = function() {
        var eurecaClient = new Eureca.Client();

        eurecaClient.ready(function(proxy) {
            eurecaServer = proxy;
            //create();
            console.log("Ready.");
        });

        eurecaClient.exports.setId = function(id)
        {
            myId = id;
            console.log("Connected as " + myId);
            create();
            eurecaServer.handshake();
            ready = true;
        }

        eurecaClient.exports.updateState = function(id, state)
        {
            if(characters[id]) {
                characters[id].cursor = state;
                characters[id].body.x = state.x;
                characters[id].body.y = state.y;
                characters[id].update();
            }
        }
    };

    var game = new Phaser.Game(1280, 800, Phaser.AUTO, '', {preload: preload, create: eurecaClientSetup, update: update, render: render});   

    function preload () {
        game.load.spritesheet('girl', 'img/girl_spritesheet_idle.png',200,200);
        game.load.spritesheet('ghost', 'img/shade_spritesheet_idle.png',184,276);
        game.load.spritesheet('floor', 'img/holdbg.png');
        game.load.spritesheet('mouse', 'img/mouse.png', 225, 113, 12);
    }

    var spriteLayer;
    var ghostLayer;

    var ghost, girl, mouse;
    var floor;
    var cursors, wasd, jumpButton;
    var ghostSpeed = 100;
    var girlSpeed = 400;
    var jumpTimer = 0;
    var ghostFacing = 'right';
    var girlFacing = 'right';

    function create () {
        game.world.setBounds(-1280,0,2560,800);

        spriteLayer = game.add.group();
        spriteLayer.enableBody = true;
        spriteLayer.physicsBodyType = Phaser.Physics.ARCADE;            
        spriteLayer.collideWorldBounds = true;

        ghostLayer = game.add.group();
        ghostLayer.enableBody = true;
        ghostLayer.physicsBodyType = Phaser.Physics.ARCADE;
        ghostLayer.collideWorldBounds = true;

        //@mouse
        mouse = spriteLayer.create(300,100, 'mouse');
        mouse.scale.set(0.5,0.5);
        mouse.animations.add('nice',[0,1,2,3,2,1]);
        mouse.animations.add('angry',[4,5,6,7,6,5]);
        mouse.animations.add('ghost',[8]);
        mouse.animations.play('nice', 4, true);

        //@floor
        floor = game.add.tileSprite(0,800-195,1280,800,'floor');
        game.physics.enable(floor,Phaser.Physics.ARCADE);
        floor.body.immovable = true;
        floor.body.allowGravity = false;

        //@ghost
        ghost = ghostLayer.create(game.world.centerX, game.world.centerY, 'ghost');
        ghost.collideWorldBounds = true;
        ghost.animations.add('idle', [0,1,2,3,4], 7, true);
        ghost.anchor.setTo(.5,1);
        ghost.animations.play('idle');
        ghost.body.gravity.y = 0;
        ghost.body.allowGravity = false;

        game.stage.backgroundColor='#666';
        //game.physics.enable(ghost, Phaser.Physics.P2JS);

        //@girl
        girl = spriteLayer.create(game.world.x = 150,game.world.centerY, 'girl');
        girl.body.checkCollision.up = true;
        girl.body.checkCollision.down = true;
        girl.body.checkCollision.left= true;
        girl.body.checkCollision.right = true;
        girl.body.setSize(94, 133, 43, -38);
        game.camera.follow(girl);
        girl.body.bounce.y = 0.1;
        //game.camera.follow(girl,bg);
        girl.anchor.setTo(.5,1);
        girl.animations.add('girlIdle', [0,1,2] ,4,true);
        game.camera.follow(girl,floor);
        girl.animations.play('girlIdle');

        //button references
        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); 
        wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };
        game.physics.arcade.gravity.y = 250;
    }

    function render(){
        if(!ready) return;
        game.debug.bodyInfo(girl, 32,32);
    }

    function update()
    {
        if(!ready) return;
        game.physics.arcade.collide(ghostLayer,floor);
        game.physics.arcade.collide(spriteLayer,floor);

        ghost.body.acceleration.set(0,0);
        ghost.body.velocity.x *= 0.95;
        ghost.body.velocity.y *= 0.95;
        if(cursors.left.isDown){
            ghost.body.acceleration.x -= ghostSpeed*10;
            ghostFacing = 'left';
            ghost.scale.x=-1;
        }
        if(cursors.right.isDown){
            ghost.body.acceleration.x += ghostSpeed*10;
            ghostFacing = 'right';
            ghost.scale.x=1;
        }
        if(cursors.up.isDown){
            ghost.body.acceleration.y -= ghostSpeed*10;
            ghostFacing = 'up';
        }
        if(cursors.down.isDown){
            ghost.body.acceleration.y +=ghostSpeed*10;
            ghostFacing = 'down';
        }
        var dist = (girl.body.x - mouse.body.x);
        var ghostDist = (ghost.x - mouse.body.x);
        var dist = girl.body.x - mouse.body.x;

        mouse.body.acceleration.x = dist;
        if(mouse.scale.x > 0 && mouse.body.velocity.x > 0) mouse.scale.x *=-1;
        if(mouse.scale.x < 0 && mouse.body.velocity.x < 0) mouse.scale.x *=-1;

        if(Math.abs(ghostDist) < 100) {
            mouse.body.acceleration.x = 0;
            mouse.body.velocity.x=0;
            mouse.animations.play('ghost',4,true);
        }
        else if(Math.abs(dist) < 100) {
            mouse.animations.play('angry',4,true);
        } else {
            mouse.animations.play('nice',4,true);
        }

        //girl.body.velocity.x = 0;
        //girl.body.velocity.y = 0;
        girl.body.acceleration.set(0,0);
        if(wasd.left.isDown){
            girl.body.acceleration.x = -girlSpeed * ((girl.body.touching.down) ? 1 : 0.7);
            girlFacing = 'left';
            girl.scale.x=-1;
        }
        if(wasd.right.isDown){
            girl.body.acceleration.x = girlSpeed * ((girl.body.touching.down) ? 1 : 0.7);
            girlFacing = 'right'
            girl.scale.x=1;
        }
        if(wasd.down.isDown){
            girl.body.acceleration.y = +girlSpeed;
            girlFacing = 'down';
        }
        if (wasd.up.isDown && (girl.body.onFloor() || girl.body.touching.down) && game.time.now > jumpTimer)
        {
            girl.body.velocity.y = -200;
            console.log("Jumping");
            girl.body.velocity.y = -250;
            jumpTimer = game.time.now + 750;
        }
        if(Math.abs(girl.body.acceleration.x) < 0.01) {
            girl.body.velocity.x *= .93 * ((girl.body.touching.down)?0.8:1.0);
        }

    }

};