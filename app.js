var path = require("path"),
    _ = require("underscore"),
    express = require("express"),
    socketio = require("socket.io"),
    http=require("http");
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
    clientSocket.on("create", function(data) {
    	gameCounter ++;
    	console.log(data);
        Games.Add(gameCounter, data.playerName);
        clientSocket.broadcast.emit("updateGameList", Games.All);
    });
});




httpServer.listen(3000);
console.log("Started The Game of War on port 3000");