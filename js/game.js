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

//let me know if you can think of a better way to do this
//returns the game that contains the player w/ the socketID
Games.FindGameByPlayerSocket = function(socket) {
	var returnedGame;
	_.each(Games.All, function(game){
		var found = _.findWhere(game.Players, {socket: socket});
		if(found){
			returnedGame = game;
		}
	});
	return returnedGame;
}

//this will remove player from player list, as well as their submitted card if they have one
Games.RemovePlayer = function(game, socket){
	//check if they have a submitted card
	var indexOfPlayer = _.indexOf(game.Players, _.findWhere(game.CardHolder, {socketid: socket}))
	if (indexOfPlayer > -1){
		game.CardHolder.pop(indexOfPlayer);
	}
	//remove from player list
	indexOfPlayer = _.indexOf(game.Players, _.findWhere(game.Players, {socket: socket}))
	if (indexOfPlayer > -1){
		game.Players.splice(indexOfPlayer, 1);
	}
}

Games.Join = function(gameID, player){
	//if game has maximum players then returns false else adds the player & returns true
	var game = Games.Find(gameID);
	if(game.Players.length < Games.Max && game.openToJoin === true){
		game.Players.push(player);
		return true;
	} else {
		return false;
	}
}

Games.Start = function(gameID){
	Games.All[gameID].openToJoin=false;
}

//just removes game from Games.All;
Games.GameOver = function(game){
	var indexOfGame = _.indexOf(Games.All, game);
	Games.All.splice(indexOfGame, 1);
}

module.exports = Games;
