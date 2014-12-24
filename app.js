var canvas,context,game;

window.onload = function(){
	canvas = document.getElementById('playArea');
	context = canvas.getContext('2d');
	game = new Game();
	game.initialize();
	requestAnimFrame(game.render.bind(game));
};

window.addEventListener("keydown", checkKey, false);
window.addEventListener("click", checkMouse, false);
window.addEventListener("touchstart", checkTouch, false);

window.requestAnimFrame = function(){
	return ( window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback){
				window.setTimeout(callback, 1000 / 60);
			}
	);
}();

function checkKey(e){
	e.preventDefault();
	//Checks what Keys were pressed 
	switch (e.keyCode) {
		case 32: //Spacebar
			game.checksCollision(game.playerOne);
			break;
		case 38: //Up key
			if (game.playerOne.speed.multiplier === -1){
				game.playerOne.speed.multiplier = 1;
			} else {
				game.playerOne.speed.changeMultiplier(game.playerOne.speed.multiplier + 1);
			}
			game.playerOne.speed.changeTotalSpeed();
			break;
		case 40: //Down key
			if(game.playerOne.speed.multiplier === 1){
				game.playerOne.speed.multiplier = 1;
			} else {
				game.playerOne.speed.changeMultiplier(game.playerOne.speed.multiplier - 1);
			}
			game.playerOne.speed.changeTotalSpeed();
			break;
		case 73: //"i" key
			if (game.playerOne.isStoreRendered === true){
				game.playerOne.isStoreRendered = false;
				game.store.clearRender();
				game.playerOne.isInventoryRendered = true;
			} else {
				game.playerOne.isInventoryRendered  = true;
			}
			break;
		case 83: //"s" key
			if (game.playerOne.isInventoryRendered  === true){
				game.playerOne.isInventoryRendered  = false;
				game.playerOne.inventory.clearRender();
				game.playerOne.isStoreRendered = true;
			} else {
				game.playerOne.isStoreRendered = true;
			}
			break;
		case 49: //"1" key
			if(game.playerOne){

			}
			break;
		case 50: //"2" key
			break;
		case 51: //"3" key
			break;
		case 52: //"4" key
			break;
		case 53: //"5" key
			break;
		case 54: //"6" key
			break;
		}
}

function checkMouse(e){
	//This handles the click events
	e.preventDefault();
	e = e || window.event;
	var button = e.which || e.button;
	if (button == 1) { //Checks if it is a left mouse button click
		game.checksCollision(game.playerOne);
	}
}

function checkTouch(e){
	//this handles the touch events
	e.preventDefault();
	game.checksCollision(game.playerOne);
}

function Game(){
	this.toWin = 10;
	this.targetNumber = new NumGenerator(0, 10);
	this.store = new ItemStorage("Store [S]", 6);
	this.playerOne = new Player("Bob", 0, 0, canvas.width, canvas.height);
	this.playerOneLastTime = 0;
}

Game.prototype.initialize = function(){
	for (var i = 0; i < this.store.maxHold; i++){
		this.store.set.push(generateRandomItem("good"));
	}
};

Game.prototype.checksWin = function(player){
	//Checks if the victory points of the player matches the goal
	if(player.victoryPoints === this.toWin){
		alert(player.name + " has won the game");
		this.initialize();
	}
};

Game.prototype.checksCollision = function(player){
	//Checks if the target number was hit and what happens afterwards
	if (player.number.num === this.targetNumber.num) {
		player.money += player.speed.multiplier;
		this.targetNumber.changeNum();
	} else {
		//Pause the generating of random numbers
	}
};

Game.prototype.render = function(currentTime){
	//This is the Looping function that renders the game
	context.save();
	context.clearRect(0,0,canvas.width,canvas.height);
	
	this.playerOne.render(this.store, this.targetNumber, currentTime);
	this.playerOne.generateRandomNumber(currentTime);

	//Context Restore
    context.restore();

	requestAnimFrame(this.render.bind(this));
};

function Player(name, refXCor, refYCor, refXLength, refYLength){
	this.name = name;
	this.victoryPoints = 0;
	this.money = 0;
	this.speed = new Speed();
	this.number = new NumGenerator(0, 10);
	this.lastCallTime = 0;
	this.inventory = new ItemStorage('Inventory [I]', 5);
	this.isInventoryRendered = true;
	this.isStoreRendered = false;
	this.isNotify = false;
	this.notifyMessage = "";
	this.moodGood = false;
	this.updateNotify = false;
	this.lastNotifyCall = 0;
	this.isError = false;
	this.lastErrorCall = 0;
	this.refXCor = refXCor;
	this.refYCor = refYCor;
	this.refXLength = refXLength;
	this.refYLength = refYLength;
}

