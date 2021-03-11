import anime from "animejs";
import { CSSProperties } from "react";
import { Response } from "superagent";

interface customStyle extends CSSProperties {
  [key: number]: string;
  [key: string]: any;
  length: number;
}

export function getCSSVar(Var: string, style: Element = document.body) {
  return getComputedStyle(style).getPropertyValue(Var).split(" ").join("");
}

interface customStylesheet extends StyleSheet {
  [key: string]: any
}

export function getStyle(
  selector: string,
  element?: Element
): { [key: string]: string } | undefined {
  let stylesheets = document.styleSheets;
  let style: customStyle | undefined = undefined;

  for (let i = 0; i < stylesheets.length; i++) {
    let item = stylesheets.item(i);
    if (item === null) continue;

    let stylesheet: customStylesheet = item;

    if (stylesheet === null) continue;

    for (let i = 0; i < stylesheet.cssRules.length; i++) {
      let rule: any = stylesheet.cssRules.item(i);
      if (selector === rule.selectorText) {
        style = rule.style;
      }
    }
  }

  if (style === undefined) return;

  let rules: { [key: string]: string } = {};

  for (let i = 0; i < style.length; i++) {
    let ruleName: string = style[i];
    let anyValue = style[ruleName];
    let value = ("" + anyValue).split(" ").join("");

    if (value.startsWith("var(") && value.endsWith(")")) {
      value = value.replace("var(", "").replace(")", "");

      value = getCSSVar(value, element);
    }

    value = value.split(" ").join("");

    rules[ruleName] = value;
  }

  return rules;
}

interface animateProp {
  [key: string]: string;
}

export function getAnimation(element: Element, toAnimate: animateProp) {
  if (!isNull(toAnimate["font-size"]))
    if (toAnimate["font-size"] === "0px")
      toAnimate["font-size"] = "0rem";
  return anime({
    targets: element.children,
    direction: "alternate",
    delay: function (_el, i, _l) {
      return i * 25;
    },
    duration: 250,
    loop: false,
    easing: "easeInOutExpo",
    ...toAnimate,
  });
}
export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function isNull(obj: any) {
  return obj === undefined || obj === null;
}

export interface DiscordRefresh {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface RejectType {
  status: number,
  response: Response
}

export interface JSONObject {
  [key: string]: any
}

export function diff(obj1: JSONObject, obj2: JSONObject) {

  // Make sure an object to compare is provided
  if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
    return obj1;
  }
  var diffs: JSONObject = {};
  var key: string;
  var arraysMatch = function (arr1: any[], arr2: any[]) {
    if (arr1.length !== arr2.length) return false;
    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;

  };
  var compare = function (item1: any, item2: any, key: string) {
    var type1 = Object.prototype.toString.call(item1);
    var type2 = Object.prototype.toString.call(item2);
    if (type2 === '[object Undefined]') {
      diffs[key] = null;
      return;
    }
    if (type1 !== type2) {
      diffs[key] = item2;
      return;
    }
    if (type1 === '[object Object]') {
      var objDiff = diff(item1, item2);
      if (Object.keys(objDiff).length > 0) {
        diffs[key] = objDiff;
      }
      return;
    }
    if (type1 === '[object Array]') {
      if (!arraysMatch(item1, item2)) {
        diffs[key] = item2;
      }
      return;
    }
    if (type1 === '[object Function]') {
      if (item1.toString() !== item2.toString()) {
        diffs[key] = item2;
      }
    } else {
      if (item1 !== item2) {
        diffs[key] = item2;
      }
    }

  };
  for (key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      compare(obj1[key], obj2[key], key);
    }
  }
  for (key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key];
      }
    }
  }
  return diffs;
};