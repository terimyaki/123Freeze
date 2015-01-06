var canvas,context,game;

window.onload = function(){
	canvas = document.getElementById('playArea');
	context = canvas.getContext('2d');
	game = new Game();
	game.initialize();
};

window.addEventListener("keydown", checkKey, false);
//window.addEventListener("click", checkMouse, false);
//window.addEventListener("touchstart", checkTouch, false);

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
	var playerOne = game.players[0];
	var playerTwo = game.players[1];
	e.preventDefault();
	//Checks what Keys were pressed 
	if(game.isStartScreen){
		switch (e.keyCode) {
			case 13: // Enter Key
				if(game.startButton.isHighlighted === true){
					game.isPlayerScreen = true;
					game.okButton.name = "Play Game";
					game.okButton.isHighlighted = false;
					delete game.startButton;
					delete game.aboutButton;
					game.onePlayerButton = new Button("Single Player Mode", true);
					game.twoPlayerButton = new Button("Two Player Mode", false);
					game.isStartScreen = false;
				} else {
					game.isAboutScreen = true;
					game.okButton.name = "Back to Start Screen";
					game.okButton.isHighlighted = true;
					game.isStartScreen = false;
				}
				break;
			case 38: // Up Key
				if (game.aboutButton.isHighlighted === true){
					game.startButton.isHighlighted = true;
					game.aboutButton.isHighlighted = false;
				}
				break;
			case 40: // Down Key
				if (game.startButton.isHighlighted === true){
					game.aboutButton.isHighlighted = true;
					game.startButton.isHighlighted = false;
				}
				break;
		}
	} else if (game.isAboutScreen){
		if (e.keyCode === 13){ // Enter Key
			game.isStartScreen = true;
			game.isAboutScreen = false;
		}

	} else if(game.isPlayerScreen){
		if(game.numOfPlayers === 0){
			switch(e.keyCode){
				case 13:// Enter Key
					game.nameInput = new InputField("Enter Player Name", true);
					game.matchKey = new InputField("Match Key", false);
					game.upSpeedKey = new InputField("Increase Speed", false);
					game.downSpeedKey = new InputField("Decrease Speed", false);
					game.helpKey = new InputField("Help/Info", false);
					game.inventoryKey = new InputField("Inventory", false);
					game.storeKey = new InputField("Store", false);
					game.slotOne = new InputField("Slot 1", false);
					game.slotTwo = new InputField("Slot 2", false);
					game.slotThree = new InputField("Slot 3", false);
					game.slotFour = new InputField("Slot 4", false);
					game.slotFive = new InputField("Slot 5", false);
					game.slotSix = new InputField("Slot 6", false);
					game.tempValue = "";
					game.matchValue = 0;
					game.upSpeedValue = 0;
					game.helpValue = 0;
					game.inventoryValue = 0;
					game.storeValue = 0;
					game.slotOneValue = 0;
					game.slotTwoValue = 0;
					game.slotThreeValue = 0;
					game.slotFourValue = 0;
					game.slotFiveValue = 0;
					game.slotSixValue = 0;
					game.nameName = "";
					game.matchName = "";
					game.upSpeedName = "";
					game.helpName = "";
					game.inventoryName = "";
					game.storeName = "";
					game.slotOneName = "";
					game.slotTwoName = "";
					game.slotThreeName = "";
					game.slotFourName = "";
					game.slotFiveName = "";
					game.slotSixName = "";
					if(game.twoPlayerButton.isHighlighted === true){
						game.numOfPlayers = 2;
						game.twoPlayerButton.isHighlighted = false;
						game.twoPlayerButton.isInactive = true;
					} else {
						game.numOfPlayers = 1;
						game.onePlayerButton.isHighlighted = false;
						game.onePlayerButton.isInactive = true;
					}
					break;
				case 37: // Left Arrow
					if(game.twoPlayerButton.isHighlighted === true){
						game.onePlayerButton.isHighlighted = true;
						game.twoPlayerButton.isHighlighted = false;
					}
					break;
				case 39: //Right Arrow
					if(game.onePlayerButton.isHighlighted === true){
						game.twoPlayerButton.isHighlighted = true;
						game.onePlayerButton.isHighlighted = false;
					}
					break;
			}
		} else if(game.players.length === game.numOfPlayers){
			if (e.keyCode === 13){ // Enter Key
				if(game.numOfPlayers === 2){
					canvas.width = 1400;
				}
				game.isGameScreen = true;
				game.isPlayersScreen = false;
		} else if(game.players.length === 0){

		} else if(game.players.length === 1){

		}
	} else if (game.isGameScreen){
		/*switch (e.keyCode) {
			case 32: //Spacebar
				if(game.isGameScreen){
					if(playerOne){
						game.checksCollision(playerOne);
					}
				}
				break;
			case 13: //Enter
				if(game.isGameScreen){
					if (playerTwo){
						game.checksCollision(playerTwo);
					}
				}
				break;
			case 38: //Up key
				if(game.isGameScreen){
					if (playerTwo){
						playerTwo.speed.changeMultiplier(playerTwo.speed.multiplier + 1);
						playerTwo.speed.changeTotalSpeed();
					} else if (playerOne) {
						playerOne.speed.changeMultiplier(playerOne.speed.multiplier + 1);
						playerOne.speed.changeTotalSpeed();
					}
				}
				break;
			case 40: //Down key
							if(game.isGameScreen){
					if (playerTwo){
						if(playerTwo.speed.multiplier > 1){
							playerTwo.speed.changeMultiplier(playerTwo.speed.multiplier - 1);
						}
						playerTwo.speed.changeTotalSpeed();
					} else if (playerOne) {
						if(playerOne.speed.multiplier > 1){
							playerOne.speed.changeMultiplier(playerOne.speed.multiplier - 1);
						}
						playerOne.speed.changeTotalSpeed();
					}
				}
				break;
			case 73: //"i" key
				if(game.isGameScreen){
					if(playerOne && playerTwo === undefined){
						if (playerOne.isStoreRendered === true){
							playerOne.isStoreRendered = false;
							playerOne.clearStore(game.store);
							playerOne.isInventoryRendered = true;
						} else {
							playerOne.isInventoryRendered  = true;
						}
					}
				}
				break;
			case 83: //"s" key
				if(game.isGameScreen){
					if(playerOne && playerTwo === undefined){
						if (playerOne.isInventoryRendered  === true){
							playerOne.isInventoryRendered  = false;
							playerOne.inventory.clearRender();
							playerOne.isStoreRendered = true;
						} else {
							playerOne.isStoreRendered = true;
						}
					}
				}
				break;
			case 49: //"1" key
				if(game.isGameScreen){
					if(playerOne){
						if(playerOne.isInventoryRendered === true && playerOne.inventory.set[0] !== undefined){
							playerOne.useItem(0);
						} else if (playerOne.isStoreRendered === true){
							playerOne.buyItem(game.store, 0);
						}
					}
				}
				break;
			case 50: //"2" key
				if(game.isGameScreen){
					if(playerOne){
						if(playerOne.isInventoryRendered === true && playerOne.inventory.set[1] !== undefined){
							playerOne.useItem(1);
						} else if (playerOne.isStoreRendered === true){
							playerOne.buyItem(game.store, 1);
						}
					}
				}
				break;
			case 51: //"3" key
				if(game.isGameScreen){
					if(playerOne){
						if(playerOne.isInventoryRendered === true && playerOne.inventory.set[2] !== undefined){
							playerOne.useItem(2);
						} else if (playerOne.isStoreRendered === true){
							playerOne.buyItem(game.store, 2);
						}
					}
				}
				break;
			case 52: //"4" key
				if(game.isGameScreen){
					if(playerOne){
						if(playerOne.isInventoryRendered === true && playerOne.inventory.set[3] !== undefined){
							playerOne.useItem(3);
						} else if (playerOne.isStoreRendered === true){
							playerOne.buyItem(game.store, 3);
						}
					}
				}
				break;
			case 53: //"5" key
				if(game.isGameScreen){
					if(playerOne){
						if(playerOne.isInventoryRendered === true && playerOne.inventory.set[4] !== undefined){
							playerOne.useItem(4);
						} else if (playerOne.isStoreRendered === true){
							playerOne.buyItem(game.store, 4);
						}
					}
				}
				break;
			case 54: //"6" key
				if(game.isGameScreen){
					if(playerOne){
						if (playerOne.isStoreRendered === true){
							playerOne.buyItem(game.store, 5);
						}
					}
				}
				break;
			case 97: //numberpad "1" key
				if(game.isGameScreen){
					if(playerTwo){
						if(playerTwo.isInventoryRendered === true && playerTwo.inventory.set[0] !== undefined){
							playerTwo.useItem(0);
						} else if (playerTwo.isStoreRendered === true){
							playerTwo.buyItem(game.store, 0);
						}
					}
				}
				break;
			case 98: //numberpad "2" key
				if(game.isGameScreen){
					if(playerTwo){
						if(playerTwo.isInventoryRendered === true && playerTwo.inventory.set[1] !== undefined){
							playerTwo.useItem(1);
						} else if (playerTwo.isStoreRendered === true){
							playerTwo.buyItem(game.store, 1);
						}
					}
				}
				break;
			case 99: //numberpad "3" key
				if(game.isGameScreen){
					if(playerTwo){
						if(playerTwo.isInventoryRendered === true && playerTwo.inventory.set[2] !== undefined){
							playerTwo.useItem(2);
						} else if (playerTwo.isStoreRendered === true){
							playerTwo.buyItem(game.store, 2);
						}
					}
				}
				break;
			case 100: //numberpad "4" key
				if(playerTwo){
					if(playerTwo.isInventoryRendered === true && playerTwo.inventory.set[3] !== undefined){
						playerTwo.useItem(3);
					} else if (playerTwo.isStoreRendered === true){
						playerTwo.buyItem(game.store, 3);
					}
				}
				break;
			case 101: //numberpad "5" key
				if(playerTwo){
					if(playerTwo.isInventoryRendered === true && playerTwo.inventory.set[4] !== undefined){
						playerTwo.useItem(4);
					} else if (playerTwo.isStoreRendered === true){
						playerTwo.buyItem(game.store, 4);
					}
				}
				break;
			case 102: //numberpad "6" key
				if(playerTwo){
					if (playerTwo.isStoreRendered === true){
						playerTwo.buyItem(game.store, 5);
					}
				}
				break;
		}*/
		} else if (game.isGameOver){

		}
	}
}

