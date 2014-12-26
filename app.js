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
				if(game.playerOne.isInventoryRendered === true && game.playerOne.inventory.set[0] !== undefined){
					game.playerOne.useItem(0);
				} else if (game.playerOne.isStoreRendered === true){
					game.playerOne.buyItem(game.store, 0);
				}

			}
			break;
		case 50: //"2" key
			if(game.playerOne){
				if(game.playerOne.isInventoryRendered === true && game.playerOne.inventory.set[1] !== undefined){
					game.playerOne.useItem(1);
				} else if (game.playerOne.isStoreRendered === true){
					game.playerOne.buyItem(game.store, 1);
				}

			}
			break;
		case 51: //"3" key
			if(game.playerOne){
				if(game.playerOne.isInventoryRendered === true && game.playerOne.inventory.set[2] !== undefined){
					game.playerOne.useItem(2);
				} else if (game.playerOne.isStoreRendered === true){
					game.playerOne.buyItem(game.store, 2);
				}

			}
			break;
		case 52: //"4" key
			if(game.playerOne){
				if(game.playerOne.isInventoryRendered === true && game.playerOne.inventory.set[3] !== undefined){
					game.playerOne.useItem(3);
				} else if (game.playerOne.isStoreRendered === true){
					game.playerOne.buyItem(game.store, 3);
				}

			}
			break;
		case 53: //"5" key
			if(game.playerOne){
				if(game.playerOne.isInventoryRendered === true && game.playerOne.inventory.set[4] !== undefined){
					game.playerOne.useItem(4);
				} else if (game.playerOne.isStoreRendered === true){
					game.playerOne.buyItem(game.store, 4);
				}

			}
			break;
		case 54: //"6" key
			if(game.playerOne){
				if (game.playerOne.isStoreRendered === true){
					game.playerOne.buyItem(game.store, 5);
				}

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
		game.checksCollision(game.playerOne);
	}
}

function checkTouch(e){
	//this handles the touch events
	e.preventDefault();
	game.checksCollision(game.playerOne);
}

function Game(){
	this.toWin = 2;
	this.targetNumber = new NumGenerator(0, 10);
	this.store = new ItemStorage("Store [S]", 6);
	this.numOfPlayers = 0;
	this.players = [];
	this.playerOne = new Player("Bob", 0, 0, canvas.width, canvas.height);
	this.playerOneLastTime = 0;
}

