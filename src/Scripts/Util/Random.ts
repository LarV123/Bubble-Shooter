
export default class Random {
  // inclusive (min - (max-1))
  static getRandomInteger(min : number, max : number) : number{
    let randomNumber = Math.random() * (max-min);
    return Math.floor(min + randomNumber);
  }
}