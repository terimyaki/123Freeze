var canvas,context;
var gameObjects = {};

window.onload = function(){
	canvas = document.getElementById('playArea');
	context = canvas.getContext('2d');
	initialize();
	loop();
};

window.addEventListener("keydown", checkKey, false);
window.addEventListener("click", checkMouse, false);
window.addEventListener("touchstart", checkTouch, false);

function loop() {
	rIntervalId = setInterval(render, gameObjects.speed.getTotalSpeed());
}

function setRenderSpeed(){
	clearInterval(rIntervalId);
	rIntervalId = setInterval(render, gameObjects.speed.getTotalSpeed());
}

function initialize(){
	// Creates all the game objects that will be used.
	gameObjects.goal = new NumGenerator((canvas.width / 2),(canvas.height / 8), 0, 10, "bold 32pt sans-serif", "#696969");
	gameObjects.match = new NumGenerator((canvas.width / 2),(canvas.height / 2), 0, 10, "bold 64pt sans-serif", "black");
	gameObjects.speed = new Speed();
	gameObjects.inventory = new ItemStorage('Inventory [I]', 5, 0, 0, canvas.width, canvas.height);
	gameObjects.inventory.isRender = true;
	gameObjects.victoryPoints = 0;
	gameObjects.money = 0;
	gameObjects.store = new ItemStorage("Store [S]", 6, 0, 0, canvas.width, canvas.height);
	for (i=0; i < gameObjects.store.maxHold; i++){
		gameObjects.store.addItem(generateRandomItem("good"));
	}

}

function render(){
		//This is the Looping function that renders the game

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
		context.fillText("Multiplier: " + gameObjects.speed.multiplier + "x", canvas.width /16, canvas.height / 16);

		//Render Base Speed
		context.font = "bold 16pt sans-serif";
		context.textAlign = "left";
		context.fillStyle = "blue";
		context.fillText("Base Speed: " + gameObjects.speed.base, canvas.width/16, canvas.height * 2 / 16);

		//Render Money
		context.font = "bold 16pt sans-serif";
		context.textAlign = "right";
		context.fillStyle = "blue";
		context.fillText("Money: " + gameObjects.money, canvas.width * 15 / 16, canvas.height * 2 / 16);

		//Render Victory Points
		context.font = "bold 16pt sans-serif";
		context.textAlign = "right";
		context.fillStyle = "purple";
		context.fillText("Victory Points: " + gameObjects.victoryPoints, canvas.width * 15 / 16, canvas.height / 16);

		//Render Inventory
		gameObjects.inventory.render();
		gameObjects.store.render();

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
		case 73: //"i" key
			if (gameObjects.store.isRender === true){
				gameObjects.store.isRender = false;
				gameObjects.store.clearRender();
				gameObjects.inventory.isRender = true;
			} else {
				gameObjects.inventory.isRender = true;
			}
			break;
		case 83: //"s" key
			if (gameObjects.inventory.isRender === true){
				gameObjects.inventory.isRender = false;
				gameObjects.inventory.clearRender();
				gameObjects.store.isRender = true;
			} else {
				gameObjects.store.isRender = true;
			}
			break;
	}
}

function checkMouse(e){
	//This handles the click events
	e.preventDefault();
	e = e || window.event;
	var button = e.which || e.button;
	if (button == 1) { //Checks if it is a left mouse button click
		checksCollision();
	}
}

function checkTouch(e){
	//this handles the touch events
	e.preventDefault();
	checksCollision();
}

function contextClear(){
	context.clearRect(0,0,canvas.width,canvas.height);
}

function checksCollision(){
	//Checks if the target number was hit and what happens afterwards
	if (gameObjects.goal.num === gameObjects.match.num) {
		gameObjects.money += gameObjects.speed.multiplier;
		gameObjects.goal.changeNum();
	}
}

function Game(){
	this.toWin = 10;
	this.targetNumber = new NumGenerator((canvas.width / 2),(canvas.height / 2), 0, 10, "bold 64pt sans-serif", "black");
	this.store = new ItemStorage("Store [S]", 6, 0, 0, canvas.width, canvas.height);
	this.playerList = {};
}

Game.prototype.initialize = function(){

};

Game.prototype.checksWin = function(player){
	//Checks if the victory points of the player matches the goal
	if(player.victoryPoints === this.toWin){
		alert(player.name + " has won the game");
		this.initialize();
	}
};

Game.prototype.render = function(){

};

function Player(name, refXCor, refYCor, refXLength, refYLength){
	this.name = name;
	this.victoryPoints = 0;
	this.money = 0;
	this.speed = new Speed();
	this.inventory = new ItemStorage("Inventory", 5);
	this.refXCor = refXCor;
	this.refYCor = refYCor;
	this.refXLength = refXLength;
	this.refYLength = refYLength;
}

