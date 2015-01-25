Girl = function ( index, game, player ) {
	this.input = {
		left:false,
		right:false,
		up:false,
		down:false
	}

	var x = 0;
	var y = 0;

	this.game = game;
	this.alive = true;
	this.player = player;
	this.id = index;

	this.sprite = game.add.sprite(x,y,'girl');
}

Girl.prototype.die = function() {
	this.alive = false;
	this.sprite.kill();
}

Girl.prototype.update = function() {
	for(var i in this.input)
		this.cursor[i] = this.input[i];

	if(this.cursor.left)
		console.log("Girl left");
	if(this.cursor.right)
		console.log("Girl right");
	if(this.cursor.up)
		console.log("Girl up");
	if(this.cursor.down)
		console.log("Girl down");
}