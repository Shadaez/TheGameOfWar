var  _ = require("underscore");
var Games = {};

Games.All=[];
Games.Max=6;

Games.Add = function(gameID, player){
	//player should have player name & socket. Function would append id
	var game={};
	game.id=gameID;
	game.Players=[];

	game.CardHolder = [];

	player.id=1;
	game.Players.push(player);

	game.openToJoin=true;
	Games.All.push(game);
	console.log("Games.ADD" + game);
}

//finds gameID, returns reference to game object
Games.Find = function(gameID) {
	return _.findWhere(Games.All, {id: parseInt(gameID)});
}

Games.Join = function(gameID, player){
	//if game is full, return false, else true
	var game = Games.Find(gameID);
	if(game.Players.length < Games.Max){
		player.id=game.Players.Length+1;
		game.Players.push(player);
		console.log("Join" + player);
		return true;
	} else {
		return false;
	}
	console.log(player);
}

Games.Start = function(gameID){
	Games.All[gameID].openToJoin=false;
}

module.exports = Games;
