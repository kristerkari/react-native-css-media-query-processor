import mediaQuery from "css-mediaquery";
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

const mMatch = memoize(mediaQuery.match);
const mFilterMq = memoize(filterMq);
const mFilterNonMq = memoize(filterNonMq);

export function process(obj, matchObject, Platform) {
  const mqKeys = mFilterMq(obj);
  const res = mFilterNonMq(obj);

  if (!mqKeys.length) {
    return res;
  }

  let newRes;

  mqKeys.forEach(key => {
    const mqStr = key.replace(PREFIX, "");

    if (/^@media\s+(ios|android)/i.test(key)) {
      matchObject.type = Platform.OS;
    }

    const isMatch = mMatch(mqStr, matchObject);
    if (isMatch) {
      newRes = merge(res, obj[key]);
    }
  });

  return newRes;
}
