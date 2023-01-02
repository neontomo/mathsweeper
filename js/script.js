/*

TODO:
Remove instructions if played before localstorage

*/

/* SETUP */

timer = 0;
gameOver = false;
firstMove = true;
rows = 10;

/* FUNCTIONS */

function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min, max) {
	return (Math.random() * (max - min) + min).toFixed(1);
}

function sqrt(num) {
	if (num == 0 || num == 1) {
		return randomCalc(num);
	}
	return 'Square root of<br />' + (num * num) + '';
}

function multiply(num) {
	if (num == 0 || num == 1) {
		return randomCalc(num);
	}
	var r = randomInteger(10, 100);
	return 'Solve X:<br />' + r + 'x = ' + (r * num);
}

function divide(num) {
	if (num == 0 || num == 1) {
		return randomCalc(num);
	}
	var r = randomInteger(10, 100);
	return 'Solve X:<br />' + r + '/x = ' + parseFloat((r / num).toFixed(2));
}

function getCalc(num) {
	var minus = -randomInteger(40, 100);
	var plus = randomInteger(minus*(-1) + 10, 300);
	var total = minus + plus;
	var subtr = (total - num);
	return minus + '<br />+ ' + plus + '<br />- ' + subtr;
}

function randomCalc(num) {
	var which = randomInteger(0, 3);
	var calcFunctions = {
		0: sqrt,
		1: multiply,
		2: divide,
		3: getCalc
	};
	return calcFunctions[which](num);
}

function getNearElements(element) {
	var rowNumber = Number(element.attr('row'));
	var cellNumber = Number(element.attr('cell'));
	
	var topLeft = (cellNumber == 0) ? element : element.parent().prev().children().eq(cellNumber - 1);
	var top = element.parent().prev().children().eq(cellNumber);
	var topRight = element.parent().prev().children().eq(cellNumber + 1);
	
	var right = element.next();
	
	var bottomRight = element.parent().next().children().eq(cellNumber + 1);
	var bottom = element.parent().next().children().eq(cellNumber);
	var bottomLeft = (cellNumber == 0) ? element : element.parent().next().children().eq(cellNumber - 1);
	
	var left = element.prev();
	
	return topLeft.add(top).add(topRight).add(right).add(bottomRight).add(bottom).add(bottomLeft).add(left);
}

function flag(element) {
	if (gameOver == true || $(element).attr('check') == 'true') return;
	
	var newAttr = ($(element).attr('flag') == 'true') ? 'false' : 'true';
	$(element).attr('flag', newAttr);
}

function setBombs(element) {	
	$(element).attr('hero', 'true').attr('type', 'normal').attr('safe', 'true'); // safe first click
	
	getNearElements($('[hero="true"]')).attr('safe', 'true');
	
	$($('.cell[safe="false"]').get().sort(function() { // 15 randoms
		return Math.round(Math.random())-0.5
	}).slice(0, 15)).attr('type', 'bomb');
}

function setClues() {
	$('.cell').each(function(i) {
		var bombsAmount = getNearElements($(this)).filter('[type="bomb"]').length;
		$(this).attr('originalText', bombsAmount);
		$(this).attr('text', randomCalc(bombsAmount));
		if ($(this).attr('check') == 'true' && $(this).attr('type') == 'normal') { // bug fix
			$(this).html($(this).attr('text'));
		}
	});
}

function startTimer() {
	var timerActive = setInterval(function() {
		if (gameOver == true) {
			clearInterval(timerActive);
			return;
		}
		timer++;
		$('#board-timer').text(timer.toString().padStart(3, '0'));
	}, 1000);
}

function getInfo() {
	return {
		'all': $('.cell').length,
		'allChecked': $('.cell[check="true"]').length,
		'normals': $('.cell[type="normal"]').length,
		'normalsChecked': $('.cell[type="normal"][check="true"]').length,
		'bombs': $('.cell[type="bomb"]').length,
		'bombsChecked': $('.cell[type="bomb"][check="true"]').length
	};
}

/* CODE */

for (var i = 0; i < 10; i++) {
	var row = $('<tr>').addClass('row').attr('row', i);
	for (var j = 0; j < 10; j++) {
		var cell = $("<td></td>").addClass('cell').attr('safe', 'false').attr('check', 'false').attr('type', 'normal').attr('row', i).attr('cell', j);
		row.append(cell);
	}
	$('#board').append(row);
}

$('body').on('click', function() {
	$('#instructions').hide();
});

//$('.cell').attr('check', 'true');
longPress = false;


$(document).on('mousedown', function(event) {
	var pressTimer;
	
	pressTimer = setTimeout(function() {
		$(event.target).trigger('longpress');
		longPress = true;
	}, 500);
	
	$(document).on('mouseup', function() {
		clearTimeout(pressTimer);
		longPress = false;
	});
});

$('.cell').on('longpress', function(event) {
	flag($(this));
});

$('.cell').mouseup(function() {
	if (longPress == true) return;
	if (gameOver == true) return;
	if ($(this).attr('check') == 'true') return;
	
	var type = $(this).attr('type');
	
	if (firstMove == true) {
		firstMove = false;
		setBombs(this);
		setClues();
		startTimer();
		setTimeout(function () {
			$('[safe="true"]').trigger('mouseup');
		}, 200);
	}
	
	if (type == 'bomb') { // bomb
		$('.cell[type="bomb"]').attr('check', 'true').html('💣').attr('flag', 'false');
		$(this).css({ background: 'red' });
		gameOver = true;
		$('#board-status').html('😵');
		return;
	}
	
	if (type == 'normal') { // normal
		$(this).attr('check', 'true').html($(this).attr('text')).attr('flag', 'false');
		if (getInfo()['normals'] == getInfo()['normalsChecked']) { // win game
			gameOver = true;
			$('#board-status').html('😎');
			return;
		}
		return;
	}
});