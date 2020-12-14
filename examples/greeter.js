// function greeter(person) {
//   return 'Hello ' + person
// }
// let user = 'Young'
// console.log(greeter(user))
var deck = {
    suit: ['♦', '♣', '♥', '♠'],
    cards: Array(52),
    createCardPicker: function () {
        var _this = this;
        return function () {
            var pickedCard = Math.ceil(Math.random() * 52);
            var pickedSuit = Math.floor(pickedCard / 13);
            return {
                suit: _this.suit[pickedSuit],
                card: pickedCard % 13
            };
        };
    }
};
var cardPicker = deck.createCardPicker();
var pickerCard = cardPicker();
console.log("\u62BD\u5230\u7684\u6251\u514B\u724C\u662F" + pickerCard.suit + "  " + pickerCard.card); // 报错 this指向 