function checkMouse(e){
	//This handles the click events
	e.preventDefault();
	e = e || window.event;
	var button = e.which || e.button;
	if (button == 1) { //Checks if it is a left mouse button click
		game.checksCollision(game.players[1]);
	}
}

function checkTouch(e){
	//this handles the touch events
	e.preventDefault();
	game.checksCollision(game.players[1]);
}

function Game(){
	this.toWin = 2;
	this.number = new NumGenerator(0, 10);
	this.store = new ItemStorage("Store", 6);
	this.numOfPlayers = 0;
	this.pastGameTime = 0;
	this.players = [];
	this.isStartScreen = true;
	this.isAboutScreen = false;
	this.isPlayerScreen = false;
	this.isGameScreen = false;
	this.isGameOver = false;
	this.okButton = new Button("OK", true);
}

Game.prototype.initialize = function(){
	// this.store.set.push(generateRandomItem("special", this.numOfPlayers));
	// for (var i = 1; i < this.store.maxHold; i++){
	// 	this.store.set.push(generateRandomItem("good", this.numOfPlayers));
	// }
	// this.getInfo();
	this.startButton = new Button("Start Game", true);
	this.aboutButton  = new Button("About", false);
	this.render();
};

Game.prototype.getInfo = function(){
	var name, player;

	if(confirm("Welcome to the game by T, 1-2-Fre3eze! Press OK to play in Single Player mode. Press Cancel for Head-to-Head game.")){
		name = prompt("This is Single Player mode. Please enter your gamertag or you will be Alex.", "Alex");
		player = new Player(name, 0, 0, canvas.width, canvas.height);
		this.players.push(player);
		this.numOfPlayers = this.players.length;
	} else {
		canvas.width = 1400;
		name = prompt("This is Head-to-Head mode. Please enter your Player 1's gamertag or it will be Alex.", "Alex");
		player = new Player(name, 0, 0, canvas.width / 2, canvas.height);
		this.players.push(player);
		name = prompt("Please enter your Player 2's gamertag or it will be Terry.", "Terry");
		player = new Player(name, canvas.width / 2, 0, canvas.width / 2, canvas.height);
		this.players.push(player);
		this.numOfPlayers = this.players.length;
	}
};