Player.prototype.buyItem = function(store, itemNumber){
	if (this.inventory.set.length < this.inventory.maxHold && this.money >= store.set[itemNumber - 1]){
		this.inventory.set.push(store.set[itemNumber - 1]); // Adds item to the inventory
		this.money -= store.set[itemNumber - 1].price;
		store.set.splice(itemNumber - 1, 1);
		store.push(generateRandomItem("good"));
	}
};

Player.prototype.useItem = function(itemNumber){
	if(this.inventory.set[itemNumber - 1] === "undefined"){
		this.setNotify("There is nothing in that slot.", false);
		return false;
	} else if(typeof this.inventory.set[itemNumber - 1].use(this) === "string"){
		this.setNotify(this.inventory.set[itemNumber - 1].use(this), false);
		return false;
	} else {
		this.inventory.set[itemNumber - 1].user(this); //call the specific item's use function
	}
};

Player.prototype.render = function(store, targetNumber, currentTime){
	//Creates the environment
	context.lineWidth = 3;
	context.fillStyle = "black";
	context.strokeRect(this.refXCor + this.refXLength * 7 / 16 , this.refYCor + this.refYLength / 64, this.refXLength / 8, this.refXLength /8);

	//Render Target Number
	targetNumber.render(this.refXCor + this.refXLength / 2, this.refYCor + this.refYLength * 9 / 64, "bold 48pt sans-serif", "red");

	//Render Match MNumber
	this.number.render(this.refXCor + (this.refXLength / 2), this.refYCor + (this.refYLength / 2), "bold 64pt sans-serif", "black");

	//Render Multiplier
	context.font = "bold 16pt sans-serif";
	context.textAlign = "left";
	context.fillStyle = "blue";
	context.fillText("Multiplier: " + this.speed.multiplier + "x", this.refXCor + (this.refXLength / 16), this.refYCor + (this.refYLength / 16));

	//Render Base Speed
	context.font = "bold 16pt sans-serif";
	context.textAlign = "left";
	context.fillStyle = "blue";
	context.fillText("Base Speed: " + this.speed.base, this.refXCor + (this.refXLength / 16), this.refYCor + (this.refYLength * 2 / 16));

	//Render Money
	context.font = "bold 16pt sans-serif";
	context.textAlign = "right";
	context.fillStyle = "blue";
	context.fillText("Money: " + this.money, this.refXCor + (this.refXLength * 15 / 16), this.refYCor + (this.refYLength * 2 / 16));

	//Render Victory Points
	context.font = "bold 16pt sans-serif";
	context.textAlign = "right";
	context.fillStyle = "purple";
	context.fillText("Victory Points: " + this.victoryPoints, this.refXCor + (this.refXLength * 15 / 16), this.refYCor + (this.refYLength / 16));

	//Render any Error Messages
	this.renderNotify(currentTime);

	//Render Inventory or Store
	this.inventory.render(this.isInventoryRendered, this.refXCor, this.refYCor, this.refXLength, this.refYLength);
	this.renderStore(store);
};

Player.prototype.generateRandomNumber = function (currentTime){
	if ((currentTime - this.lastCallTime) >= (1 / this.speed.totalSpeed * 1000)) {
		this.number.changeNum();
		this.lastCallTime = currentTime;
	}
};

Player.prototype.renderStore = function(store){
	store.render(this.isStoreRendered, this.refXCor, this.refYCor, this.refXLength, this.refYLength);
};

Player.prototype.renderNotify  = function(currentTime){
	if(this.isNotify === true){
		if(this.updateNotify === true){
			this.lastNotifyCall = currentTime;
		}

		if (currentTime - this.lastNotifyCall < 5000){
			if(this.moodGood === true){
				context.fillStyle = 'rgb(0,250,154)'; // mediumspringgreen  #00FA9A
			} else {
				context.fillStyle = 'rgb(250,0,96)'; // complimentary color to mediumspringgreen  #FA0060
			}
			context.fillRect(this.refXCor + this.refXLength / 2 - context.measureText(this.notifyMessage).width / 2, this.refYCor + this.refYLength * 13 / 16 - this.refXLength / 8, context.measureText(this.notifyMessage).width, this.refYLength / 8);

			context.font = "bold 8pt sans-serif";
			context.textAlign = "center";
			context.fillStyle = "black";
			context.fillText(this.notifyMessage, this.refXCor + this.refXLength / 2, this.refYCor + this.refYLength * 13 / 16 - this.refXLength / 8);
		}
	}

};

Player.prototype.setNotify = function(message, moodGood){
	this.notifyMessage = message;
	this.moodGood = moodGood;
	this.isNotify = true;
	this.updateNotify = true;
}

