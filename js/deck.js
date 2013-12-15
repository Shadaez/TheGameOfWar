var _ = require("underscore");
var Deck = {};

function getCardSVG(card){
    var suit = card.suit.toUpperCase().slice(0,1) // first letter, capitalized
    var folder = suit + card.suit.slice(1,card.suit.length) + 's'; //^ + rest of suit name + s
    var name;
    if (card.value >= 9){ //if it's a face card
        name = card.name.slice(0,1);
    } else {
        var name = card.name;
    }
    var url = "Cards/" + folder + "/" + name + suit
    return url;
}

Deck.Cards = function () { 
	var cards=[];
	var cardName=["Jack","Queen","King","Ace"]
	var suits=["heart","spade","diamond","club"];
	for (var j=0;j<=3;j++){ //runs for each suit
		for (var i=0;i<=12;i++){ //runs for each card in a suit.
			var tmp ={};
			tmp.value=i;
			if ( i<9){
				tmp.name ="" + (2+i);
			}else{
				tmp.name= cardName[i%9];
			}
			tmp.suit=suits[j];
			tmp.url=getCardSVG(tmp);
			cards.push(tmp);
		}
	}
	return cards;
}

//generates a random number between 0 & 52 and swaps the card between i & random number.
Deck.Shuffle = function () {
	var shuffledDeck = new Deck.Cards;
    var tmp;
    for(var i=shuffledDeck.length-1; i>=0; i--){
        var j = Math.floor(Math.random() * shuffledDeck.length);
        tmp = shuffledDeck[i];
        shuffledDeck[i] = shuffledDeck[j];
        shuffledDeck[j] = tmp;
    }
	return shuffledDeck;
}

//splits the shuffled deck among the players evenly
Deck.Deal = function (numPlayers) {
	var userCards = [];
	var shuffledDeck = Deck.Shuffle();
	var numCards = Math.floor(52/numPlayers);

	for (var i = 0; i < numPlayers; i++) {
		userCards[i] = shuffledDeck.splice(0, numCards);
	}
	return userCards;
}

// expects a array of objects. Each object has name of player and a card object
//{card: {value:5,name:"2",suit:"spade"}};
Deck.Compare = function (cardArray) {
	console.log('card array');
	
	var maxCard = _.max(cardArray, function (submission) {
		var suitValue;
		console.log(submission.card.suit);
		switch (submission.card.suit) {
			case "spade":
				suitValue = .1;
				break;
			case "club":
				suitValue = .2;
				break;
			case "heart":
				suitValue = .3;
				break;
			case "diamond":
				suitValue = .4;
				break;
		}
		return (submission.card.value + suitValue);
	});
	console.log(maxCard);
	return maxCard;
}

module.exports = Deck;