Game.prototype.checksWin = function(player){
	//Checks if the victory points of the player matches the goal
	if(player.victoryPoints === this.toWin){
		alert(player.name + " has won the game");
		this.reset();
	}
};

Game.prototype.render = function(currentTime){
	//This is the Looping function that renders the game
	context.save();
	context.clearRect(0,0,canvas.width,canvas.height);
	if(this.isStartScreen){
		this.startScreenRender();
	} else if (this.isAboutScreen){
		this.aboutScreenRender();
	} else if (this.isPlayerScreen){
		this.playerScreenRender();
	} else if (this.isGameScreen){
		this.gameScreenRender();
	} else if (this.isGameOver){
		this.gameOverScreenRender();
	}

	//Context Restore
    context.restore();

	requestAnimFrame(this.render.bind(this));
};

Game.prototype.startScreenRender = function(){

	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillStyle = "black";
	context.font = "bold 42pt sans-serif";
	context.fillText("1, 2,", canvas.width / 2, canvas.height / 4);

	var space = context.measureText("E3").width - context.measureText("E").width - context.measureText("3").width + context.measureText("3").width / 2;
	var begSpace = context.measureText("FRE").width / 2;
	var endSpace = context.measureText("EZE").width / 2;

	context.fillText("3", canvas.width / 2, canvas.height / 4 + 50);
	
	context.fillStyle = "rgb(99, 184, 255)";
	context.fillText("FRE", canvas.width / 2 - begSpace - space, canvas.height / 4 + 50);

	context.fillText("EZE", canvas.width / 2 + endSpace + space, canvas.height / 4 + 50);

	context.font = "bold 24pt sans-serif";
	this.startButton.render((canvas.width - context.measureText("   " + this.startButton.name + "   ").width) / 2, canvas.height * 3 / 4, context.measureText("   " + this.startButton.name + "   ").width, canvas.height / 12);
	this.aboutButton.render((canvas.width - context.measureText("   " + this.aboutButton.name + "   ").width) / 2, canvas.height * 3 / 4 + 50, context.measureText("   " + this.aboutButton.name + "   ").width, canvas.height / 12);


};

Game.prototype.aboutScreenRender = function(){
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillStyle = "black";
	context.font = "bold 24pt sans-serif";
	context.fillText("About", canvas.width / 2, canvas.height / 16);

	context.font = "bold 16pt sans-serif";
	context.fillText("Goal: To Acquire Target Amount of Victory Points", canvas.width / 2, canvas.height  * 5 / 32);

	context.font = "normal 16pt sans-serif";
	convertToCanvasText(canvas.width / 32, canvas.height * 8 / 32, canvas.width * 31 / 32, "Buy Victory Points:  In the Store, using your Money.");
	convertToCanvasText(canvas.width / 32, canvas.height * 10 / 32, canvas.width * 31 / 32, "Get Money:  By Matching your Number to Target number.");
	convertToCanvasText(canvas.width / 32, canvas.height * 12 / 32, canvas.width * 31 / 32, "Get More Money:  By Increasing your Speed Multiplier.");
	convertToCanvasText(canvas.width / 32, canvas.height * 14 / 32, canvas.width * 31 / 32, "Buy and Use Items on Self or Opponent: To Increase your Chance of Winning.");

	context.font = "bold 16pt sans-serif";
	this.okButton.render((canvas.width - context.measureText("   " + this.okButton.name + "   ").width) / 2, canvas.height * 11 / 12 - canvas.height / 16, context.measureText("   " + this.okButton.name + "   ").width, canvas.height / 12);

};

