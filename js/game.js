var  _ = require("underscore");
var Games = {};

Games.All=[];
Games.Max=6;

Games.Add = function(gameID, player){
	var game={};
	game.id=gameID;
	game.Players=[];  // each player is object of socket which is playerid & name. {socket:socketid, name:name} 
	game.CardHolder = []; // holds the active cards of the players
	game.Players.push(player);
	game.openToJoin=true;
	Games.All.push(game);
}

//finds gameID, returns reference to game object
Games.Find = function(gameID) {
	return _.findWhere(Games.All, {id: parseInt(gameID)});
}

//returns all games which is yet to be joined if true or games started if inProgress is false
Games.FindGamesByState = function(inProgress) {
	return _.where(Games.All, {openToJoin: inProgress});
}

Games.Join = function(gameID, player){
	//if game has maximum players then returns false else adds the player & returns true
	var game = Games.Find(gameID);
	if(game.Players.length < Games.Max){
		game.Players.push(player);
		return true;
	} else {
		return false;
	}
}

Games.Start = function(gameID){
	Games.All[gameID].openToJoin=false;
}

module.exports = Games;
