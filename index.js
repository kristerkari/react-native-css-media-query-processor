import { Dimensions, Platform } from "react-native";
import mediaQuery from "css-mediaquery";

const PREFIX = "@media";

function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

function isMediaQuery(str) {
  return typeof str === "string" && str.indexOf(PREFIX) === 0;
}

export function process(obj) {
  const mqKeys = [];

  // copy non-media-query stuff
  const res = Object.keys(obj).reduce((res, key) => {
    if (!isMediaQuery(key)) {
      res[key] = obj[key];
    } else {
      mqKeys.push(key);
    }
    return res;
  }, {});

  // apply media query stuff
  if (mqKeys.length) {
    const matchObject = getMatchObject();
    mqKeys.forEach(key => {
      const mqStr = key.replace(PREFIX, "");
      if (/^@media (ios|android)/i.test(key.trim())) {
        matchObject.type = Platform.OS;
      }
      const isMatch = mediaQuery.match(mqStr, matchObject);
      if (isMatch) {
        merge(res, obj[key]);
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
  Object.keys(mqObj).forEach(key => {
    if (isObject(obj[key]) && isObject(mqObj[key])) {
      Object.assign(obj[key], mqObj[key]);
    } else {
      obj[key] = mqObj[key];
    }
  });
}