Game.prototype.playerScreenRender = function(){
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillStyle = "black";
	context.font = "bold 24pt sans-serif";
	context.fillText("Set up Game", canvas.width / 2, canvas.height / 16);

	if(this.numOfPlayers === 0){
		// Renders the Player Modes
		context.font = "bold 16pt sans-serif";
		this.onePlayerButton.render(canvas.width / 2 - context.measureText("   " + this.onePlayerButton.name + "   ").width - canvas.width * 3 / 32, canvas.height / 2, context.measureText("   " + this.onePlayerButton.name + "   ").width, canvas.height / 12);
		this.twoPlayerButton.render(canvas.width / 2 + canvas.width * 3 / 32, canvas.height / 2, context.measureText("   " + this.twoPlayerButton.name + "   ").width, canvas.height / 12);

	} else {
		// Renders the Player Modes
		context.font = "bold 16pt sans-serif";
		this.onePlayerButton.render(canvas.width / 2 - context.measureText("   " + this.onePlayerButton.name + "   ").width - canvas.width * 3 / 32, canvas.height * 2 / 16, context.measureText("   " + this.onePlayerButton.name + "   ").width, canvas.height / 12);
		this.twoPlayerButton.render(canvas.width / 2 + canvas.width * 3 / 32, canvas.height * 2 / 16, context.measureText("   " + this.twoPlayerButton.name + "   ").width, canvas.height / 12);

		if(this.numOfPlayers === 1){
			this.nameInput.render();
			this.matchKey.render();
			this.upSpeedKey .render();
			this.downSpeedKey.render();
			this.helpKey.render();
			this.inventoryKey.render();
			this.storeKey.render();
			this.slotOne.render();
			this.slotTwo.render();
			this.slotThree.render();
			this.slotFour.render();
			this.slotFive.render();
			this.slotSix.render();
		} else if (this.players.length === 0){

		} else {

		}

		//Renders Each Players

		context.font = "bold 16pt sans-serif";
		this.okButton.render((canvas.width - context.measureText("   " + this.okButton.name + "   ").width) / 2, canvas.height * 11 / 12 - canvas.height / 16, context.measureText("   " + this.okButton.name + "   ").width, canvas.height / 12);
	}
};



Game.prototype.gameScreenRender = function(){
//Render each player's screen
	for(var j = 0; j < this.players.length; j ++){
		this.players[j].render(this.store, this.number, currentTime);
		this.players[j].generateRandomNumber(currentTime);
	}
};


Game.prototype.gameOverRender = function(currentTime){
	context.font = "bold 24pt sans-serif";
	context.fillStyle = "black";
	context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
};

Game.prototype.reset = function(){
	this.players = [];
	this.numOfPlayers = 0;
	this.number = new NumGenerator(0, 10);
	this.store = new ItemStorage("Store", 6);
	canvas.width = 700;
	this.initialize();
};

function Player(name, refXCor, refYCor, refXLength, refYLength, match, matchName, upSpeed, upSpeedName, downSpeed, downSpeedName, help, helpName, inventory, inventoryName, store, storeName, slotOne, slotOneName, slotTwo, slotTwoName, slotThree, slotThreeName, slotFour, slotFourName, slotFive, slotFiveName, slotSix, slotSixName){
	this.name = name;
	this.victoryPoints = 0; //Collect Victory Points for victory
	this.money = 0; //Money is used for buying items and victory points from the store. This can be earned by getting a match with the target number.
	this.speed = new Speed(); //Speed of which to generate a random number to match with the target number
	this.number = new NumGenerator(0, 10);//Number that is used to match with the target number.
	this.lastCallTime = 0; //Helps keep track of when a new number should be generated
	this.updateWrong = false; //Lets the program know if the lastWrongTime needs to be updated 
	this.lastWrongTime = 0;//Helps keep track of how long the pause should be for the mismatch
	this.inventory = new ItemStorage('Inventory', 5);
	this.isInventoryRendered = true;//Tracks if the inventory is being rendered
	this.isStoreRendered = false;//Tracks if the store being rendered
	this.notification = new Notification();
	this.isHelpScreen = false; //Tracks if the Help Screen is being rendered.
	this.keys = new KeyControls(match, matchName, matchUse, 
								upSpeed, upSpeedName, upSpeedUse, 
								downSpeed, downSpeedName, downSpeedUse, 
								help, helpName, helpUse, 
								inventory, inventoryName, inventoryUse, 
								store, storeName, storeUse, 
								slotOne, slotOneName, slotOneUse, 
								slotTwo, slotTwoName, slotTwoUse, 
								slotThree, slotThreeName, slotThreeUse, 
								slotFour, slotFourName, slotFourUse, 
								slotFive, slotFiveName, slotFiveUse, 
								slotSix, slotSixName, slotSixUse); //This will hold the keys for each player 
	this.refXCor = refXCor;
	this.refYCor = refYCor;
	this.refXLength = refXLength;
	this.refYLength = refYLength;
}

