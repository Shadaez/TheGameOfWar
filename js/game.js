var Games = {};

Games.InProgress=[];

Games.Add = function(gameID, player1Id){
	var game={};
	game.id=gameID;
	game.Players=[];
	game.Players.push(player1Id);
	game.openToJoin=true;
	Games.InProgress.push(game);
}