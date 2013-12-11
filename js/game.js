var Games = {};

Games.All=[];

Games.Add = function(gameID, player1Id){
	var game={};
	game.id=gameID;
	game.Players=[];
	game.Players.push(player1Id);
	game.openToJoin=true;
	Games.All.push(game);
}

//finds gameID, returns reference to game object
Games.Find = function(gameID) {
	return _.findWhere(Games.All, {id: gameID});
}

Games.Join = function(gameID, playerID){
	game = Games.Find(gameID);
	game.Players.push(playerID);
	//todo: check if it's full
}

module.exports = Games;
