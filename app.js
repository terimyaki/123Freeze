var canvas, context;

window.onload = function(){
init();
}

function init() {
	canvas = document.getElementById('playArea');
	context = canvas.getContext('2d');
	render();
}

function render(){
		var x = canvas.width / 2;
      	var y = canvas.height / 2;

      	var number = Math.floor(Math.random() * (11 - 1)) + 1;

      	context.font = 'bold 48pt sans-serif';
      	context.textAlign = 'center';
      	context.fillStyle = 'black';
      	context.fillText(number, x, y);

}

function keydown(e){
	//Checks what Keys were pressed
}

function generateTarget(){
	//Creates random target number
}

function generateNumber(){
	//Creates random number
}

function gameStore(){
	//Manages store that sells powerups
}

function collision(){
	//Checks if the target number was hit and what happens afterwards
}

function inventory(){
	//Manages inventory of powerups bought
}

function gameScore(){
	//Manages gamescore and game points.
}