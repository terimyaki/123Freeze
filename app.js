var canvas,context;
var gameObjects = {};

window.onload = function(){
	init();
};

function init() {
	canvas = document.getElementById('playArea');
	context = canvas.getContext('2d');
	setInterval(render,1000);
}

function createGameObjects(){

}

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
			break;
		case 38: //Up key
			break;
		case 40: //Down key
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
	
}

function gameStore(){
	//Manages store that sells powerups
}

function checksCollision(){
	//Checks if the target number was hit and what happens afterwards
}

function inventory(){
	//Manages inventory of powerups bought
}

function gameScore(){
	//Manages gamescore and game points.
}