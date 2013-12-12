var Deck = {};

Deck.Cards = function () { return [

	/* ------ club ------ */
	{
		value:0,
		name:"2",
		suit:"club"
	},
	{
		value:1,
		name:"3",
		suit:"club"
	},
	{
		value:2,
		name:"4",
		suit:"club"
	},
	{
		value:3,
		name:"5",
		suit:"club"
	},
	{
		value:4,
		name:"6",
		suit:"club"
	},
	{
		value:5,
		name:"7",
		suit:"club"
	},
	{
		value:6,
		name:"8",
		suit:"club"
	},
	{
		value:7,
		name:"9",
		suit:"club"
	},
	{
		value:8,
		name:"10",
		suit:"club"
	},
	{
		value:9,
		name:"Jack",
		suit:"club"
	},
	{
		value:10,
		name:"Queen",
		suit:"club"
	},
	{
		value:11,
		name:"King",
		suit:"club"
	},
	{
		value:12,
		name:"Ace",
		suit:"club"
	},
	
	/* ----- spade ----- */
	{
		value:0,
		name:"2",
		suit:"spade"
	},
	{
		value:1,
		name:"3",
		suit:"spade"
	},
	{
		value:2,
		name:"4",
		suit:"spade"
	},
	{
		value:3,
		name:"5",
		suit:"spade"
	},
	{
		value:4,
		name:"6",
		suit:"spade"
	},
	{
		value:5,
		name:"7",
		suit:"spade"
	},
	{
		value:6,
		name:"8",
		suit:"spade"
	},
	{
		value:7,
		name:"9",
		suit:"spade"
	},
	{
		value:8,
		name:"10",
		suit:"spade"
	},
	{
		value:9,
		name:"Jack",
		suit:"spade"
	},
	{
		value:10,
		name:"Queen",
		suit:"spade"
	},
	{
		value:11,
		name:"King",
		suit:"spade"
	},
	{
		value:12,
		name:"Ace",
		suit:"spade"
	},

	/* ----- heart ----- */
	{
		value:0,
		name:"2",
		suit:"heart"
	},
	{
		value:1,
		name:"3",
		suit:"heart"
	},
	{
		value:2,
		name:"4",
		suit:"heart"
	},
	{
		value:3,
		name:"5",
		suit:"heart"
	},
	{
		value:4,
		name:"6",
		suit:"heart"
	},
	{
		value:5,
		name:"7",
		suit:"heart"
	},
	{
		value:6,
		name:"8",
		suit:"heart"
	},
	{
		value:7,
		name:"9",
		suit:"heart"
	},
	{
		value:8,
		name:"10",
		suit:"heart"
	},
	{
		value:9,
		name:"Jack",
		suit:"heart"
	},
	{
		value:10,
		name:"Queen",
		suit:"heart"
	},
	{
		value:11,
		name:"King",
		suit:"heart"
	},
	{
		value:12,
		name:"Ace",
		suit:"heart"
	},

	/* ----- diamond ----- */
	{
		value:0,
		name:"2",
		suit:"diamond"
	},
	{
		value:1,
		name:"3",
		suit:"diamond"
	},
	{
		value:2,
		name:"4",
		suit:"diamond"
	},
	{
		value:3,
		name:"5",
		suit:"diamond"
	},
	{
		value:4,
		name:"6",
		suit:"diamond"
	},
	{
		value:5,
		name:"7",
		suit:"diamond"
	},
	{
		value:6,
		name:"8",
		suit:"diamond"
	},
	{
		value:7,
		name:"9",
		suit:"diamond"
	},
	{
		value:8,
		name:"10",
		suit:"diamond"
	},
	{
		value:9,
		name:"Jack",
		suit:"diamond"
	},
	{
		value:10,
		name:"Queen",
		suit:"diamond"
	},
	{
		value:11,
		name:"King",
		suit:"diamond"
	},
	{
		value:12,
		name:"Ace",
		suit:"diamond"
	}
];}

Deck.Shuffle = function () {
	var shuffledDeck = [];

	function shuffle(o){ //v1.0
	    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	    return o;
	};

	shuffledDeck = shuffle(new Deck.Cards);
	return shuffledDeck;
}


Deck.Deal = function (numPlayers) {
	var userCards = [];
	var shuffledDeck = Deck.Shuffle();
	var numCards = Math.floor(52/numPlayers);
	console.log(numCards);

	for (var i = 0; i < numPlayers; i++) {
		userCards[i] = shuffledDeck.splice(0, numCards);
	}
	return userCards;
}

Deck.Compare = function () {
	//expects any number of arguments in the following format
	// {playername: 'Name',
	// 	card: {
	// 		value:5,
	// 		name:"2",
	// 		suit:"spade",
	// 	}};
	var maxCard = _.max(arguments, function (submission) {
		var suitValue;
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
}

module.exports = Deck;




