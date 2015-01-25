
BasicGame.testLevel = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
    this.jam;

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};
BasicGame.testLevel.prototype = {

    create: function () {
    var game = this.game;
    //Current Game information
    game.world.setBounds(0,0,3840,800);
    game.stage.backgroundColor='#163233';
    game.physics.arcade.gravity.y = 450;


    var backdrop = this.backdrop = game.add.sprite(0,0, 'backdrop');
    backdrop.fixedToCamera = true;


    var treeline = this.treeline = game.add.sprite(0,380, 'treeline');
    game.physics.enable(treeline, Phaser.Physics.ARCADE);
    treeline.body.allowGravity = false;


        //treeline = game.add.tileSprite(-500,380,4840,500,'treeline');
        var floor = this.floor = game.add.tileSprite(0,680,3840,800,'floor');
        game.physics.enable(floor,Phaser.Physics.ARCADE);
        floor.body.immovable = true;
        floor.body.allowGravity = false;
        mGround = game.add.sprite(0,0,'mGround');
        //ADD OBJECTS TO THE STAGE, START ANIMATIONS
        //initialize sprite layer
        var spriteLayer = this.spriteLayer = game.add.group();
        spriteLayer.enableBody = true;
        spriteLayer.physicsBodyType = Phaser.Physics.ARCADE;            
        spriteLayer.collideWorldBounds = true;
        //floor of level init

        //ground tile loading and placement
        //bird init
        var bird = this.bird = spriteLayer.create(800, game.world.centerY, 'bird');
        bird.animations.add('birdidle', [0,1,2,3] ,8,true);
        bird.anchor.setTo(.5,1);
        bird.body.gravity.y=0;
        bird.body.allowGravity=false;
        bird.animations.play('birdidle');
        //cat init
        var cat = this.cat = spriteLayer.create(500, game.world.centerY - 400,'cat');
        cat.animations.add('cat',[0,1,2,3,4,5,6,7,8,9,10,11],6,true);
        cat.anchor.setTo(.5,1);
        cat.animations.play('cat',6,true);
        //cat.animations.add('catAttack', [0,1,2,3,4,5,6],6,true);
        //deer init
        var deer = this.deer = spriteLayer.create(1500, game.world.centerY, 'deer');
        deer.animations.add('deer',[0,1,2,3,4,5,6,7,8,9,10,11],6,true);
        deer.anchor.setTo(.5,1);
        deer.animations.play('deer',8,true);
        //bear init
        var bear = this.bear = spriteLayer.create(1000, game.world.centerY, 'bear');
        bear.animations.add('bear',[0,1,2,3,4,5,6,7,8,9,10,11],7,true);
        bear.anchor.setTo(.5,1);
        bear.animations.play('bear',6,true);
        //girl init
        //girl = spriteLayer.create(game.world.x = 50,game.world.centerY, 'girl');

        //ghost layer init
        var ghostLayer = this.ghostLayer = game.add.group();
        ghostLayer.enableBody = true;
        ghostLayer.physicsBodyType = Phaser.Physics.ARCADE;
        //ghostLayer.collideWorldBounds = true;
        //ghost init

        var ghost = this.ghost = ghostLayer.create(game.world.x = 400, game.world.centerY, 'ghost');
        ghost.collideWorldBounds = true;
        //ghost.fixedToCamera = true;
        ghost.animations.add('idle', [0,1,2,3,4], 7, true);
        ghost.animations.add('possess',[1,2,3,4,5],6,true);
        ghost.animations.add('neophyte',[17,18,19,20],7,true);
        ghost.animations.add('transform',[26,27,28,29,30,31,32,33,34],9,true);
        ghost.anchor.setTo(.5,1);
        ghost.body.gravity.y = 0;
        ghost.body.allowGravity = false;
        ghost.animations.play('idle');

        //mouse init
        var mouse = this.mouse = spriteLayer.create(300,100, 'mouse');
        mouse.scale.set(0.5,0.5);
        mouse.animations.add('nice',[0,1,2,3,2,1]);
        mouse.animations.add('angry',[4,5,6,7,6,5]);
        mouse.animations.add('ghost',[8]);
        mouse.animations.play('nice', 4, true);
        //girl in focus
        //game.camera.follow(girl);

        fGround = game.add.sprite(0,0, 'fGround');
        game.physics.enable(fGround, Phaser.Physics.ARCADE);
        fGround.body.allowGravity = false;

        //treeline = game.add.sprite(0,380, 'treeline');
        //game.physics.enable(treeline, Phaser.Physics.ARCADE);
        //treeline.body.allowGravity = false;

        //alias input systems to references
        var cursors = this.cursors = game.input.keyboard.createCursorKeys();
        var jumpButton = this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); 
        var wasd = this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            poss: game.input.keyboard.addKey(Phaser.Keyboard.L)
        };
        this.enemies = [];
        this.enemies[0] = mouse;
        this.enemies[1] = cat;
        this.enemies[2] = bear;
        this.enemies[3] = deer;
        this.enemies[4] = bird;

        this.jam = {};
        var jam = this.jam;

        //publicJam = jam;
        if(!jam.sprites) {
            jam.sprites = game.add.group();
            jam.sprites.enableBody = true;
            jam.sprites.physicsBodyType = Phaser.Physics.ARCADE;
        }
        //jam.sp
        console.log("Created.");

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        this.girl = new Girl(game,jam.sprites,100, 100,'');
        this.girl.init();
    },

    update: function () {
        var game = this.game;
        if(HAS_NODE==true){
            if(!this.game.network.ready) return;
            if(!window.characters) return;
            if(!window.userData) return;
            for(var user in window.userData) {
                if(user == window.netID){
                    //console.log(window.userData[user]);
                    if(window.characters[user])
                        window.characters[user].update();
                } else if(window.characters[user]) {
                    window.characters[user].body.x = window.userData[user].x;
                    window.characters[user].body.y = window.userData[user].y;
                    window.characters[user].body.vx = window.userData[user].vx;
                    window.characters[user].body.vy = window.userData[user].vy;
                    window.characters[user].body.ax = window.userData[user].ax;
                    window.characters[user].body.ay = window.userData[user].ay;
                    window.characters[user].facing = window.userData[user].facing;

                }
            }

        }

        //console.log("winning");

        
        console.log("updating");

        this.girl.update();
        this.physics.arcade.collide(this.jam.sprites,this.floor);

        this.physics.arcade.collide(this.mouse,this.floor);
        this.physics.arcade.collide(this.bear,this.floor);
        this.physics.arcade.collide(this.deer,this.floor);
        this.physics.arcade.collide(this.cat,this.floor);

            //Ghost Movement Decision Tree
            // else if(Math.abs(dist) < 100) {
            //     mouse.animations.play('angry',4,true);
            // } else {
            //     mouse.animations.play('nice',4,true);
            // }

        //     //Bird
        // bird.body.velocity.x=0;
        // if(bird.body.x >=birdMaxX && birdSpeed > 0){
        //     birdSpeed = (-birdSpeed);
        //     bird.scale.x=1;
        // }
        // else if(bird.body.x <= birdMin && birdSpeed < 0){
        //     birdSpeed = (-birdSpeed);
        //     bird.scale.x=-1;
        // }
        // bird.body.velocity.x +=birdSpeed;
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};