Player.prototype.checksCollision = function(){
	//Checks if the target number and the player's number match
	if (this.number.num === game.number.num) {
		this.money += this.speed.multiplier;
		game.number.changeNum();
	} else {
		this.updateWrong = true; //Lets the player know that they mismatched.
	}
};

Player.prototype.buyItem = function(store, itemNumber){
	if (this.inventory.set.length < this.inventory.maxHold && this.money >= store.set[itemNumber].price){
		this.inventory.set.push(store.set[itemNumber]); // Adds item to the inventory
		this.money -= store.set[itemNumber].price;
		this.notification.setNotify("You just bought item, " + store.set[itemNumber].name + ".", true);
		if(store.set[itemNumber].name !== "Increase Victory Points"){
			store.set.splice(itemNumber, 1);
			store.set.push(generateRandomItem("good", game.numOfPlayers));
		}
	} else if (this.inventory.set.length < this.inventory.maxHold){
		this.notification.setNotify("You do not have enough money.", false);
	} else {
		this.notification.setNotify("You do not have space in your inventory.", false);
	}
};

Player.prototype.useItem = function(itemNumber){
	if(this.inventory.set[itemNumber].use){
		var results = this.inventory.set[itemNumber].use(this);
		this.notification.setNotify(results[0], results[1]);
		if(results[1] === true){
			if(this.inventory.set[itemNumber].name === "Increase Victory Points"){
				game.checksWin(this);
			}
			this.inventory.set.splice(itemNumber, 1);
		}
	} else if(this.inventory.set[itemNumber].use === undefined){
		this.notification.setNotify("Cannot use item, " + this.inventory.set[itemNumber].name + ".", false);
	} else {
		console.log("some other problem, man");
	}
};

Player.prototype.render = function(store, number, currentTime){
	var playerMetricX = this.refXCor + this.refXLength / 32;
	var targetMetricX = this.refXCor + this.refXLength * 31 / 32;

	//Creates outside border of game
	context.lineWidth = 1;
	context.strokeStyle = "black";
	context.strokeRect(this.refXCor, this.refYCor, this.refXLength, this.refYLength);

	//Creates the environment
	context.lineWidth = 3;
	context.strokeRect(this.refXCor + this.refXLength * 7 / 16 , this.refYCor + this.refYLength / 64, this.refXLength / 8, this.refXLength / 8);

	//Render Target Number
	number.render(this.refXCor + this.refXLength / 2, this.refYCor + this.refYLength * 7 / 64, "bold 48pt sans-serif", "red");

	//Render Match Number
	this.number.render(this.refXCor + (this.refXLength / 2), this.refYCor + (this.refYLength / 2), "bold 64pt sans-serif", "black");

	//Render Duration of the Game
	context.font = "bold 24pt sans-serif";
	context.fillStyle = "gray";
	context.fillText(msToTime(currentTime), this.refXCor + this.refXLength / 2, this.refYCor + this.refYLength * 15 / 64);

	//Render Title of Player's Metrics
	context.font = "bold 16pt sans-serif";
	context.fillStyle = "black";
	context.fillText("Player's Metrics", this.refXCor + this.refXLength / 5, this.refYCor + this.refYLength / 32);

	// //Render Title of Target Number's Metrics
	context.fillText("Target's Metrics", this.refXCor + this.refXLength * 4 / 5 , this.refYCor + this.refYLength / 32);

	//Render Victory Points
	context.font = "bold 14pt sans-serif";
	context.textAlign = "left";
	context.fillStyle = "purple";
	context.fillText("Victory Points: " + this.victoryPoints, playerMetricX, this.refYCor + this.refYLength * 6 / 64);

	//Render Money
	context.fillStyle = "blue";
	context.fillText("Money: " + this.money, playerMetricX, this.refYCor + this.refYLength * 9 / 64);

	//Render Multiplier
	context.fillText("Multiplier: " + this.speed.multiplier, playerMetricX, this.refYCor + this.refYLength * 12 / 64);

	//Render Base Speed
	context.fillText("Base Speed: " + this.speed.base, playerMetricX, this.refYCor + this.refYLength * 15 / 64);

	//Render Minimum of Range of Match
	context.fillText("Minimum of Your Range: " + this.number.min, playerMetricX, this.refYCor + this.refYLength * 18 / 64);

	//Render Maximum of Range of Match
	context.fillText("Maximum of Your Range: " + (this.number.max - 1), playerMetricX, this.refYCor + this.refYLength * 21 / 64);

	//Render Victory Points Goal
	context.font = "bold 14pt sans-serif";
	context.textAlign = "right";
	context.fillStyle = "rgb(84,84,84)";
	context.fillText("Victory Points Goal: " + game.toWin, targetMetricX, this.refYCor + this.refYLength * 6 / 64);

	//Render Minimum of Range of Target
	context.fillText("Minimum of Target Range: " + game.number.min, targetMetricX, this.refYCor + this.refYLength * 9 / 64);

	//Render Maximum of Range of Target
	context.fillText("Maximum of Target Range: " + (game.number.max - 1), targetMetricX, this.refYCor + this.refYLength * 12 / 64);

	//Render any Error Messages
	this.notification.renderNotify(currentTime, this.refXCor, this.refYCor, this.refXLength, this.refYLength);

	//Render Inventory or Store
	this.inventory.render(this.isInventoryRendered, false, this.refXCor, this.refYCor, this.refXLength, this.refYLength);
	this.renderStore(store);

	if(this.isHelpScreen){
		this.helpScreenRender();
	}
};