Player.prototype.buyItem = function(store, itemNumber){
	if (this.inventory.set.length < this.inventory.maxHold){
		this.inventory.set.push(store.set[itemNumber]); // Adds item to the inventory
	} else {

	}
};

Player.prototype.useItem = function(itemNumber){
	this.inventory.set[itemNumber].use(); //call the specific item's use function
};

Player.prototype.render = function(){

};

function Speed() {
	this.multiplier = 1;
	this.base = 10;
	this.totalSpeed = 1000;
}

Speed.prototype.changeMultiplier = function(newMultiplier) {
		this.multiplier = newMultiplier;
};

Speed.prototype.changeBase = function(newBase) {
		this.base = newBase;
};

Speed.prototype.changeTotalSpeed = function() {
		this.totalSpeed = 1000 - this.multiplier * (10 + this.base);
};

Speed.prototype.getTotalSpeed = function(){
		return this.totalSpeed;
};

function NumGenerator (refXCor, refYCor, min, max, font, fillColor) {
	this.x = refXCor;
	this.y = refYCor;
	this.min = min;
	this.max = max;
	this.num = Math.floor(Math.random() * (max - min)) + min;
	this.font = font;
	this.fillColor = fillColor;
}

NumGenerator.prototype.changeNum = function(){
		this.num = Math.floor(Math.random() * (this.max - this.min)) + this.min;
};

NumGenerator.prototype.changeColor = function(newColor) {
		this.fillColor = newColor;
};

NumGenerator.prototype.changeXY = function(newX, newY){
		this.x = newX;
		this.y = newY;
};

NumGenerator.prototype.changeMin = function(newMin){
		this.min = newMin;
};

NumGenerator.prototype.changeMax = function(newMax){
		this.max = newMax;
};


function Item(name, price, abbrev, color, type, use){
	//Defines what is an item
	this.name = name; //Name of the item
	this.price = price; //Price of the item, which is only relevant if the item is in the store
	this.abbrev = abbrev; //Abbreviaton of the item that will show on the canvas
	this.color = color; //The unique color that signifies what item that is current being viewed
	this.type = type; //Indicates whether this will help the player or hurt the player's chances
	this.use = use; //This will be a function that will be executed when the item is used
}

Item.prototype.render = function(xCor, yCor, sideLength){
		context.fillStyle = this.color;
		context.textAlign = "center";
		context.fillRect(xCor, yCor, sideLength, sideLength);

		context.font = "bold 12pt sans-serif";
		context.textAlign = "center";
		context.fillStyle = "black";
		context.fillText(this.abbrev, xCor + sideLength / 2, yCor + sideLength / 2);
};

Item.prototype.renderPrice = function(startXCor, startYCor, sideLength){
		context.font = "8pt sans-serif";
		context.textAlign = "center";
		context.fillStyle (this.price, xCor + sideLength / 2, yCor + sideLength * 5 / 8);
};

function ItemStorage(name, maxHold, refXCor, refYCor, refXLength, refYLength){
	//Defines what is an item storage object
	this.name = name; //Name of the storage
	this.maxHold = maxHold; //Maximum Size of the storage
	this.set = []; //What is currently in the storage
	this.isRender = false; //Boolean of if the storage is currently being rendered on the canvas
	this.sideLength = refXLength / 8;
	this.xCor = refXCor + (refXLength - this.sideLength * this.maxHold) / 2;
	this.yCor = refYCor + refYLength * 15 / 16 - this.sideLength;

}

ItemStorage.prototype.render = function() {
		//Rendering of the skeleton of the storage
		var xCor = this.xCor;
		var yCor = this.yCor;


		if(this.isRender === true){
			//Renders the name of the visible Storage
			context.font = "bold 12pt sans-serif";
			context.textAlign = "left";
			context.fillStyle = "black";
			context.fillText(this.name, this.xCor, this.yCor - canvas.height / 32);

			for (i = 0; i < this.maxHold; i++){
				context.lineWidth = 1;
				context.fillStyle = "black";
				context.strokeRect(xCor , yCor, this.sideLength, this.sideLength);

				context.font = "bold 8pt sans-serif";
				context.textAlign = "center";
				context.fillStyle = "grey";
				context.fillText(i + 1, xCor + this.sideLength / 2, yCor + this.sideLength + canvas.height / 32);

				if (this.set[i] === undefined){
					context.fillStyle = 'rgb(220,220,220)';
					context.fillRect(xCor, yCor, this.sideLength, this.sideLength);

					context.font = "bold 8pt sans-serif";
					context.textAlign = "center";
					context.fillStyle = "black";
					context.fillText("no item", xCor + this.sideLength / 2, yCor + this.sideLength / 2);
				} else {
					this.set[i].render(xCor, yCor, this.sideLength);
				}

				xCor += this.sideLength;
			}
		} else {
			//Renders the name of the non-visible Storage
			context.font = "bold 12pt sans-serif";
			context.textAlign = "left";
			context.fillStyle = "gray";
			context.fillText(this.name, this.xCor + this.sideLength * this.maxHold / 2, this.yCor - canvas.height / 32);
		}

};

