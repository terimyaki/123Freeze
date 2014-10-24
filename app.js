var canvas,context;
var gameObjects = {};

window.onload = function(){
	init();
};

function init() {
	canvas = document.getElementById('playArea');
	context = canvas.getContext('2d');
	createGameObjects();
	setInterval(render, gameObjects.speed.totalSpeed);
}

gameObjects.speed = {
	multiplier: 1,
	base: 1000,
	totalSpeed : 1000,
	setMultiplier: function(newMultiplier) {
		multiplier = newMultiplier;
	},
	setBase: function(newBase) {
		base = newBase;
	},
	setTotalSpeed: function() {
		totalSpeed = multiplier * base;
	}
};

function createGameObjects(){
	gameObjects.target = new NumGenerator((canvas.width / 2),(canvas.height / 8), 1, 11, "bold 32pt sans-serif", "gray");
	gameObjects.match = new NumGenerator((canvas.width / 2),(canvas.height / 2), 1, 11, "bold 56pt sans-serif", "black");
	gameObjects.score = 0;
}

function NumGenerator (x, y, min, max, font, fillColor) {
	this.x = x;
	this.y = y;
	this.min = min;
	this.max = max;
	this.num = Math.floor(Math.random() * (max - min)) + min;
	this.font = font;
	this.fillColor = fillColor;

	this.changeNum= function(){
		this.num = Math.floor(Math.random() * (this.max - this.min)) + this.min;
	};
	this.changeColor = function(newColor) {
		this.fillColor = newColor;
	};
	this.changeXY = function(newX, newY){
		this.x = newX;
		this.y = newY;
	};
	this.changeMin = function(newMin){
		this.min = newMin;
	};

	this.changeMax = function(newMax){
		this.max = newMax;
	};
};

function render(){
		//loop
		context.save();
		contextClear();

		generateTarget();
		generateNumber();
      	context.restore();
}

function keydown(e){
	//Checks what Keys were pressed
	switch (e.keyCode) {
		case 32: //Spacebar
			checkCollision();
			break;
		case 38: //Up key
			gameObjects.speed.setMultiplier(gameObjects.speed.multiplier + 1);
			gameObjects.speed.setTotalSpeed();
			break;
		case 40: //Down key
			gameObjects.speed.setMultiplier(gameObjects.speed.multiplier - 1);
			gameObjects.speed.setTotalSpeed();
			break;
	}
}

function contextClear(){
	context.clearRect(0,0,500,400);
}

function generateTarget(){
	//Creates random target number
	var x = canvas.width / 2;
	var y = canvas.height / 8;
	var number = Math.floor(Math.random() * (11 - 1)) + 1;
	context.font = "bold 32pt sans-serif";
	context.textAlign = "center";
	context.fillStyle = "gray";
	context.fillText(number, x, y);
}

function generateNumber(){
	//Creates random number
	var x = canvas.width / 2;
    var y = canvas.height / 2;
    var number = Math.floor(Math.random() * (11 - 1)) + 1;
    context.font = 'bold 56pt sans-serif';
    context.textAlign = 'center';
    context.fillStyle = 'black';
    context.fillText(number, x, y);
}

function adjustNumberSpeed(){
	var x = canvas.width /4;
	var y = canvas.height * 7 / 8;
	var number = 1;
}

function gameStore(){
	//Manages store that sells powerups
}

function checksCollision(){
	//Checks if the target number was hit and what happens afterwards
	if (gameObjects.target.num === gameObjects.match.num) {
		gameObjects.match.changeNum();
		gameObjects.score += 1;
	}

}

function inventory(){
	//Manages inventory of powerups bought
}