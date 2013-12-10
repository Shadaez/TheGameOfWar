var path = require("path"),
    _ = require("underscore"),
    express = require("express"),
    socketio = require("socket.io"),
    http=require("http");

// ExpressJS Server Definition
var expressApp = express();

//expressApp.set("views", path.join(__dirname, "templates"))
   // .set("view engine", "hbs");

// expressApp.get("/", function(req, res) {
//     res.redirect("/untitled");
// });

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


// Listen for socket.io events
ioServer.on("connection", function(clientSocket) {
    clientSocket.on("create", function(data) {
        
    });
});


httpServer.listen(3000);
console.log("Started The Game of War on port 3000");