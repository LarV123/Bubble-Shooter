export default class ScoreSystem {

  private static instance : ScoreSystem;

  static getInstance() : ScoreSystem{
    if(this.instance == null){
      this.instance = new ScoreSystem();
      this.instance.reset();
    }
    return this.instance;
  }

  private score : number;

  reset() : void{
    this.score = 0;
  }

  addScore(score : number):void{
    this.score += score;
  }

  setScore(score : number):void{
    this.score = score;
  }

  getScore():number{
    return this.score;
  }

}