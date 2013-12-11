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
}

Games.Start = gunction(gameID){
	Games.All[gameID].openToJoin=false;
}

module.exports = Games;
