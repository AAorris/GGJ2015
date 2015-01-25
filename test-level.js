
BasicGame.testLevel = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.network;       //  the networking functionality
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


    backdrop = game.add.sprite(0,0, 'backdrop');
    backdrop.fixedToCamera = true;


    treeline = game.add.sprite(0,380, 'treeline');
    game.physics.enable(treeline, Phaser.Physics.ARCADE);
    treeline.body.allowGravity = false;


        //treeline = game.add.tileSprite(-500,380,4840,500,'treeline');
        floor = game.add.tileSprite(0,680,3840,800,'floor');
        game.physics.enable(floor,Phaser.Physics.ARCADE);
        floor.body.immovable = true;
        floor.body.allowGravity = false;
        mGround = game.add.sprite(0,0,'mGround');
        //ADD OBJECTS TO THE STAGE, START ANIMATIONS
        //initialize sprite layer
        spriteLayer = game.add.group();
        spriteLayer.enableBody = true;
        spriteLayer.physicsBodyType = Phaser.Physics.ARCADE;            
        spriteLayer.collideWorldBounds = true;
        //floor of level init

        //ground tile loading and placement
        //bird init
        bird = spriteLayer.create(800, game.world.centerY, 'bird');
        bird.animations.add('birdidle', [0,1,2,3] ,8,true);
        bird.anchor.setTo(.5,1);
        bird.body.gravity.y=0;
        bird.body.allowGravity=false;
        bird.animations.play('birdidle');
        //cat init
        cat = spriteLayer.create(500, game.world.centerY - 400,'cat');
        cat.animations.add('cat',[0,1,2,3,4,5,6,7,8,9,10,11],6,true);
        cat.anchor.setTo(.5,1);
        cat.animations.play('cat',6,true);
        //cat.animations.add('catAttack', [0,1,2,3,4,5,6],6,true);
        //deer init
        deer = spriteLayer.create(1500, game.world.centerY, 'deer');
        deer.animations.add('deer',[0,1,2,3,4,5,6,7,8,9,10,11],6,true);
        deer.anchor.setTo(.5,1);
        deer.animations.play('deer',8,true);
        //bear init
        bear = spriteLayer.create(1000, game.world.centerY, 'bear');
        bear.animations.add('bear',[0,1,2,3,4,5,6,7,8,9,10,11],7,true);
        bear.anchor.setTo(.5,1);
        bear.animations.play('bear',6,true);
        //girl init
        //girl = spriteLayer.create(game.world.x = 50,game.world.centerY, 'girl');

        //ghost layer init
        ghostLayer = game.add.group();
        ghostLayer.enableBody = true;
        ghostLayer.physicsBodyType = Phaser.Physics.ARCADE;
        //ghostLayer.collideWorldBounds = true;
        //ghost init

        ghost = ghostLayer.create(game.world.x = 400, game.world.centerY, 'ghost');
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
        mouse = spriteLayer.create(300,100, 'mouse');
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
        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); 
        wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            poss: game.input.keyboard.addKey(Phaser.Keyboard.L)
        };

        enemies[0] = mouse;
        enemies[1] = cat;
        enemies[2] = bear;
        enemies[3] = deer;
        enemies[4] = bird;

        this.jam = {};
        var jam = this.jam;
        publicJam = jam;
        if(!publicJam.sprites) {
            publicJam.sprites = game.add.group();
            publicJam.sprites.enableBody = true;
            publicJam.sprites.physicsBodyType = Phaser.Physics.ARCADE;
        }
        console.log("Created.");

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        game.network = {
            client : false,
            server : false,
            ready: false,
            jam:false,
            id: 0,
            onComplete : function() {},
            setup : function(jam) {
                console.log("Setting up my jam...");
                this.jam = jam;

                var client = new Eureca.Client();
                game.network.client = client;

                client.ready(function(proxy) {
                    game.network.server = proxy;
                    game.network.ready = true;
                    console.log("Got Proxy.");
                });

                client.exports.setId = function(id) {
                    console.log("Setting id");
                    //console.log(game.network);
                    window.netID = id;
                    //window.
                    game.network.server.handshake();
                }

                //console.log("Jam:");
                //console.log(this.jam);
                client.exports.createUser = function(i, x, y)
                {
                    //if(i == window.netID) return;
                    console.log("Got i of "+i);

                    for(var id in window.characters) {
                        if(id==i) {
                            console.log("Already here!");
                            return;
                        }
                    }

                    console.log("Creating user!");
                    //console.log(publicJam);
                    window.characters[i] = new Girl(game,publicJam.sprites,x,y,i);
                    window.characters[i].init();
                    if(i == window.netID){
                        console.log("That's me!");
                        game.camera.follow(window.characters[i].girl);
                    }
                    console.log(window.characters);
                }

                client.exports.createGirl = function(i, x, y)
                {
                    //if(i == window.netID) return;
                    console.log("Got i of "+i);

                    for(var id in window.characters) {
                        if(id==i) {
                            console.log("Already here!");
                            return;
                        }
                    }

                    console.log("Creating user!");
                    //console.log(publicJam);
                    window.characters[i] = new Girl(game,publicJam.sprites,x,y,i);
                    window.characters[i].init();
                    if(i == window.netID){
                        console.log("That's me!");
                        game.camera.follow(window.characters[i].girl);
                    }
                    console.log(window.characters);
                }

                client.exports.createGhost = function(i, x, y)
                {
                    console.log("Making ghost for " + i);

                    for(var id in window.characters) {
                        if(id==i) {
                            console.log("Already here!");
                            return;
                        }
                    }

                    console.log("Creating ghost...");
                    window.characters.ghost = new Ghost(game,publicJam.sprites, x, y, i);
                    window.characters[i] = window.characters.ghost;
                    //window.characters.ghost.init();
                    if(i == window.netID) {
                        console.log("That's me!");
                        var filter = new Phaser.Filter.Gray(game);
                        game.world.filters = [filter];
                        //console.log(window.characters.ghost);
                        //game.camera.follow(window.characters.ghost.sprite);
                    }
                    //console.log(window.characters);
                }

                client.exports.removeUser = function(id)
                {
                    console.log("Removing " + id);
                    if(window.characters[id])
                        window.characters[id].remove();

                    //console.log('killing ', id, publicJam.users[id]);
                }
                client.exports.removeGirl = function(id)
                {
                    console.log("Removing " + id);
                    if(window.characters[id])
                        window.characters[id].remove();

                    //console.log('killing ', id, publicJam.users[id]);
                }
                client.exports.removeGhost = function(id)
                {
                    console.log("Removing " + id);
                    if(window.characters[id])
                        window.characters[id].remove();

                    //console.log('killing ', id, publicJam.users[id]);
                }
                client.exports.forClient = function(data)
                {
                    userData = data;
                }
                client.exports.serverToUser = function(id, state)
                {

                    var users = publicJam.users;
                    if(users[id]) {
                        publicJam.users[id].girl.body.x = state.x;
                        publicJam.users[id].girl.body.y = state.y;
                        publicJam.users[id].girl.body.vx = state.vx;
                        publicJam.users[id].girl.body.vy = state.vy;
                        publicJam.users[id].girl.body.ax = state.ax;
                        publicJam.users[id].girl.body.ay = state.ay;
                        publicJam.users[id].facing = state.facing;
                        //print(state.x+ " " +users[id].girl.body.x);
                        //console.log(users[id]);
                        //console.log(id+" was at "+state.x + " " + state.y);
                        users[id].anim = state.anim;
                    }
                }
                return this;
            }
        };
        this.game.network.setup(jam);
    },

    update: function () {
        var game = this.game;
        if(!this.game.network.ready) return;
        if(!window.characters) return;
        if(!window.userData) return;

        //console.log("winning");

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

        this.game.physics.arcade.collide(this.jam.sprites,floor);

        game.physics.arcade.collide(mouse,floor);
        game.physics.arcade.collide(bear,floor);
        game.physics.arcade.collide(deer,floor);
        game.physics.arcade.collide(cat,floor);

            //Ghost Movement Decision Tree
            // else if(Math.abs(dist) < 100) {
            //     mouse.animations.play('angry',4,true);
            // } else {
            //     mouse.animations.play('nice',4,true);
            // }

            //Bird
        bird.body.velocity.x=0;
        if(bird.body.x >=birdMaxX && birdSpeed > 0){
            birdSpeed = (-birdSpeed);
            bird.scale.x=1;
        }
        else if(bird.body.x <= birdMin && birdSpeed < 0){
            birdSpeed = (-birdSpeed);
            bird.scale.x=-1;
        }
        bird.body.velocity.x +=birdSpeed;
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};