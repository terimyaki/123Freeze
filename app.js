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
	changeMultiplier: function(newMultiplier) {
		multiplier = newMultiplier;
	},
	changeBase: function(newBase) {
		base = newBase;
	},
	changeTotalSpeed: function() {
		totalSpeed = multiplier * base;
	}
};

function createGameObjects(){
	gameObjects.goal = new NumGenerator((canvas.width / 2),(canvas.height / 8), 1, 11, "bold 32pt sans-serif", "gray");
	gameObjects.match = new NumGenerator((canvas.width / 2),(canvas.height / 2), 1, 11, "bold 64pt sans-serif", "black");
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
}

function render(){
		//This is the Looping function
		
		//Creates the environment
		//context.fillRect();
		//context.clearRect();
		//context.strokeRect();
		context.save();
		contextClear();

		gameObjects.match.changeNum();

		//Render Target
		context.font = gameObjects.goal.font;
		context.textAlign = "center";
		context.fillStyle = gameObjects.goal.fillColor;
		context.fillText(gameObjects.goal.num, gameObjects.goal.x, gameObjects.goal.y);
		
		//Render Match
		context.font = gameObjects.match.font;
    	context.textAlign = "center";
    	context.fillStyle = gameObjects.match.fillColor;
    	context.fillText(gameObjects.match.num, gameObjects.match.x, gameObjects.match.y);

		//Render Multiplier
		context.font = "bold 16pt sans-serif";
		context.textAlign = "left";
		context.fillStyle = "blue";
		context.fillText("Multiplier: " + gameObjects.speed.multiplier + "x", canvas.width /16, canvas.height * 7 / 8);

		//Render Base Speed
		context.font = "bold 16pt sans-serif";
		context.textAlign = "left";
		context.fillStyle = "blue";
		context.fillText("Base Speed: " + gameObjects.speed.base, canvas.width/16, canvas.height * 15 / 16);

		//Render Score
		context.font = "bold 16pt sans-serif";
		context.textAlign = "right";
		context.fillStyle = "blue";
		context.fillText("Score: " + gameObjects.score, canvas.width * 15 / 16, canvas.height / 16);

		//Context Restore
      	context.restore();
}

function keydown(e){
	//Checks what Keys were pressed
	switch (e.keyCode) {
		case 32: //Spacebar
			checkCollision();
			break;
		case 38: //Up key
			gameObjects.speed.changeMultiplier(gameObjects.speed.multiplier + 1);
			gameObjects.speed.changeTotalSpeed();
			break;
		case 40: //Down key
			gameObjects.speed.changeMultiplier(gameObjects.speed.multiplier - 1);
			gameObjects.speed.changeTotalSpeed();
			break;
	}
}

function contextClear(){
	context.clearRect(0,0,canvas.width,canvas.height);
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
	if (gameObjects.goal.num === gameObjects.match.num) {
		gameObjects.match.changeNum();
		gameObjects.score += 1;
	}

}

function inventory(){
	//Manages inventory of powerups bought
}