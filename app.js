var path = require("path"),
    _ = require("underscore"),
    express = require("express"),
    socketio = require("socket.io"),
    http=require("http"),
    Deck=require("./js/deck.js"),
    Games=require("./js/game.js");

// ExpressJS Server Definition
var expressApp = express();
expressApp.use(express.static(path.join(__dirname, 'templates')))
          .use(express.static(path.join(__dirname, 'css')))
          .use(express.static(path.join(__dirname, 'js')))
          .use(express.static(path.join(__dirname, 'images')));

expressApp.get("/", function(req, res) {
     res.redirect("playingBoard.html");
});

// Create joined express and socket.io server
var httpServer = http.createServer(expressApp)
    ioServer = socketio.listen(httpServer);

var gameCounter = 0;

// Listen for socket.io events
ioServer.sockets.on("connection", function(clientSocket) {
    //so the player gets the games on connect:
    clientSocket.emit("updateGameList", Games.All);

    clientSocket.on("create", function(data) {
    	gameCounter ++;
        var player={};
        player.name=data.playerName;
        player.socket=clientSocket.id;
        Games.Add(gameCounter, player);
        clientSocket.broadcast.emit("updateGameList", Games.All);
        clientSocket.emit("switchToGame" ,Games.Find(gameCounter));
        console.log(Games.All);
        // Games.Add(gameCounter, clientSocket.id);// we need to store client socket id's to push to correct players
        // clientSocket.broadcast.emit("updateGameList", Games.All);
        // clientSocket.emit("updateGameList", Games.All);
    });

    clientSocket.on("start", function(data) {
        console.log(data);
        Games.Start(data.gameID);
        clientSocket.broadcast.emit("sendUserStack", Games.All[data.gameID]);
    });
    
    clientSocket.on('deal', function(data){
        // var game = _.findWhere(Games.All, {id: data});
        var game = Games.Find(data);
        game.openToJoin = false;
        var players = game.Players;
        var numplayers = game.Players.length;
        var deck = Deck.Deal(numplayers);
      
        for (var i = 0; i < numplayers; i ++) {
            var z = players[i].socket;
            ioServer.sockets.socket(z).emit("cardDecks", deck[i]);
        }
    });

    clientSocket.on("join", function(data) {
        var player={};
        player.name=data.playerName;
        player.socket=clientSocket.id;
        console.log("app.js " + gameCounter, player);
        var joined = Games.Join(data.gameID, player);
        console.log(joined);
        clientSocket.emit("join", {
            success: joined,
            gameID: data.gameID // so that start button knows which game to join
        });
        if (joined){
            // clientSocket.broadcast.emit("updateGameList", Games.All);
            clientSocket.emit("switchToGame",Games.Find(data.gameID));
            var game = Games.Find(data.gameID);
            pushToGame(game, "updatePlayerList", game);
            // _.each(game.Players, function(player){
            //     ioServer.sockets.socket(player.socket).emit("updatePlayerList");
            // });
            

        } else {
            clientSocket.emit("updateGameList", Games.All);
            //if they failed, their game list needs refreshing
        }
    });

    clientSocket.on("submit-card", function(data) {
      
      var game = Games.Find(data.id);
      game.CardHolder.push({socketid: clientSocket.id, card: data.card});
      var numCards = game.CardHolder.length;
      var numplayers = game.Players.length;
      if (numCards === numplayers) {
        var winningCard = Deck.Compare(game.CardHolder);
        var returnCardsWinner = _.pluck(game.CardHolder, 'card');

        // console.log(x);
        ioServer.sockets.socket(winningCard.socketid).emit('winner', returnCardsWinner);
        var winningplayer = _.findWhere(game.Players, {socket: winningCard.socketid});
        pushToGame(game, 'alertwinner', winningplayer.name);
        game.CardHolder = [];
        console.log('card holder --------');
        console.log(game.CardHolder);
      }
      // for (var i = 0; i < numplayers; i ++) {
      //       var z = game.Players[i].socket;
      //       ioServer.sockets.socket(z).emit('winner', x);
      // }
    });
});

function pushToGame(game, eventname, data){
    var numplayers = game.Players.length;
    for (var i = 0; i < numplayers; i ++) {
        var playerSocket = game.Players[i].socket;
        ioServer.sockets.socket(playerSocket).emit(eventname, data);
    }
}

httpServer.listen(3000);
console.log("Started The Game of War on port 3000");