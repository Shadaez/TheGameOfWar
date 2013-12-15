var serverSocket = io.connect("http://localhost");
var UserCards;
var Hand = [];
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

    $('#choosen').on('click', function() {
        alert("chossed");
        if (UserCards.openToSubmit === true) {
            var selection = $('.active-card').data('index');
            var gameID = $("#txtGame").html();
            var cardSlice = UserCards.splice(selection, 1);
            var data = {
                id: gameID,
                card: Hand[selection],
                cardsLeft: UserCards.length
            };
            serverSocket.emit("submit-card", data);
            UserCards.openToSubmit = false;
        }
    });

    $('.card').on('click', function() {
        if (UserCards.openToSubmit === true) {
            //if clicked = .active-card just slide down and deactivate
            if($(this)[0] === $('.active-card')[0]){
                $('.active-card').animate({'top': '+=50px'}, 500);
                $('.active-card').removeClass('active-card');
            } else {
                $('.active-card').animate({'top': '+=50px'}, 500);
                $('.active-card').removeClass('active-card');
                $(this).addClass('active-card');
                $('.active-card').animate({'top': '-=50px'}, 500);
            }
        }
    });

    $('.card').slideToggle();
    
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

function getCardShort(card){
    var suit = card.suit.toUpperCase().slice(0,1)
    var name;
    var symbols = {
        H: "♥",
        S: "♠",
        C: "♣",
        D: "♦"
    }
    if (card.value >= 9){ //if it's a face card
        name = card.name.slice(0,1);
    } else {
        name = card.name;
    }

    return name + symbols[suit]
}

function display3Cards() {
    UserCards.openToSubmit = true;
    for (var i = 0; i < 3; i++) {
        Hand.push(UserCards.pop());
        console.log(Hand);
        $('#card' + (i +1) ).css('background-image', 'url(' + Hand[i].url + ')');
    }
    $('#numberOfCards').html('Cards Left: ' + UserCards.length);
}

function drawACard() {
    UserCards.openToSubmit = true;
    var selection = $('.active-card').data('index');
    var newcard = UserCards.pop();
    Hand[selection] = newcard;
    $('.active-card').css('background-image', 'url(' + Hand[selection].url + ')')
    $('.active-card').animate({'top': '+=50px'}, 500);
    $('.active-card').removeClass('active-card');
}

function updatePlayerNames(game) {
    $('#playerList').html('');
    var playerListLength = game.Players.length;
    $('#nPlayers').html(playerListLength);
    $('#playerList').append('<li class="nav-header">Players in Game</li>');
    for (var i = 0; i < playerListLength; i++) {
       // $('#playerList').append('<li></li>')
        //.find("li:last").text(game.Players[i].name);//so that the names are escaped
        var checked = ''
        if(game.Players[i].ready){
            checked = "checked = 'checked'"
        }
        $('#playerList').append('<li><input class="ready" type="checkbox" '+ checked +' disabled = "disabled" ></input><div class = "lastCard"></div><div class = "cardsLeft"></div><div class="name"></div><div class="message"></div></li>')
        .find("li:last").find('.name').text(game.Players[i].name);
        if(game.Players[i].lastCard){
            $('#playerList').find("li:last").find('.lastCard').text(getCardShort(game.Players[i].lastCard));
        }
        if(game.Players[i].cardsLeft){
            $('#playerList').find("li:last").find('.cardsLeft').text(game.Players[i].cardsLeft);
        }
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
            $('#gameListInProgress').append('<span class="btn" name="Active' + gameList[i].id  +'">' + gameList[i].id + '</span>');
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

//on disconnect remove player from game
serverSocket.on("playerLeft", function(cont){
    if(cont){
        alert("A player has left. The game will continue without them.");
    } else {
        alert("A player has left. There are not enough players to continue. You win by default.");
        gameOver();
    }
});
