var serverSocket = io.connect("http://localhost");
var UserCards;
var Hand = [];
$(ready);

function ready() { //start jQuery

    $("#create").on("click", function() {
        var player = $("[name='playerName']").val();
        if (player.length <= 0) {
            alert("Please insert a name")
        } else {
            serverSocket.emit("create", {playerName: player});
        }
    });

    $('#deal').on('click', function() {
        //change deal button to submit card button
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
        //console.log('Submit button clicked');
        if (UserCards.openToSubmit === true) {
            var selection = $('.active-card').data('index');
            var gameID = $('#board').data('gameID');
            var data = {
                id: gameID,
                card: Hand[selection],
                cardsLeft: UserCards.length
            };
            $('.active-card').animate({'top': '-=5000px'}, 500, function(){
                serverSocket.emit("submit-card", data);
            });
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

serverSocket.on("notEnoughPlayers", function(data) {
    alert("There must be at least 2 players to begin a game");
});


serverSocket.on("winner", function(data) {
    console.log("You are the winner!");
    var numCards = data.length;
    for (var i = 0; i < numCards; i++) {
        UserCards.shift(data[i]);
    }
});

serverSocket.on("alertwinner", function(data) {
    alert("The winner is " + data); //lets highlight the player in list
    drawACard();
    //display3Cards(); //we need to only draw 1 more card and replace the .active-card div with it
});

serverSocket.on("switchToGame", function(game) {
    console.log("switchToGame " + game);
    $("[name='txtName']").val($("[name='playerName']").val())
    $("[name='txtGame']").val(game.id);
    $('#playerList').html('');
        updatePlayerNames(game);
    $('#GameFrm, #gameHeader, #board, #rules').slideToggle();
    $('#board').data('gameID', game.id);

});

serverSocket.on("updatePlayerList", updatePlayerNames);

serverSocket.on("cardDecks", function(cards) {
    UserCards = cards;
    $('#deal').slideToggle('200', function(){$("#submit_card").slideToggle('200')});
    //console.dir(UserCards);
    display3Cards();
    // $('#deal').addClass('clsHidden');
    // $('#submit_card').removeClass('clsHidden');
    //$('body').append('<div id="submit_card">Submit Card!</div>');
    //$('#submit_card')
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

//will update the player list to the player list in the passed in game
function updatePlayerNames(game) {
    var playerListLength = game.Players.length;
    $('#playerList').html('');
    for (var i = 0; i < playerListLength; i++) {
        var checked = ''
        if(game.Players[i].ready){
            checked = "checked = 'checked'"
        }
        $('#playerList').append('<li id="'+ game.Players[i].name +'"><input class="ready" type="checkbox" '+ checked +' disabled = "disabled" ></input><div class = "lastCard"></div><div class = "cardsLeft"></div><div class="name"></div><div class="message"></div></li>')
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
    }
    //pretty way to display cards:
    var cards = $('.card');
    $(cards[0]).css('background-image', 'url(' + getCardSVG(Hand[0]) + ')').slideToggle('400', function(){
        $(cards[1]).css('background-image', 'url(' + getCardSVG(Hand[1]) + ')').slideToggle('400', function(){
                $(cards[2]).css('background-image', 'url(' + getCardSVG(Hand[2]) + ')').slideToggle();
        });
    });
            
    $('#numberOfCards').html('Cards Left: ' + UserCards.length);
}

function drawACard() {
    UserCards.openToSubmit = true;
    var selection = $('.active-card').data('index');
    $('.active-card').animate({'top': '+=5050px'}, 500);
    if (UserCards.length >= 1){    
        var newcard = UserCards.pop();
        Hand[selection] = newcard;
        $('.active-card').css('background-image', 'url(' + getCardSVG(Hand[selection]) + ')').slideDown();
    } else {
        Hand[selection] = null;
    }
    $('.active-card').removeClass('active-card');
    //slide card down, card.data.set 3
}

//takes card, returns url to SVG of the card
function getCardSVG(card){
    var suit = card.suit.toUpperCase().slice(0,1) // first letter, capitalized
    var folder = suit + card.suit.slice(1,card.suit.length) + 's'; //^ + rest of suit name + s
    var name;
    if (card.value >= 9){ //if it's a face card
        name = card.name.slice(0,1);
    } else {
        name = card.name;
    }
    var url = "Cards/" + folder + "/" + name + suit + ".svg"
    return url;
}


//returns shorthand for card, such as "K♥" for king of hearts
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