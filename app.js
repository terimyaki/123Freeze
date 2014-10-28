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
	rIntervalId = setInterval(render, gameObjects.player.speed.getTotalSpeed());
}

function Player(name){
	this.name = name;
	this.speed = new Speed();
	this.inventory = new ItemStorage(5);
}

function Speed() {
	this.multiplier = 1;
	this.base = 1;
	this.totalSpeed = 500;
	this.changeMultiplier = function(newMultiplier) {
		this.multiplier = newMultiplier;
	};
	this.changeBase = function(newBase) {
		this.base = newBase;
	};
	this.changeTotalSpeed = function() {
		this.totalSpeed = this.base * 500 / this.multiplier;
	};
	this.getTotalSpeed = function(){
		return this.totalSpeed;
	};
}

gameObjects.player.inventory = {

};

gameObjects.availability = {
};

gameObjects.store = {

};

function setRenderSpeed(){
	clearInterval(rIntervalId);
	rIntervalId = setInterval(render, gameObjects.player.speed.getTotalSpeed());
}

function createGameObjects(){
	gameObjects.goal = new NumGenerator((canvas.width / 2),(canvas.height / 8), 0, 10, "bold 32pt sans-serif", "#696969");
	gameObjects.player.match = new NumGenerator((canvas.width / 2),(canvas.height / 2), 0, 10, "bold 64pt sans-serif", "black");
	gameObjects.player.victoryPoints = 0;
	gameObjects.player.money = 0;
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

function Item(name, price, abbrev){
	this.name = name;
	this.price = price;
	this.abbrev = abbrev;
}

function ItemStorage(maxHold){
	this.maxHold = maxHold;

	this.lessItem = function() {
	};
	this.addItem = function() {

	};
}

function render(){
		//This is the Looping function

		context.save();
		contextClear();

		gameObjects.player.match.changeNum();

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
		context.font = gameObjects.player.match.font;
    	context.textAlign = "center";
    	context.fillStyle = gameObjects.player.match.fillColor;
    	context.fillText(gameObjects.player.match.num, gameObjects.player.match.x, gameObjects.player.match.y);

		//Render Multiplier
		context.font = "bold 16pt sans-serif";
		context.textAlign = "left";
		context.fillStyle = "blue";
		context.fillText("Multiplier: " + gameObjects.player.speed.multiplier + "x", canvas.width /16, canvas.height * 29 / 32);

		//Render Base Speed
		context.font = "bold 16pt sans-serif";
		context.textAlign = "left";
		context.fillStyle = "blue";
		context.fillText("Base Speed: " + gameObjects.player.speed.base, canvas.width/16, canvas.height * 31 / 32);

		//Render Money
		context.font = "bold 16pt sans-serif";
		context.textAlign = "right";
		context.fillStyle = "blue";
		context.fillText("Money: " + gameObjects.player.money, canvas.width * 15 / 16, canvas.height * 2 / 16);

		//Render Victory Points
		context.font = "bold 16pt sans-serif";
		context.textAlign = "right";
		context.fillStyle = "purple";
		context.fillText("Victory Points: " + gameObjects.player.victoryPoints, canvas.width * 15 / 16, canvas.height / 16);

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
			if (gameObjects.player.speed.multiplier === -1){
				gameObjects.player.speed.multiplier = 1;
			} else {
				gameObjects.player.speed.changeMultiplier(gameObjects.player.speed.multiplier + 1);
			}
			gameObjects.player.speed.changeTotalSpeed();
			setRenderSpeed();
			break;
		case 40: //Down key
			if(gameObjects.player.speed.multiplier === 1){
				gameObjects.player.speed.multiplier = 1;
			} else {
				gameObjects.player.speed.changeMultiplier(gameObjects.player.speed.multiplier - 1);
			}
			gameObjects.player.speed.changeTotalSpeed();
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
	if (gameObjects.goal.num === gameObjects.player.match.num) {
		gameObjects.player.money += gameObjects.player.speed.multiplier;
		gameObjects.goal.changeNum();
	}
}

function inventory(){
	//Manages inventory of powerups bought
}