ItemStorage.prototype.clearRender = function() {
		//Clears the rendering of the skeleton of the storage

		context.clearRect(this.xCor, this.yCor, this.sideLength * this.maxHold, this.sideLength);
};

ItemStorage.prototype.lessItem = function(itemNumber) {
		//Removes an item from the set
		if (this.set.length === 0){
			alert("you don't have any item.");
		} else if (itemNumber < this.set.length) {
			this.set.splice(itemNumber, 1);
		}
};

ItemStorage.prototype.addItem = function(item) {
		//Adds an item to the set
		if (this.set.length === this.maxHold) {
			alert("you have don't have any room.");
		} else {
			this.set.push(item);
	}
};

function generateRandomItem (type){
	//Generate either a bad or good item for either store or the game
	return (function(){

		var availableItems = {};
		availableItems.victoryPoints = new Item("Victory Points", 20, "VP", "yellow", "good", function(player){player.victoryPoints++});
		availableItems.decreaseBaseSpeed = new Item("Decrease Base Speed", 30, "BS-", "blue", "good");
		availableItems.increaseBaseSpeed = new Item("Increase Base Speed", undefined, "BS+", "orange", "bad");
		availableItems.decreaseTargetRange = new Item("Decrease Target Range", 10, "TR-", "green", "good");
		availableItems.increaseTargetRange = new Item("Increase Target Range", undefined, "TR+", "pumpkin", "bad");

		var selection = [];

		if (type === "good"){
			for (var i = 0; i < Object.keys(availableItems).length; i++){
				if (availableItems[Object.keys(availableItems)[i]].type === "good") {
					selection.push(Object.keys(availableItems)[i]);
				}
			}
		} else if (type === "bad"){
			for (var i = 0; i < Object.keys(availableItems).length; i++){
				if (availableItems[Object.keys(availableItems)[i]].type === "bad") {
					selection.push(Object.keys(availableItems)[i]);
				}
			}
		} else if (type === "either"){
			selection = Object.keys(availableItems);
		}
		//var selection = Object.keys(availableItems);
		return availableItems[selection[Math.floor(Math.random() * selection.length)]];
	})();
}


/*Store.prototype = new ItemStorage("Store", 6);

Store.prototype.initialize = function(){
	var availableItems = {};
	availableItems.victoryPoints = new Item("Victory Points", 20, "VP", "yellow");
	availableItems.changeColor = new Item("Change Color", 10, "CC", "orange");
	for (i=0; i < this.maxHold; i++){
		this.stock();
	}
};

Store.prototype.stock = function(){
	if (Store.set.length < Store.maxHold){
		this.addItem(Object.keys(this.availableItems)[Math.floor(Math.random() * Object.keys(this.availableItems).length)]);
	}
};

Store.prototype.render = function(){
		//Rendering of the skeleton of the storage
		var startYCor = canvas.height * 15 / 16 - this.sideLength;
		var startXCor = (canvas.width - this.sideLength * this.maxHold) / 2;

		context.font = "bold 12pt sans-serif";
		context.textAlign = "left";
		context.fillStyle = "black";
		context.fillText(this.name, startXCor, startYCor - canvas.height / 32);

		for (i = 0; i < this.maxHold; i++){
			context.lineWidth = 1;
			context.fillStyle = "black";
			context.textAlign = "center";
			context.strokeRect(startXCor , startYCor, this.sideLength, this.sideLength);

			context.font = "bold 8pt sans-serif";
			context.textAlign = "center";
			context.fillStyle = "grey";
			context.fillText(i + 1, startXCor + this.sideLength / 2, startYCor + this.sideLength + canvas.height / 32);

			if (this.set[i] === undefined){
				context.fillStyle = 'rgb(220,220,220)';
				context.fillRect(startXCor, startYCor, this.sideLength, this.sideLength);

				context.font = "bold 8pt sans-serif";
				context.textAlign = "center";
				context.fillStyle = "black";
				context.fillText("no item", startXCor + this.sideLength / 2, startYCor + this.sideLength / 2);
			} else {
				this.availableItems[this.set[i]].render(startXCor, startYCor, this.sideLength);
				this.availableItems[this.set[i]].renderPrice(startXCor, startYCor, this.sideLength);
			}

			startXCor += this.sideLength;
		}
};*/
