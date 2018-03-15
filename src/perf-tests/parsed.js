import mediaQuery from "./mq.js";
import merge from "deepmerge";
import memoize from "micro-memoize";

const PREFIX = "@media";

function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

function isMediaQuery(str) {
  return typeof str === "string" && str.indexOf(PREFIX) === 0;
}

function filterMq(obj) {
  return Object.keys(obj).filter(key => isMediaQuery(key));
}

function filterNonMq(obj) {
  return Object.keys(obj)
    .filter(key => !isMediaQuery(key))
    .reduce((out, key) => {
      out[key] = obj[key];
      return out;
    }, {});
}

const mFilterMq = memoize(filterMq);
const mFilterNonMq = memoize(filterNonMq);

export function process(obj, matchObject, Platform) {
  const mqKeys = mFilterMq(obj);
  let res = mFilterNonMq(obj);

  if (!mqKeys.length) {
    return res;
  }

  mqKeys.forEach(key => {
    if (/^@media\s+(ios|android)/i.test(key)) {
      matchObject.type = Platform.OS;
    }

    const isMatch = mediaQuery.match(obj.__mediaQueries[key], matchObject);
    if (isMatch) {
      res = merge(res, obj[key]);
    }
  });

  return res;
}