Player.prototype.renderError  = function(message, refXCor, refYCor){

	context.font = "bold 8pt sans-serif";
	context.textAlign = "center";
	context.fillStyle = "red";
	context.fillText(message, this.refXCor, this.refYCor);
};

function Speed() {
	this.multiplier = 1;
	this.base = 1;
	this.totalSpeed = 1;
}

Speed.prototype.changeMultiplier = function(newMultiplier) {
		this.multiplier = newMultiplier;
};

Speed.prototype.changeBase = function(newBase) {
		this.base = newBase;
};

Speed.prototype.changeTotalSpeed = function() {
		this.totalSpeed = this.multiplier * this.base;
};

Speed.prototype.getTotalSpeed = function(){
		return this.totalSpeed;
};

function NumGenerator (min, max) {
	this.min = min;
	this.max = max;
	this.num = Math.floor(Math.random() * (max - min)) + min;
}

NumGenerator.prototype.changeNum = function(){
		this.num = Math.floor(Math.random() * (this.max - this.min)) + this.min;
};

NumGenerator.prototype.changeColor = function(newColor) {
		this.fillColor = newColor;
};

NumGenerator.prototype.changeMin = function(newMin){
		this.min = newMin;
};

NumGenerator.prototype.changeMax = function(newMax){
		this.max = newMax;
};

NumGenerator.prototype.render = function(refXCor, refYCor, font, fillColor){

	//Render Target
	context.font = font;
	context.textAlign = "center";
	context.fillStyle = fillColor;
	context.fillText(this.num, refXCor, refYCor);
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

function ItemStorage(name, maxHold){
	//Defines what is an item storage object
	this.name = name; //Name of the storage
	this.maxHold = maxHold; //Maximum Size of the storage
	this.set = []; //What is currently in the storage
}

ItemStorage.prototype.render = function(isRender, refXCor, refYCor, refXLength, refYLength) {
		//Rendering of the skeleton of the storage
		var sideLength = refXLength / 8;
		var xCor = refXCor + (refXLength - sideLength * this.maxHold) / 2;
		var yCor = refYCor + refYLength * 15 / 16 - sideLength;

		if(isRender){
			//Renders the name of the visible Storage
			context.font = "bold 12pt sans-serif";
			context.textAlign = "left";
			context.fillStyle = "black";
			context.fillText(this.name, xCor, yCor - canvas.height / 32);

			for (i = 0; i < this.maxHold; i++){
				context.lineWidth = 1;
				context.fillStyle = "black";
				context.strokeRect(xCor , yCor, sideLength, sideLength);

				context.font = "bold 8pt sans-serif";
				context.textAlign = "center";
				context.fillStyle = "grey";
				context.fillText(i + 1, xCor + sideLength / 2, yCor + sideLength + canvas.height / 32);

				if (this.set[i] === undefined){
					context.fillStyle = 'rgb(220,220,220)';
					context.fillRect(xCor, yCor, sideLength, sideLength);

					context.font = "bold 8pt sans-serif";
					context.textAlign = "center";
					context.fillStyle = "black";
					context.fillText("no item", xCor + sideLength / 2, yCor + sideLength / 2);
				} else {
					this.set[i].render(xCor, yCor, sideLength);
				}

				xCor += sideLength;
			}
		} else {
			//Renders the name of the non-visible Storage
			context.font = "bold 12pt sans-serif";
			context.textAlign = "left";
			context.fillStyle = "gray";
			context.fillText(this.name, xCor + sideLength * this.maxHold / 2, yCor - canvas.height / 32);
		}

};

ItemStorage.prototype.clearRender = function(refXCor, refYCor, refXLength, refYLength) {
		//Clears the rendering of the skeleton of the storage
		var sideLength = refXLength / 8;
		var xCor = refXCor + (refXLength - sideLength * this.maxHold) / 2;
		var yCor = refYCor + refYLength * 15 / 16 - sideLength;

		context.clearRect(xCor, yCor, sideLength * this.maxHold, sideLength);
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
		availableItems.victoryPoints = new Item("Victory Points", 20, "VP", "yellow", "special", function(player){player.victoryPoints++});
		availableItems.decreaseBaseSpeed = new Item("Decrease Base Speed", 30, "BS-", "blue", "good", function(player){
											if(player.speed.base > 1){
												player.speed.base--;
											} else{
												return "Base Speed cannot be reduced further.";
											}});
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
		} else if (type === "special"){
			selection = selection.push("victoryPoints");
		} else if (type === "either"){
			selection = Object.keys(availableItems);
		}
		return availableItems[selection[Math.floor(Math.random() * selection.length)]];
	})();
}