Player.prototype.helpScreenRender= function(){
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
	store.render(this.isStoreRendered, true, this.refXCor, this.refYCor, this.refXLength, this.refYLength);
};

Player.prototype.clearStore = function(store){
	store.clearRender(this.refXCor, this.refYCor, this.refXLength, this.refYLength);
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
			context.fillRect(refXCor + refXLength / 2 - context.measureText(this.notifyMessage).width / 2, refYCor + refYLength * 13 / 16 - refXLength * 9 / 64, context.measureText(this.notifyMessage).width, refYLength * 3 / 64);

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

NumGenerator.prototype.render = function(refXCor, refYCor, font, fillColor){
	//Render Target
	context.font = font;
	context.textAlign = "center";
	context.fillStyle = fillColor;
	context.textBaseline = "middle";
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

Item.prototype.render = function(showPrice, xCor, yCor, sideLength){
		context.fillStyle = this.color;
		context.textAlign = "center";
		context.fillRect(xCor, yCor, sideLength, sideLength);

		var showPriceY = 0;

		if (showPrice === true){ //Shows the price of the item
			showPriceY = sideLength / 8;

			context.font = "bold 8pt sans-serif";
			context.textAlign = "center";
			context.fillStyle = "black";
			context.fillText("Cost: " + this.price, xCor + sideLength / 2, yCor + sideLength - showPriceY);
		}

		context.font = "bold 12pt sans-serif";
		context.textAlign = "center";
		context.fillStyle = "black";
		context.fillText(this.abbrev, xCor + sideLength / 2, yCor + sideLength / 2 - showPriceY);

		context.font = "8pt sans-serif";
		context.textAlign = "center";
		context.fillStyle = "black";
		context.fillText("@ " + this.target, xCor + sideLength / 2, yCor + sideLength / 2 + sideLength / 8 - showPriceY);

};

function ItemStorage(name, maxHold){
	//Defines what is an item storage object
	this.name = name; //Name of the storage
	this.maxHold = maxHold; //Maximum Size of the storage
	this.set = []; //What is currently in the storage
}

ItemStorage.prototype.render = function(isRender, showPrice, refXCor, refYCor, refXLength, refYLength) {
		//Rendering of the skeleton of the storage
		var sideLength = refXLength / 8;
		var xCor = refXCor + (refXLength - sideLength * this.maxHold) / 2;
		var yCor = refYCor + refYLength * 15 / 16 - sideLength;

		if(isRender){
			//Renders the name of the visible Storage
			context.font = "bold 12pt sans-serif";
			context.textAlign = "left";
			context.fillStyle = "black";
			context.fillText(this.name, xCor, yCor - refYLength / 32);
			
			for (i = 0; i < this.maxHold; i++){
				context.lineWidth = 1;
				context.strokeStyle = "black";
				context.strokeRect(xCor , yCor, sideLength, sideLength);

				context.font = "bold 8pt sans-serif";
				context.textAlign = "center";
				context.fillStyle = "grey";
				context.fillText(i + 1, xCor + sideLength / 2, yCor + sideLength + refYLength / 32);

				if (this.set[i] === undefined){
					context.fillStyle = 'rgb(220,220,220)';
					context.fillRect(xCor, yCor, sideLength, sideLength);

					context.font = "bold 8pt sans-serif";
					context.textAlign = "center";
					context.fillStyle = "black";
					context.fillText("no item", xCor + sideLength / 2, yCor + sideLength / 2);
				} else {
					this.set[i].render(showPrice, xCor, yCor, sideLength);
				}

				xCor += sideLength;
			}
		} else {
			//Renders the name of the non-visible Storage
			context.font = "bold 12pt sans-serif";
			context.textAlign = "left";
			context.fillStyle = "gray";
			context.fillText(this.name, xCor + sideLength * this.maxHold / 2, yCor - refYLength / 32);
		}

};

ItemStorage.prototype.clearRender = function(refXCor, refYCor, refXLength, refYLength) {
		//Clears the rendering of the skeleton of the storage
		var sideLength = refXLength / 8;
		var xCor = refXCor + (refXLength - sideLength * this.maxHold) / 2;
		var yCor = refYCor + refYLength * 15 / 16 - sideLength;

		context.clearRect(xCor, yCor, sideLength * this.maxHold, sideLength);
};

function Button(name, defaultStatus){
	this.name = name;
	this.isHighlighted = defaultStatus;
	this.isInactive = false;
}

Button.prototype.render = function(xCor, yCor, xLength, yLength){
	if (this.isHighlighted === true){
		this.highlightRender(xCor, yCor, xLength, yLength);
	}

	if (this.isInactive === true){
		this.inactiveRender(xCor, yCor, xLength, yLength);
	}

	context.lineWidth = 3;
	context.lineJoin = "round";
	context.strokeStyle = "black";
	context.strokeRect(xCor, yCor, xLength, yLength);	

	context.fillStyle = "black";
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillText(this.name, xCor + xLength / 2, yCor + yLength / 2);
};

Button.prototype.highlightRender = function(xCor, yCor, xLength, yLength){
	context.fillStyle = "rgb(255,255,224)";
	context.fillRect(xCor, yCor, xLength, yLength);
};

Button.prototype.inactiveRender = function(xCor, yCor, xLength, yLength){
	context.fillStyle = "gray";
	context.fillRect(xCor, yCor, xLength, yLength);
};

function InputField(labelName, defaultStatus){
	this.labelName = labelName;
	this.isHighlighted = defaultStatus;
	this.isInactive = false;
}

InputField.prototype.render = function(xCor, yCor, xLength, yLength, text){
	if (this.isHighlighted === true){
		this.highlightRender(xCor, yCor, xLength, yLength);
	}

	if (this.isInactive === true){
		this.inactiveRender(xCor, yCor, xLength, yLength);
	}

	context.fillStyle = "black";
	context.textAlign = "left";
	context.textBaseline = "middle";

	context.font = "bold 14pt sans-serif";
	context.fillText(this.labelName + ":  ", xCor, yCor + yLength / 2);

	var labelWidth = context.measureText(this.labelName + ":  ").width;

	context.lineWidth = 3;
	context.lineJoin = "miter";
	context.strokeStyle = "black";
	context.strokeRect(xCor + labelWidth, yCor, xLength - labelWidth, yLength);
	
	context.fillText(text, xCor + labelWidth + (xLength - labelWidth) / 2, yCor + yLength / 2);
};

InputField.prototype.highlightRender = function(xCor, yCor, xLength, yLength){
	context.fillStyle = "rgb(255,255,224)";
	context.fillRect(xCor, yCor, xLength, yLength);
};

InputField.prototype.inactiveRender = function(xCor, yCor, xLength, yLength){
	context.fillStyle = "gray";
	context.fillRect(xCor, yCor, xLength, yLength);
};

function KeyControls(match, matchName, matchUse, upSpeed, upSpeedName, upSpeedUse, downSpeed, downSpeedName, downSpeedUse, help, helpName, helpUse, inventory, inventoryName, inventoryUse, store, storeName, storeUse, slotOne, slotOneName, slotOneUse, slotTwo, slotTwoName, slotTwoUse, slotThree, slotThreeName, slotThreeUse, slotFour, slotFourName, slotFourUse, slotFive, slotFiveName, slotFiveUse, slotSix, slotSixName, slotSixUse){
	this.match = new Key("Match to Target Number", match, matchName, matchUse);
	this.upSpeed = new Key("Increase Speed Multiplier", upSpeed, upSpeedName, upSpeedUse);
	this.downSpeed = new Key("Decrease Speed Multiplier", downSpeed, downSpeedName, downSpeedUse);
	this.help = new Key("Help Screen", help, helpName, helpUse);
	this.inventory = new Key("Show Inventory", inventory, inventoryName, inventoryUse);
	this.store = new Key("Show Store", store, storeName, storeUse);
	this.slotOne = new Key("Item Slot 1", slotOne, slotOneName, slotOneUse);
	this.slotTwo = new Key("Item Slot 2", slotTwo, slotTwoName, slotTwoUse);
	this.slotThree = new Key("Item Slot 3", slotThree, slotThreeName, slotThreeUse);
	this.slotFour = new Key("Item Slot 4", slotFour, slotFourName, slotFourUse);
	this.slotFive = new Key("Item Slot 5", slotFive, slotFiveName, slotFiveUse);
	this.slotSix = new Key("Item Slot 6", slotSix, slotSixName, slotSixUse);
}

function Key(name, keyCode, keyName, use){
	this.name = name;
	this.keyCode = keyCode;
	this.keyName = keyName;
	this.use = use;
}

function keyCodeToChar(keyCode){
	return (function(){
		var keyCodetoChar = {8:"Backspace",
							9:"Tab",
							13:"Enter",
							16:"Shift",
							17:"Ctrl",
							18:"Alt",
							19:"Pause/Break",
							27:"Esc",
							32:"Space",
							33:"Page Up", 34:"Page Down",
							35:"End", 36:"Home",
							37:"Left", 38:"Up",	39:"Right",	40:"Down",
							45:"Insert",
							46:"Delete",
							96:"Numpad 0",97:"Numpad 1",98:"Numpad 2",99:"Numpad 3",100:"Numpad 4",101:"Numpad 5",102:"Numpad 6",103:"Numpad 7",104:"Numpad 8",105:"Numpad 9",
							106:"Numpad *",107:"Numpad +",109:"Numpad -",110:"Numpad .",111:"Numpad /",
							112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",
							186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"};
		var alphaNum = {48:"0",	49:"1",	50:"2",	51:"3",	52:"4",	53:"5",	54:"6", 55:"7",	56:"8",	57:"9",
						65:"A",	66:"B",	67:"C",	68:"D",	69:"E",	70:"F",	71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z"
						}
		if(keyCode in alphaNum){
			return [true, alphaNum[keyCode]];
		} else if (keyCode in keyCodetoChar){
			return [false, keyCodeToChar[keyCode]];
		} else {
			return undefined;
		}
	})();
}

function generateRandomItem (type, numOfPlayers){
	//Generate either a bad or good item for either store or the game
	return (function(){
		var availableItems = {};
		availableItems.victoryPoints = new Item("Increase Victory Points", 1, "VP", "self", "yellow", "special", function(player){
											player.victoryPoints++;
											return ["Your Victory Points have increased by 1.", true];
										});
		availableItems.decreaseBaseSpeed = new Item("Decrease Base Speed", 1, "BS-", "self", "blue", "good", function(player){
												if(player.speed.base > 1){
													player.speed.base--;
													return ["Your Base Speed has decreased by 1.", true];
												} else {
													return ["Base Speed cannot be reduced further.", false];
											}});
		availableItems.increaseBaseSpeed = new Item("Increase Base Speed", undefined, "BS+", "self", "orange", "bad", function(player){
												player.speed.base++;
												return ["Your Base Speed has increased by 1.", false];
											});
		availableItems.decreaseTargetRange = new Item("Decrease Target Range", 1, "TR-", "self", "green", "good", function(player){
													if (game.number.min < player.number.min){
														game.number.min++;
														return ["The min of Target number has increased by 1.", true];
													} else if(game.number.max + 1 > game.number.min){
														game.number.max--;
														return ["The max of Target number has decreased by 1.", true];
													} else {
														return ["Target number's Range cannot be reduced further.", false];
												}});
		availableItems.increaseTargetRange = new Item("Increase Target Range", 1, "TR+", "self", "pumpkin", "good", function(player){
													if(game.number.min > 0){
														game.number.min--;
														return ["The min of Target number has decreased by 1.", true];
													} else {
														game.number.max++;
														return ["The max of Target number has increased by 1.", true];
												}});
		availableItems.decreaseMatchRange = new Item("Decrease Match Range", 1, "MR-", "self", "brown", "good", function(player){
													if (player.number.min < game.number.min){
														player.number.min++;
														return ["The min of your Match number's range has increased by 1.", true];
													} else if (player.number.max + 1 > player.number.min){
														player.number.max--;
														return ["The max of your Match number's range has decreased by 1.", true];
													} else {
														return ["Your Match number's Range cannot be reduced further.", false];
												}});
		availableItems.increaseMatchRange = new Item("Increase Match Range", 1, "MR+", "self", "red", "good", function(player){
													if(player.number.min > 0){
														player.number.min--;
														return ["The min of your Match number's range has decreased by 1.", true];
													} else {
														player.number.max++;
														return ["The max of your Match number's range has increased by 1.", true];
												}});

		var selection = [];
		var itemKeys = Object.keys(availableItems);

		if (type === "good" && numOfPlayers > 1){
			for (var i = 0; i < itemKeys.length; i++){
				if (availableItems[itemKeys[i]].type === "good") {
					selection.push(itemKeys[i]);
				}
			}
		} else if (type === "good"){
			for (var i = 0; i < itemKeys.length; i++){
				if (availableItems[itemKeys[i]].type === "good" && availableItems[itemKeys[i]].target === "self") {
					selection.push(itemKeys[i]);
				}
			}
		} else if (type === "bad"){
			for (var i = 0; i < itemKeys.length; i++){
				if (availableItems[itemKeys[i]].type === "bad") {
					selection.push(itemKeys[i]);
				}
			}
		} else if (type === "special"){
			selection.push("victoryPoints");
		} else if (type === "all"){
			selection = itemKeys;
		}
		return availableItems[selection[Math.floor(Math.random() * selection.length)]];
	})();
}

function msToTime(duration) {
	return (function() {
		var minutes = Math.floor(duration / 60000);
		var seconds = Math.floor(duration / 1000) - minutes * 60;

		if (minutes < 10){
			minutes = "0" + minutes;
		}
		if (seconds < 10){
			seconds = "0" + seconds;
		}
		return " " + minutes + ":" + seconds + " ";
	})();
}

function convertToCanvasText(refXCor, refYCor, refXLength, text){
	var textArray = text.split(" ");
	var line = "";
	var lineNo = 0;

	context.textAlign = "left";

	for (var i = 0; i < textArray.length; i++){
		if(context.measureText(line + " " + textArray[i]).width <= refXLength && i + 1 < textArray.length){
			line = line + textArray[i] + " ";
		} else if (context.measureText(line + " " + textArray[i]).width > refXLength && i + 1 === textArray.length){
			context.fillText(line, refXCor, refYCor + lineNo * 25);
			context.fillText(textArray[i], refXCor, refYCor + (lineNo + 1) * 25);
		} else if( i + 1 === textArray.length){
			context.fillText(line + textArray[i], refXCor, refYCor + lineNo * 25);
		} else {
			context.fillText(line, refXCor, refYCor + lineNo * 25);
			line = textArray[i] + " ";
			lineNo ++;
		}
	}
}