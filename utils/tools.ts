import { CSSProperties } from "react";
import anime from "animejs"

interface customStyle extends CSSProperties {
  [key: number]: string;
  [key: string]: any;
  length: number;
}

export function getCSSVar(Var: string, style: Element = document.body) {
  return getComputedStyle(style).getPropertyValue(Var);
}

export function getStyle(
  selector: string,
  element?: Element
): { [key: string]: string } | undefined {
  let stylesheets = document.styleSheets;
  let style: customStyle | undefined = undefined;

  for (let i = 0; i < stylesheets.length; i++) {
    let stylesheet = stylesheets.item(i);

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
    console.log(value);

    if (value.startsWith("var(") && value.endsWith(")")) {
      value = value.replace("var(", "").replace(")", "");

      console.log("Getting name", value);

      console.log("Element is", element);

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
  return anime({
    targets: element.children,
    direction: "alternate",
    delay: function (_el, i, _l) {
      return i * 25;
    },
    duration: 500,
    loop: false,
    easing: "easeInOutExpo",
    ...toAnimate,
  });
}
