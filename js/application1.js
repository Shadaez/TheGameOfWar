var serverSocket = io.connect("http://localhost");
var UserCards;

$(ready);

function ready() { //start jQuery
    function intializePage(){
        //hides all the elements.
        $("#startGame,#gameDetails,#board").hide();
    }

    intializePage();

    $("#create").on("click", function(event) {
        var player = $("[name='playerName']").val();
        if (player.length > 0) {
            serverSocket.emit("create", {playerName: player});
        }else{
            $("#playerName").focus();
        }
    }); 

    $('#deal').on('click', function() {
        var gameID = $("#txtGame").html();
        var playerListLength = parseInt($('#nPlayers').html());
        if (playerListLength===1){
            alert("Need minimum 2 players to begin a game");
        }else{
            serverSocket.emit("deal", gameID);
        }
    });  

   
} //end jquery

//************Handling Socket events*********************
function joinEventHandler(){
    var id=$(this).val();
    var player = $("[name='playerName']").val();
    if (player.length > 0) {
        serverSocket.emit("join", {playerName: player,gameID: id});
    }else{
        $("#playerName").focus();
    }
}



function updatePlayerNames(game) {
    $('#playerList').html('');
    var playerListLength = game.Players.length;
    $('#nPlayers').html(playerListLength);
    $('#playerList').append('<li class="nav-header">Players in Game</li>');
    for (var i = 0; i < playerListLength; i++) {
       $('#playerList').append('<li></li>')
        .find("li:last").text(game.Players[i].name);//so that the names are escaped
        
    }
}

serverSocket.on("updateGameList", function(gameList) {
    $('#gameListJoin').html('').append("<h5>Games to Join</h5>");
    $('#gameListInProgress').html('').append("<h5>Games in progress</h5>");
    console.dir("games received");
    console.dir(gameList);
    var gameListLength = gameList.length;
    for (var i = 0; i < gameListLength; i++) {
        if (gameList[i].openToJoin) {
            var id="join" + gameList[i].id;
            $('#gameListJoin').append('<input type="button" id="' + id +'" value="'+ gameList[i].id + '" class="btn"/>');         
            $("#" +id).on("click",joinEventHandler);
        }else{
            $('#gameListInProgress').append('<input type="button" id=active"' + gameList[i].id +'" value="'+ gameList[i].id + '" class="btn"/>');
        }
    }
});

serverSocket.on("updatePlayerList", function(game) {
    updatePlayerNames(game);
});

serverSocket.on("switchToGame", function(game) {
    console.log("switchToGame");
    console.log(game);
    $("#txtGame").html(game.id);
    updatePlayerNames(game);
    $("#startGame,#gameDetails,#board,#createJoinGame,#welcome").toggle();
    //$('#board').data('gameID', game.id);
});

serverSocket.on("cardDecks", function(cards) {
    UserCards = cards;
    console.dir(UserCards);
    $("#nCards").html(UserCards.length);
    display3Cards();
    UserCards.openToSubmit = true;
    $("#PlayFrm p").toggle();
    //$('body').append('<div id="submit_card">Submit Card!</div>');

    $('#board').on('click', '.card', function() {
        if (UserCards.openToSubmit === true) {
            $('.active-card').removeClass('active-card');
            $(this).addClass('active-card');
        }
    });
});

serverSocket.on("winner", function(data) {
    console.log("You are the winner!");
    var numCards = data.length;
    for (var i = 0; i < numCards; i++) {
        UserCards.shift(data[i]);
    }
});

serverSocket.on("alertwinner", function(data) {
    alert("The winner is " + data);
    drawACard();
    //display3Cards(); //we need to only draw 1 more card and replace the .active-card div with it
});


