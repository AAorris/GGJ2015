
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {
	},

	update: function () {
		this.startGame();
	},

	startGame: function (pointer) {
		//if there was music, stop it here
		this.state.start('Game');
	}

};