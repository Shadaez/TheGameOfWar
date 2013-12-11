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
	return _.findWhere(Games.All, {id: parseInt(gameID)});
}

Games.Join = function(gameID, playerID){
	//if game is full, return false, else v
	var game = Games.Find(gameID);
	if(game.Players.length < Games.Max){
		game.Players.push(playerID);
		return true;
	} else {
		return false;
	}
	
}

Games.Start = function(gameID){
	Games.All[gameID].openToJoin=false;
}

module.exports = Games;
