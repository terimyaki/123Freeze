function draw(){
	var canvas = document.getElementById('playArea');
	if (canvas.getContext) {
		var context = canvas.getContext('2d');
		var x = canvas.width / 2;
      	var y = canvas.height / 2;

      	context.font = '30pt sans-serif';
      	context.textAlign = 'center';
      	context.fillStyle = 'black';
      	context.fillText('2', x, y);
	}
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