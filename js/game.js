var Games = {};

Games.All=[];

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
	return _.findWhere(Games.All, {id: gameID});
}

Games.Join = function(gameID, playerID){
	//if game is full, return false, else v
	game = Games.Find(gameID);
	game.Players.push(playerID);
	//todo: check if it's full, update openToJoin
	return true
}

module.exports = Games;
