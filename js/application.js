var serverSocket = io.connect("http://localhost");
var UserCards;

$(ready);

function ready() { //start jQuery

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
        //todo: change deal button to submit card button
        $(".card").slideToggle();
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

    //please leave this click handler set up this way for now
    $('body').on('click', '#submit_card', function() {
        console.log('Submit button clicked');
        if (UserCards.openToSubmit === true) {
            var selection = $('.active-card').data('index');
            var gameID = $('#board').data('gameID');
            var cardSlice = UserCards.splice(selection, 1); //is this right? should it be selection, selection+1?
            var data = {
                id: gameID,
                card: cardSlice[0]
            };
            serverSocket.emit("submit-card", data);
            UserCards.openToSubmit = false;
        }
    });

    $('.card').on('click', function() {
        if (UserCards.openToSubmit === true) {
            $('.active-card').animate({'margin-top': '+=50px'}, 500);
            $('.active-card').removeClass('active-card');
            $(this).addClass('active-card');
            $('.active-card').animate({'margin-top': '-=50px'}, 500);
        }
    });
} //end jquery

//************Handling Socket events*********************
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


serverSocket.on("winner", function(data) {
    console.log("You are the winner!");
    var numCards = data.length;
    for (var i = 0; i < numCards; i++) {
        UserCards.push(data[i]);
    }
    $('.active-card').animate({'margin-top': '+=50px'}, 500);
    $('.active-card').removeClass('active-card');
    display3Cards();
});

serverSocket.on("alertwinner", function(data) {
    alert("The winner is " + data);
    display3Cards();
});

serverSocket.on("switchToGame", function(game) {
    console.log("switchToGame " + game);
    $("[name='txtGame']").val(game.id);
    $('#playerList').html('');
        updatePlayerNames(game);
    $('#main,#board').toggleClass("clsHidden");
    $('#board').data('gameID', game.id);

});

serverSocket.on("updatePlayerList", updatePlayerNames);

serverSocket.on("cardDecks", function(cards) {
    UserCards = cards;
    console.dir(UserCards);
    display3Cards();
    UserCards.openToSubmit = true;
    $('body').append('<div id="submit_card">Submit Card!</div>');
});


//on disconnect remove player from game


//will update the player list to the player list in the passed in game
function updatePlayerNames(game) {
    console.log(game);
    var playerListLength = game.Players.length;
    $('#playerList').html('');
    for (var i = 0; i < playerListLength; i++) {
        $('#playerList').append('<li></li>')
        .find("li:last").text(game.Players[i].name);
            //so that the names are escaped
    }
}


function display3Cards() {
    for (var i = 0; i < 3; i++) {
        $('#card' + (i +1) ).css('background-image', 'url(' + getCardSVG(UserCards[i]) + ')');
    }
}

//takes card, returns url to SVG of the card
function getCardSVG(card){
    var suit = card.suit.toUpperCase().slice(0,1) // first letter, capitalized
    var folder = suit + card.suit.slice(1,card.suit.length) + 's'; //^ + rest of suit name + s
    var name;
    if (card.value >= 9){ //if it's a face card
        name = card.name.slice(0,1);
    } else {
        var name = card.name;
    }
    var url = "Cards/" + folder + "/" + name + suit + ".svg"
    return url;
}