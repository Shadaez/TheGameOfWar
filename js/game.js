
All=[];

Add = function(gameID, player1Id){
	var game={};
	game.id=gameID;
	game.Players=[];
	game.Players.push(player1Id);
	game.openToJoin=true;
	Games.All.push(game);
}

exports.Add = Add;
exports.All = All;
