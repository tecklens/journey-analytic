import {JaSdk} from "./ja-sdk";

declare global {
  interface Window {
    navigator:any;
    ja: JaSdk;
  }
}