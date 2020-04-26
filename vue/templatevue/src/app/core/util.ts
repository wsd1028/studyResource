import {Config} from "./config";
import Ajax from 'axios';

export class Util {
  constructor() {
  }

  static getImageFullUrl(url: string): string {
    return `${Config.baseUrl}${url}?r=${Math.random()}`;
  }
}
