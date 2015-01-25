NodeNetwork = function() { 
    return {
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
};