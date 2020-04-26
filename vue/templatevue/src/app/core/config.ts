export class Config {
  constructor(){
  }
  static get baseUrl(): string {
    return Config._baseUrl;
  }

  static get isDebug():string{
    return Config._isDebug;
  }

  /***生产环境****/
  // private static _isDebug="false";
  private static _baseUrl: string = "/Resource/Room2D";
  /***测试环境****/
  private static _isDebug="false";
  // private static _baseUrl: string = "/Resource/Room2D";
}