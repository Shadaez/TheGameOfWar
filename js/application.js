var serverSocket = io.connect("http://localhost");
var UserCards;

$(ready);

function ready() { //start jQuery
    $("#start").on("click", function() {
        var gameId = $("[name='txtGame']").val();
        serverSocket.emit("create", {
            gameId: gameId
        });
    });

    $("#create").on("click", function() {
        var player = $("[name='playerName']").val();
        if (player.length <= 0) {
            alert("Please insert a name")
        } else {
            serverSocket.emit("create", {
                playerName: player
            });
        }
    });

    $('#deal').on('click', function() {
        var gameID = $("#board").data("gameID");
        serverSocket.emit("deal", gameID);
    });

    $("#join").on("click", function() {
        var player = $("[name='playerName']").val();
        var gameID = $('#gameList').val();
        console.log("game selected" + gameID);
        if (player.length <= 0) {
            alert("Please insert a name");
        } else if (!gameID) {
            alert("Please select a game");
        } else {
            serverSocket.emit("join", {
                playerName: player,
                gameID: gameID
            });
        }
    });

    $('body').on('click', '#submit_card', function() {
        console.log('submit');
        var selection = $('.active-card').data('index');
        var gameID = $('#board').data('gameID');
        var cardSlice = UserCards.splice(selection, 1);
        console.dir(cardSlice);
        var data = {
            id: gameID,
            card: cardSlice[0]
        };
        serverSocket.emit("submit-card", data);
    });
} //end jquery

serverSocket.on("updateGameList", function(gameList) {

    $('#gameList').html('');
    console.dir("games received" + gameList);
    var gameListLength = gameList.length;
    for (var i = 0; i < gameListLength; i++) {
        var disabled = "disabled";
        if (gameList[i].openToJoin) {
            disabled = '';
        }
        $('#gameList').append('<option ' + disabled + ' value =' + gameList[i].id + '>' + gameList[i].id + '</option>');
    }
    //to do: check if game is OpenToJoin, grey out if it isn't
});

serverSocket.on("join", function(data) {
    if (data.success) {
        //update view? YES!!
        //$('#deal').data('gameID', data.gameID);
        console.log("in join" + data);
    } else {
        alert("failed to join game, please try again");
    }
});


serverSocket.on("test", function(data) {
    console.dir(data);
});

serverSocket.on("switchToGame", function(game) {
    console.log("switchToGame " + game);
    $("[name='txtGame']").val(game.id);
    $('#playerList').html('');
    var playerListLength = game.Players.length;
    console.log("player length" + playerListLength)
    for (var i = 0; i < playerListLength; i++) {
        $('#playerList').append('<option>' + game.Players[i].name + '</option>');
    }
    $('#main,#board').toggleClass("clsHidden");
    $('#board').data('gameID', game.id);

});

serverSocket.on("cardDecks", function(cards) {
    UserCards = cards;
    console.dir(UserCards);
    display3Cards();

    $('body').append('<div id="submit_card">Submit Card!</div>');
    $('#board').on('click', '.card', function() {
        $('.active-card').removeClass('active-card');
        $(this).addClass('active-card');
    });
});

function display3Cards() {
    for (var i = 0; i < 3; i++) {
        $('#card' + (i +1)).append(UserCards[i].name + UserCards[i].suit);
    }
}