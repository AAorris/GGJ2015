
BasicGame.Game = function (game) {

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
 
BasicGame.Game.prototype = {

    create: function () {
        var game = this.game;
        game.world.setBounds(-1280,0,2560,800);
        this.game.physics.arcade.gravity.y = 250;
        this.jam = {};
        var jam = this.jam;
        var treeline = jam.treeline = game.add.tileSprite(0,-50,2006,778,'treeline');
        var floor = jam.floor = game.add.tileSprite(-800,600+100,1920,160,'floor');
        var house = jam.house = game.add.tileSprite(0,400+100,1192,542,'house');


        //partner = game.add.sprite(50,50,'girl');

        house.scale.set(0.5,0.5);

        game.physics.enable(floor,Phaser.Physics.ARCADE);
        floor.body.immovable = true;
        floor.body.allowGravity = false;
        floor.body.setSize(1280,800,0,60);

        this.jam.sprites = this.add.group();
        jam.sprites.enableBody = true;
        jam.sprites.physicsBodyType = Phaser.Physics.ARCADE;
        jam.sprites.collideWorldBounds = true;
        //jam.girl = new Girl(this.game, jam.sprites,150,150);

        jam.users = [];

        publicJam = jam;
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
                client.exports.removeUser = function(id)
                {    
                    window.characters[i].remove();
                    console.log('killing ', id, publicJam.users[id]);
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
        if(!this.game.network.ready) return;
        if(!window.characters) return;
        if(!window.userData) return;

        //console.log("winning");

        for(var user in window.userData) {
            if(user == window.netID){
                //console.log(window.userData[user]);
                window.characters[user].update();
            } else if(window.characters[user]) {
                //console.log(window.userData[user]);
                //console.log("chars");
                //console.log(window.characters[user]);
                //console.log(window.characters[user][user]);
                window.characters[user].body.x = window.userData[user].x;
                window.characters[user].body.y = window.userData[user].y;
                //publicJam.users[user].girl.body.x = window.userData[user].x;//.set(window.userData[user]);
                //publicJam.users[user].girl.body.y = window.userData[user].y;
            }
        }
        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        //this.jam.girl.update();
        this.game.physics.arcade.collide(this.jam.sprites,this.jam.floor);
        this.jam.treeline.x = this.game.camera.x*0.9;
        for (var i = 0; i < publicJam.users.length; i++) {
            //console.log(publicJam.users[i]);
            publicJam.users[i].update();
        };
        // if(typeof userData != "undefined") {
        //     //console.log(userData);
        //     for(var user in userData) {
        //         if(user == this.game.network.id) continue;
        //         partner.x = userData[user].x;
        //         partner.y = userData[user].y;
        //         //console.log(partner.x+" "+partner.y);
        //         //break;
        //     }
        // }
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};