Game.prototype.initialize = function(){
	this.store.set.push(generateRandomItem("special"));
	for (var i = 1; i < this.store.maxHold; i++){
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
	//Checks if the target number and the player's number match
	if (player.number.num === this.targetNumber.num) {
		player.money += player.speed.multiplier;
		this.targetNumber.changeNum();
	} else {
		player.updateWrong = true; //Lets the player know that they mismatched.
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

Game.prototype.reset = function(){

};

function Player(name, refXCor, refYCor, refXLength, refYLength){
	this.name = name;
	this.victoryPoints = 0; //Collect Victory Points for victory
	this.money = 0; //Money is used for buying items and victory points from the store. This can be earned by getting a match with the target number.
	this.speed = new Speed(); //Speed of which to generate a random number to match with the target number
	this.number = new NumGenerator(0, 10);//Number that is used to match with the target number.
	this.lastCallTime = 0; //Helps keep track of when a new number should be generated
	this.updateWrong = false; //Lets the program know if the lastWrongTime needs to be updated 
	this.lastWrongTime = 0;//Helps keep track of how long the pause should be for the mismatch
	this.inventory = new ItemStorage('Inventory [I]', 5);
	this.isInventoryRendered = true;//Tracks if the inventory is being rendered
	this.isStoreRendered = false;//Tracks if the store being rendered
	this.notification = new Notification();
	this.refXCor = refXCor;
	this.refYCor = refYCor;
	this.refXLength = refXLength;
	this.refYLength = refYLength;
}

Player.prototype.buyItem = function(store, itemNumber){
	if (this.inventory.set.length < this.inventory.maxHold && this.money >= store.set[itemNumber].price){
		this.inventory.set.push(store.set[itemNumber]); // Adds item to the inventory
		this.money -= store.set[itemNumber].price;
		this.notification.setNotify("You just bought item, " + store.set[itemNumber].name + ".", true);
		if(store.set[itemNumber].name !== "Increase Victory Points"){
			store.set.splice(itemNumber, 1);
			store.set.push(generateRandomItem("good"));
		}
	} else if (this.inventory.set.length < this.inventory.maxHold){
		this.notification.setNotify("You do not have enough money.", false);
	} else {
		this.notification.setNotify("You do not have space in your inventory.", false);
	}
};

Player.prototype.useItem = function(itemNumber){
	if(this.inventory.set[itemNumber].use){
		if(typeof this.inventory.set[itemNumber].use(this) === "string"){
			this.notification.setNotify(this.inventory.set[itemNumber].use(this), false);
		} else {
			if(this.inventory.set[itemNumber].name === "Increase Victory Points"){
				game.checksWin(this);
			}
			this.notification.setNotify("You just used item, " + this.inventory.set[itemNumber].name + " on " + this.inventory.set[itemNumber].target + ".", "true");
			this.inventory.set.splice(itemNumber, 1);
		}
	} else if(this.inventory.set[itemNumber].use === undefined){
		this.notification.setNotify("Cannot use item, " + this.inventory.set[itemNumber].name + ".", false);
	} else {
		console.log("some other problem, man");
	}
};

Player.prototype.render = function(store, targetNumber, currentTime){
	//Creates the environment
	context.lineWidth = 3;
	context.fillStyle = "black";
	context.strokeRect(this.refXCor + this.refXLength * 7 / 16 , this.refYCor + this.refYLength / 64, this.refXLength / 8, this.refXLength /8);

	//Render Target Number
	targetNumber.render(this.refXCor + this.refXLength / 2, this.refYCor + this.refYLength * 9 / 64, "bold 48pt sans-serif", "red");

	//Render Match Number
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
	this.notification.renderNotify(currentTime, this.refXCor, this.refYCor, this.refXLength, this.refYLength);

	//Render Inventory or Store
	this.inventory.render(this.isInventoryRendered, this.refXCor, this.refYCor, this.refXLength, this.refYLength);
	this.renderStore(store);
};

Player.prototype.generateRandomNumber = function (currentTime){
	if(this.updateWrong === true){
		this.lastWrongTime = currentTime;
		this.updateWrong = false;
	} else if ((currentTime - this.lastWrongTime) < 3000){
		// P-P-PAUSE
	} else if ((currentTime - this.lastCallTime) >= (1 / this.speed.totalSpeed * 1000)) {
		this.number.changeNum();
		this.lastCallTime = currentTime;
	}
};

Player.prototype.renderStore = function(store){
	store.render(this.isStoreRendered, this.refXCor, this.refYCor, this.refXLength, this.refYLength);
};

function Notification() {
	this.isNotify = false;//Tracks if the error/notification is being rendered
	this.notifyMessage = "";//Holds the error/notification message
	this.moodGood = false;//Shows if the error/notification message is a good or a bad one
	this.updateNotify = false; //Lets the program know if the lastNotifyCall time needs to be updated
	this.lastNotifyCall = 0;//Helps keep track of how long the error/notification message should be rendered
}

Notification.prototype.setNotify = function(message, moodGood){
	this.notifyMessage = message;
	this.moodGood = moodGood;
	this.isNotify = true;
	this.updateNotify = true;
};

Notification.prototype.renderNotify  = function(currentTime, refXCor, refYCor, refXLength, refYLength){
	if(this.isNotify === true){
		if(this.updateNotify === true){
			this.lastNotifyCall = currentTime;
			this.updateNotify = false;
		}

		if (currentTime - this.lastNotifyCall < 4000){
			if(this.moodGood === true){
				context.fillStyle = 'rgb(0,250,154)'; // mediumspringgreen  #00FA9A
			} else {
				context.fillStyle = 'rgb(250,0,96)'; // complimentary color to mediumspringgreen  #FA0060
			}
			context.fillRect(refXCor + refXLength / 2 - context.measureText(this.notifyMessage).width / 2, refYCor + refYLength * 13 / 16 - refXLength * 5 / 32, context.measureText(this.notifyMessage).width, refYLength * 3 / 64);

			context.font = "bold 12pt sans-serif";
			context.textAlign = "center";
			context.fillStyle = "black";
			context.fillText(this.notifyMessage, refXCor + refXLength / 2, refYCor + refYLength * 13 / 16 - refXLength / 8);
		} else {
			this.isNotify = false;
		}
	}

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


function Item(name, price, abbrev, target, color, type, use){
	//Defines what is an item
	this.name = name; //Name of the item
	this.price = price; //Price of the item, which is only relevant if the item is in the store
	this.abbrev = abbrev; //Abbreviaton of the item that will show on the canvas
	this.target = target; //Who you can use the item on
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

function generateRandomItem (type){
	//Generate either a bad or good item for either store or the game
	return (function(){
		var availableItems = {};
		availableItems.victoryPoints = new Item("Increase Victory Points", 1, "VP", "self", "yellow", "special", function(player){
											player.victoryPoints++;
											console.log("haha");});
		availableItems.decreaseBaseSpeed = new Item("Decrease Base Speed", 1, "BS-", "self", "blue", "good", function(player){
											if(player.speed.base > 1){
												player.speed.base--;
											} else {
												return "Base Speed cannot be reduced further.";
											}});
		availableItems.increaseBaseSpeed = new Item("Increase Base Speed", undefined, "BS+", "self", "orange", "bad");
		availableItems.decreaseTargetRange = new Item("Decrease Target Range", 1, "TR-", "self", "green", "good");
		availableItems.increaseTargetRange = new Item("Increase Target Range", 1, "TR+", "self", "pumpkin", "good");
		availableItems.decreaseMatchRange = new Item("Decrease Match Range", 1, "MR-", "self", "brown", "good");
		availableItems.increaseMatchRange = new Item("Increase Match Range", 1, "MR+", "self", "red", "good");

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
			selection.push("victoryPoints");
		} else if (type === "either"){
			selection = Object.keys(availableItems);
		}
		return availableItems[selection[Math.floor(Math.random() * selection.length)]];
	})();
}
