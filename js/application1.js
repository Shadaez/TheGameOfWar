var serverSocket = io.connect("http://localhost");
var UserCards;
var Hand = [];
$(ready);

function ready() { //start jQuery
    function intializePage(){
        //hides board elements initially
        $("#startGame,#board,#chat").hide();
    }

    intializePage();

    $("#create").on("click", function(event) {
        var player = $("[name='playerName']").val();
        $("#txtName").html(player);
        if (player.length > 0) {
            serverSocket.emit("create", {playerName: player});
        }else{
            $("#playerName").focus();
        }
    }); 

    $('#deal').on('click', function() {
        var gameID = $("#txtGame").html();
        var playerListLength = parseInt($('#nPlayers').html());
        if (playerListLength<=1){
            alert("Need minimum 2 players to begin a game");
        }else{
            serverSocket.emit("deal", gameID);
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

    $('#choosen').on('click', function() {
        console.log('Submit button clicked');
        if (UserCards.openToSubmit === true) {
            var selection = $('.active-card').data('index');
            var gameID = $('#txtGame').html();
            var data = {
                id: gameID,
                card: Hand[selection],
                cardsLeft: UserCards.length
            };
            console.log(data);
            serverSocket.emit("submit-card", data);
            UserCards.openToSubmit = false;
        }
    });

    $('#sendMessage').on('click', function() {
        var player = $("#txtName").html();
        var gameID=$("#txtGame").html();
        var msg=$("#txtMessage").val();
        if (msg.length > 0) {
            serverSocket.emit("sendMessage", {playerName: player,gameID:gameID,message:msg});
        }else{
            $("#txtMessage").focus();
        }
    });

   
} //end jquery

//************Handling Socket events*********************
function joinEventHandler(){
    var id=$(this).val();
    var player = $("[name='playerName']").val();
    $("#txtName").html(player);
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
       // $('#playerList').append('<li></li>')
       //  .find("li:last").text(game.Players[i].name);//so that the names are escaped
       var checked = ''
        if(game.Players[i].ready){
            checked = "checked = 'checked'"
        }
        $('#playerList').append('<li><div class="name"></div><input class="ready" type="checkbox" '+ checked +' disabled = "disabled" ></input><div class = "lastCard"></div><div class = "cardsLeft"></div></li>')
        .find("li:last").find('.name').text(game.Players[i].name);
        if(game.Players[i].lastCard){
            $('#playerList').find("li:last").find('.lastCard').text(getCardShort(game.Players[i].lastCard));
        }
        if(game.Players[i].cardsLeft){
            $('#playerList').find("li:last").find('.cardsLeft').text(game.Players[i].cardsLeft);
        }
        
    }
}

function display3Cards() {
    UserCards.openToSubmit = true;
    for (var i = 0; i < 3; i++) {
        Hand.push(UserCards.pop());
        $('#card' + (i +1) ).css('background-image', 'url(' + Hand[i].url + ')');
    }
    $("#nCards").html(UserCards.length);
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

function gameOver(){
    //move back to home page, or maybe simply refresh page?
    //just refresh page for now
    location.reload();
}

//************Handling Socket events*********************
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
    $("#txtGame").html(game.id);
    $("#txtName").html($(playerName).val());
    updatePlayerNames(game);
    $("#startGame,#board,#createJoinGame,#welcome,#chat").toggle();
});

serverSocket.on("cardDecks", function(cards) {
    UserCards = cards;
    console.dir(UserCards);
    $("#nCards").html(UserCards.length);
    $(".card").slideToggle();
    display3Cards();
    $("#PlayFrm p").toggle();
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

serverSocket.on("addChat", function(data){
    console.log(data);
    var msg=$(txtChat).val() + data.playerName + ":" + data.message + "\n" ;
    $(txtChat).val(msg);
});

