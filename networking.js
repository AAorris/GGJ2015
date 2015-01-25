var server = false;
var NET = {
    id:0,
    server:false,
    game:false,
    sprites:false,
};

NodeNetwork = function() { 
    this.client = false;
    this.server = false;
    this.read = false;
    this.jam = false;
    this.game = false;
    this.id = 0;
    this.onComplete = function() {},
    this.setup = function(game, sprites) {
        console.log("Setting up my jam...");
        NET.sprites = sprites;
        NET.game = game;
        var client = this.client = new Eureca.Client();
        var server = this.server;
        client.ready(function(proxy) {
            this.ready = true;
            server = proxy;
            NET.server = server;
            console.log("Got Proxy");
            console.log(proxy);
        });

        client.exports.setId = function(id) {
            console.log("Setting id " + id);
            console.log(server);
            this.id = id;
            NET.id = id;
            //window.
            server.handshake();
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
            console.log(NET.game);
            window.characters[i] = new Girl(game,NET.sprites,x,y,i);
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
            window.characters[i] = new Girl(game,NET.sprites,x,y,i);
            //window.characters[i].init();
            if(i == NET.id) {
                console.log("That's me!");
                game.camera.follow(window.characters[i].girl);
                window.characters[i].canon = true;
            } else {
                window.characters[i].canon = false;
            }
            console.log(window.characters[i].canon);
        }

        client.exports.createGhost = function(i, x, y)
        {
            console.log("Making ghost for " + i);
            console.log(NET.game);

            for(var id in window.characters) {
                if(id==i) {
                    console.log("Already here!");
                    return;
                }
            }

            console.log("Creating ghost...");
            window.characters.ghost = new Ghost(game,NET.sprites, x, y, i);
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
            console.log("Getting data for client");
            console.log(data);
            for(var i in window.characters) {
                    //console.log(window.characters[NET.id].sync.data);
                console.log("Got data");
                console.log(data[i]);
                window.characters[i].sync.data = data[i].data;
            }
            console.log(NET.server);
            if(NET.server) {
                //console.log("Sending my data to server");
                //console.log(window.characters[NET.id].sync.data);
                //console.log(window.characters[NET.id]);
                NET.server.userToServer(window.characters[NET.id].sync.data);
            }
        }
        client.exports.serverToUser = function(id, state)
        {
            console.log("Getting servertouser");
            // for(var i in window.characters) {
            //     if(window.characters[i] && i != NET.id)
            //         window.characters[i].sync.from(state);
            // }
            // var users = publicJam.users;
            // if(users[id]) {
            //     publicJam.users[id].girl.body.x = state.x;
            //     publicJam.users[id].girl.body.y = state.y;
            //     publicJam.users[id].girl.body.vx = state.vx;
            //     publicJam.users[id].girl.body.vy = state.vy;
            //     publicJam.users[id].girl.body.ax = state.ax;
            //     publicJam.users[id].girl.body.ay = state.ay;
            //     publicJam.users[id].facing = state.facing;
            //     //print(state.x+ " " +users[id].girl.body.x);
            //     //console.log(users[id]);
            //     //console.log(id+" was at "+state.x + " " + state.y);
            //     users[id].anim = state.anim;
            // }
        }
    }
};