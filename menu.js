
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {
		var game = this.game;
		this.title = game.add.image(game.world.centerX,game.world.centerY,'title_screen');
		this.title.anchor.setTo(0.5,0.5);
		this.playbutton = game.add.button(game.world.centerX,game.world.centerY,'playbutton',function(){
			this.game.state.start('Game')
		});
		this.playbutton.anchor.setTo(0.5,0.50);
	},

	update: function () {
		//this.startGame();
	},

};