
	var isPlayer = false;
	var username = prompt("Username ?") || "NoUserName";
	var count = 0;
	$('#username').text(username);

	var socket = io();
	$('.box').click(function(){
		var position = $('.box').index(this);
		if(isPlayer)
			socket.emit('update',position);
	});
	socket.on('connect',function(){
		clearUI();
		socket.emit('join',username);
	});
	socket.on('fillcolor',function(map){
		fillColor(map);
	});
	socket.on('gameend',function(player){
		endGame(player);
	});
	socket.on('canplay',function(color){
		setPlayer(color);
	});
	socket.on('turn',function(player){
		turnColor(player);

	});
	socket.on('chat massage',function(msg){
		$('#messages').append($('<li>').text(msg));
		count++;
		$('#chat').css('height',function(){
			return count*25+25;
		});
		if(count == 20){
			$('li').first().remove();
			count--;
		}
	});
	function turnColor(player){
		if(player){
			$(".turn").html("RED turn.");
			$("h4").removeClass();
			$("h4").addClass('turn');
			$("h4").addClass('player-red');
		}
		else{
			$(".turn").html("BLUE turn.");
			$("h4").removeClass();
			$("h4").addClass('turn');
			$("h4").addClass('player-blue');
		}
	}
	function fillColor(map){
		for (var i = 0; i < map.length*15; i++) {
			var box = $('.box')[i];
			box = $(box);
			
			if(map[Math.floor(i/15)][i%15] == -1) box.addClass('box-red');
			else if(map[Math.floor(i/15)][i%15] == 1) box.addClass('box-blue');
			else {
				box.removeClass();
				box.addClass('box');
			}
		}
	}
	function endGame(player){
		if(!player)
		alert("RED WIN!");
		else
		alert("BLUE WIN!");
		isPlayer = false;
		clearUI();
		socket.emit('regame', '');
	}
	function clearUI(){
		$('.box').each(function(index){
			$(this).removeClass();
			$(this).addClass('box');
		});
		$(".turn").html("");
		$("h4").removeClass();
		$("h4").addClass('turn');
	}
	function setPlayer(color){
		console.log(color);
		$('#username').removeClass();
		$('#username').addClass(color == 'red' ? 'player-red' : 'player-blue');
		isPlayer = true;
		turnColor(true);
	}
	$('form').submit(function(){
    	socket.emit('chat message', $('#m').val());
    	$('#m').val('');
    	return false;
  	});