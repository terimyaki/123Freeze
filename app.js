var canvas,context;
var gameObjects = {};

window.onload = function(){
	init();
};

window.addEventListener("keydown", checkKey, false);

function init() {
	canvas = document.getElementById('playArea');
	context = canvas.getContext('2d');
	createGameObjects();
	rIntervalId = setInterval(render, gameObjects.speed.getTotalSpeed());
}

gameObjects.speed = {
	multiplier: 1,
	base: 1,
	totalSpeed : 1000,
	changeMultiplier: function(newMultiplier) {
		this.multiplier = newMultiplier;
	},
	changeBase: function(newBase) {
		this.base = newBase;
	},
	changeTotalSpeed: function() {
		this.totalSpeed = this.base * 1000 / this.multiplier;
	},
	getTotalSpeed: function(){
		return this.totalSpeed;
	}
};

function setRenderSpeed(){
	clearInterval(rIntervalId);
	rIntervalId = setInterval(render, gameObjects.speed.getTotalSpeed());
}

function createGameObjects(){
	gameObjects.goal = new NumGenerator((canvas.width / 2),(canvas.height / 8), 0, 10, "bold 32pt sans-serif", "gray");
	gameObjects.match = new NumGenerator((canvas.width / 2),(canvas.height / 2), 0, 10, "bold 64pt sans-serif", "black");
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

		context.save();
		contextClear();

		gameObjects.match.changeNum();

		//Creates the environment
		context.lineWidth = 3;
		context.fillStyle = "black";
		context.strokeRect(canvas.width * 7 / 16 , canvas.height / 64, canvas.width / 8, canvas.width /8);

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

function checkKey(e){
	e.preventDefault();
	//Checks what Keys were pressed
	switch (e.keyCode) {
		case 32: //Spacebar
			checksCollision();
			break;
		case 38: //Up key
			if (gameObjects.speed.multiplier === -1){
				gameObjects.speed.multiplier = 1;
			} else {
				gameObjects.speed.changeMultiplier(gameObjects.speed.multiplier + 1);
			}
			gameObjects.speed.changeTotalSpeed();
			setRenderSpeed();
			break;
		case 40: //Down key
			if(gameObjects.speed.multiplier === 1){
				gameObjects.speed.multiplier = 1;
			} else {
				gameObjects.speed.changeMultiplier(gameObjects.speed.multiplier - 1);
			}
			gameObjects.speed.changeTotalSpeed();
			setRenderSpeed();
			break;
	}
}

function contextClear(){
	context.clearRect(0,0,canvas.width,canvas.height);
}

function gameStore(){
	//Manages store that sells powerups
}

function checksCollision(){
	//Checks if the target number was hit and what happens afterwards
	if (gameObjects.goal.num === gameObjects.match.num) {
		gameObjects.goal.changeNum();
		if ((gameObjects.score += gameObjects.speed.multiplier) < 0){
			gameObjects.score += 1;
		} else {
			gameObjects.score += gameObjects.speed.multiplier;
		}
	}
}

function inventory(){
	//Manages inventory of powerups bought
}