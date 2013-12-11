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
// expressApp.set("views", path.join(__dirname, "templates"))
   // .set("view engine", "hbs");

expressApp.get("/", function(req, res) {
     res.redirect("playingBoard.html");
});

expressApp.get("/game/:gameid", function(req, res) {
     var gameid = req.param("gameid");
});

// expressApp.get("/:filename", function(req, res) {
//     var filename = req.param("filename");

//     if(!_.has(fileContent, filename)) {
//         fileContent[filename] = "";
//     }

//     res.render("editor", {filename: filename, content: fileContent[filename]});
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
        Games.Add(gameCounter, clientSocket.id);// we need to store client socket id's to push to correct players
        console.log('---- clientSocket --------');
        console.log(clientSocket.id);
        clientSocket.broadcast.emit("updateGameList", Games.All);
        clientSocket.emit("updateGameList", Games.All);
    });
    
    clientSocket.on('deal', function(data){
        // var numplayers = 4; // for testing
        // var numplayers = Games.Find(data.gameid).Players.length;
        
        var game = _.findWhere(Games.All, {gameid: gameid});
        var players = game.players;
        var numplayers = game.players.length;
        var deck = Deck.Deal(numplayers);

        for (var i = 0; i < numplayers; i ++) {
            players[i].emit('cardDecks', deck[i]);
        }

    });

    clientSocket.on("join", function(data) {
        var joined = Games.Add(data.gameID, data.playerName)
        clientSocket.emit("join", {
            success: joined
        });
        if (joined){
            clientSocket.broadcast.emit("updateGameList", Games.All);
        } else {
            clientSocket.emit("updateGameList", Games.All);
            //if they failed, their game list needs refreshing
        }
    });
});




httpServer.listen(3000);
console.log("Started The Game of War on port 3000");