var  _ = require("underscore");

var Games = {};

Games.All=[];
Games.Max=6;

Games.Add = function(gameID, player1Id){
	var game={};
	game.id=gameID;
	game.Players=[];
	game.Players.push(player1Id);
	game.openToJoin=true;
	Games.All.push(game);
	//we need to know size of the game
	//to check if it's ready to start / if players can join
}

//finds gameID, returns reference to game object
Games.Find = function(gameID) {
	var x=_.findWhere(Games.All, {id: gameID});
	console.log(x);
	return x;
}

Games.Join = function(gameID, playerID){
	//if game is full, return false, else v
	console.log(gameID,playerID);
	game = Games.Find(gameID);
	console.log(game);
	game.Players.push(playerID);
	//todo: check if it's full, update openToJoin
	return true
}

Games.Start = function(gameID){
	Games.All[gameID].openToJoin=false;
}

module.exports = Games;
