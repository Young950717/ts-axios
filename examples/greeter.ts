// function greeter(person) {
//   return 'Hello ' + person
// }
// let user = 'Young'
// console.log(greeter(user))

// let decLiteral: number = 20
// let hexLiteral: number = 0x14
// let binaryLiteral: number = 0b10100
// let octalLiteral: number = 0o24

// let name: string = 'young'
// name = 'test'

// let list: number[] = [1, 2, 3]

// let x: [string, number]
// x = ['helle', 1]

// 断言
// let somevalues: any = 'somevalues'
// let strlength: number = (somevalues as string).length
// let strlength: number = somevalues.length

// 类 => 实例部分 属性方法  静态部分 构造器

// interface ClockInterface {
//   date: Date,
//   setDate(d: Date)
// }

// interface ClockConstructor {
//   new(hour: number, minute: number)
// }
// class Clock implements ClockInterface {
// // class Clock implements ClockConstructor {  // 报错
//   date: Date
//   constructor(a: number, b: string) {
//     console.log(a, b)

//   }
//   setDate(d: Date) {
//     this.date = d
//   }
// }

// interface ClockInterface {
//   tick(): void
// }
// interface ClockConstructor {
//   new(hour: number, minute: number): ClockInterface
// }

// function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
//   return new ctor(hour, minute)
// }

// class DigitalClcok implements ClockInterface {
//   constructor(hour: number, minute: number) {

//   }
//   tick(): void {
//     console.log('di di di')
//   }
// }
// class AnalogClcok implements ClockInterface {
//   constructor(hour: number, minute: number) {

//   }
//   tick(): void {
//     console.log('beep beep beep')
//   }
// }

// let digital = createClock(DigitalClcok, 1, 20)
// let analog = createClock(AnalogClcok, 2, 40) 

// 混合类型
// interface Counter {
//   (start: number): string
//   interval: string,
//   reset(): void
// }

// function getCounter(): Counter {
//   let counter = (function (start: number) {
//     return `${start}`
//   }) as Counter
//   counter.interval = 'young'
//   counter.reset = function () {
//     console.log('omg')
//   }
//   return counter
// }

// let c = getCounter()
// c.reset()
// console.log(c.interval)
// c(10)

// this参数
// 1. 不用this参数
// let deck = {
//   suit: ['♦', '♣', '♥', '♠'],
//   cards: Array(52),
//   createCardPicker: function () {
//     return function () {
//       let pickedCard = Math.floor(Math.random() * 52)
//       let pickedSuit = Math.floor(pickedCard / 13)
//       return {
//         suit: this.suit[pickedSuit],
//         card: pickedCard % 13
//       }
//     }
//   }
// }
// let cardPicker = deck.createCardPicker()
// let pickerCard = cardPicker()
// console.log(`抽到的扑克牌是${pickerCard.suit}${pickerCard.card}`) // 报错 this指向 

// // 1.1 使用箭头函数调整
// let deck = {
//   suit: ['♦', '♣', '♥', '♠'],
//   cards: Array(52),
//   createCardPicker: function () {
//     return () => {
//       let pickedCard = Math.floor(Math.random() * 52)
//       let pickedSuit = Math.floor(pickedCard / 13)
//       return {
//         suit: this.suit[pickedSuit],
//         card: pickedCard % 13
//       }
//     }
//   }
// }
// let cardPicker = deck.createCardPicker()
// let pickerCard = cardPicker()
// console.log(`抽到的扑克牌是${pickerCard.suit}${pickerCard.card}`) // 报错 this指向 

// 1.2 使用this参数 fake
interface Card {
  suit: string,
  card: number
}
interface Deck {
  suit: string[],
  cards: number[],
  createCardPicker(this: Deck): () => Card
}
let deck: Deck = {
  suit: ['♦', '♣', '♥', '♠'],
  cards: Array(52),
  createCardPicker: function (this: Deck) {
    return () => {
      let pickedCard = Math.ceil(Math.random() * 52)
      let pickedSuit = Math.floor(pickedCard / 13)
      return {
        suit: this.suit[pickedSuit],
        card: pickedCard % 13
      }
    }
  }
}
let cardPicker = deck.createCardPicker()
let pickerCard = cardPicker()
console.log(`抽到的扑克牌是${pickerCard.suit}  ${pickerCard.card}`) // 报错 this指向 
