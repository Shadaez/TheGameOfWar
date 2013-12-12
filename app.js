var path = require("path"),
    _ = require("underscore"),
    express = require("express"),
    socketio = require("socket.io"),
    http=require("http"),
    Deck=require("./js/deck.js"),
    Games=require("./js/game.js");

// ExpressJS Server Definition
var expressApp = express();
expressApp.use(express.static(path.join(__dirname, 'templates')));
expressApp.use(express.static(path.join(__dirname, 'css')));

expressApp.get("/", function(req, res) {
     res.redirect("playingBoard.html");
});

// expressApp.get("/game/:gameid", function(req, res) {
//      var gameid = req.param("gameid");
// });

// Create joined express and socket.io server
var httpServer = http.createServer(expressApp)
    ioServer = socketio.listen(httpServer);

var gameCounter = 0;

// Listen for socket.io events
ioServer.on("connection", function(clientSocket) {
    //so the player gets the games on connect:
    clientSocket.emit("updateGameList", Games.All);

    clientSocket.on("create", function(data) {
    	gameCounter ++;
        var player={};
        player.name=data.playerName;
        player.socket=clientSocket;
        Games.Add(gameCounter, player);
        clientSocket.broadcast.emit("updateGameList", Games.All);
        clientSocket.emit("switchToGame",Games.Find(gameCounter));
    });
    clientSocket.on("start", function(data) {
        console.log(data);
        Games.Start(data.gameID);
        clientSocket.broadcast.emit("sendUserStack", Games.All[data.gameID]);
    });
    
    clientSocket.on("join", function(data) {
        var joined = Games.Join(data.gameID, data.playerName);
        console.log(joined);
        clientSocket.emit("join", {
            success: joined
        });
        if (joined){
            clientSocket.broadcast.emit("updateGameList", Games.All);
            clientSocket.emit("switchToGame",Games.Find(data.gameID));
        } else {
            clientSocket.emit("updateGameList", Games.All);
            //if they failed, their game list needs refreshing
        }
    });
});

httpServer.listen(3000);
console.log("Started The Game of War on port 3000");