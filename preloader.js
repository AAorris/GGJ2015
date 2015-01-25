
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

var spriteLayer, backgroundLayer;
var ghostLayer;
var enemies = [];
var ghost, mouse, bird, bear, deer, cat;
var floor;
var cursors, wasd, jumpButton;
var ghostSpeed = 350;
var ghostSpeed = 4;
var girlSpeed = 500;
var jumpTimer = 0;
var backdrop;

var ghostFacing = "left";
//var girlFacing = 'right';
var birdMaxX = 700;
var birdMin = 300;
var birdSpeed = 200;
var treeline;
var mGround, fGround;

var moveloaded = false;
var idleloaded = true;
var smackLoaded = false;
var girlattacking = false;

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		//this.background = this.add.sprite(0, 0, 'preloaderBackground');
		//this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		//this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, swap them for your own.
		//this.load.image('titlepage', 'images/title.jpg');
		//this.load.atlas('playButton', 'images/play_button.png', 'images/play_button.json');
		//this.load.audio('titleMusic', ['audio/main_menu.mp3']);
		//this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
		//	+ lots of other required assets here

        this.game.load.spritesheet('girl', 'img/girl.png',146,164);

        this.game.load.spritesheet('ghost', 'img/ghost.png',200,300);
        this.game.load.spritesheet('floor', 'img/holdbg.png');
        
        this.game.load.spritesheet('mouse', 'img/mouse.png', 225, 113, 12);
        this.game.load.spritesheet('bird', 'img/bird.png',139,137);
        this.game.load.spritesheet('bear', 'img/bear.png',486,375);
        this.game.load.spritesheet('deer','img/deer.png',155,353);
        this.game.load.spritesheet('cat','img/cat.png',168,113);
        this.game.load.spritesheet('catAttack','img/cat_attack.png',169,117);

        this.game.load.image('mGround', 'img/mGround.png');
        this.game.load.image('fGround', 'img/foreground.png');
        this.game.load.image('backdrop', 'img/backdrop.png');
        this.game.load.image('treeline', 'img/treeline_long.png');

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		//this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		/*if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}*/

		this.ready = true;
		//console.log("Network ready.");
		this.state.start('MainMenu');

	}

};