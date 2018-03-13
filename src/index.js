import { Dimensions, Platform } from "react-native";
import mediaQuery from "css-mediaquery";
import { mediaQueryTypes } from "./types";
import { mediaQueryFeatures, dimensionFeatures } from "./features";

const PREFIX = "@media";
const lengthRe = /^(0$|(?:[+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?)(?=px|rem$))/;

function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

function isMediaQuery(str) {
  return typeof str === "string" && str.toLowerCase().indexOf(PREFIX) === 0;
}

export function process(obj) {
  const mqKeys = [];

  const res = Object.keys(obj).reduce((res, k) => {
    const key = k.trim();
    if (!isMediaQuery(key)) {
      res[key] = obj[key];
    } else {
      mqKeys.push(k);
    }
    return res;
  }, {});

  if (mqKeys.length) {
    const matchObject = getMatchObject();
    mqKeys.forEach(k => {
      const key = k.trim();
      const mqStr = key.toLowerCase().replace(PREFIX, "");
      const parsed = mediaQuery.parse(mqStr);

      parsed.forEach(mq => {
        if (mediaQueryTypes.indexOf(mq.type) === -1) {
          throw new Error(`Failed to parse media query type "${mq.type}"`);
        }

        mq.expressions.forEach(e => {
          const mf = e.modifier ? `${e.modifier}-${e.feature}` : e.feature;
          const val = e.value ? `: ${e.value}` : "";

          if (mediaQueryFeatures.indexOf(e.feature) === -1) {
            throw new Error(`Failed to parse media query feature "${mf}"`);
          }

          if (
            dimensionFeatures.indexOf(e.feature) > -1 &&
            lengthRe.test(e.value) === false
          ) {
            throw new Error(
              `Failed to parse media query expression "(${mf}${val})"`
            );
          }
        });
      });

      if (/^@media\s+(ios|android)/i.test(key)) {
        matchObject.type = Platform.OS;
      }

      const isMatch = mediaQuery.match(mqStr, matchObject);
      if (isMatch) {
        merge(res, obj[k]);
      }
    });
  }

  return res;
}

function getMatchObject() {
  const win = Dimensions.get("window");
  return {
    width: win.width,
    height: win.height,
    orientation: win.width > win.height ? "landscape" : "portrait",
    "aspect-ratio": win.width / win.height,
    type: "screen"
  };
}

function merge(obj, mqObj) {
  Object.keys(mqObj).forEach(k => {
    const key = k.trim();
    if (isObject(obj[key]) && isObject(mqObj[key])) {
      Object.assign(obj[key], mqObj[key]);
    } else {
      obj[key] = mqObj[key];
    }
  });
}
