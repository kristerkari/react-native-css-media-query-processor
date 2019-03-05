# React Native CSS Media Query processor

![Platform - Android and iOS](https://img.shields.io/badge/platform-Android%20%7C%20iOS-blue.svg)
[![NPM version](http://img.shields.io/npm/v/react-native-css-media-query-processor.svg)](https://www.npmjs.org/package/react-native-css-media-query-processor)
[![Build Status](https://travis-ci.org/kristerkari/react-native-css-media-query-processor.svg?branch=master)](https://travis-ci.org/kristerkari/react-native-css-media-query-processor)
[![Build status](https://ci.appveyor.com/api/projects/status/1itowtpn7a51rc5x/branch/master?svg=true)](https://ci.appveyor.com/project/kristerkari/react-native-css-media-query-processor/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/kristerkari/react-native-css-media-query-processor/badge.svg?branch=master)](https://coveralls.io/github/kristerkari/react-native-css-media-query-processor?branch=master)
![Size](https://img.shields.io/bundlephobia/minzip/react-native-css-media-query-processor.svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

Match style objects containing CSS Media Queries with React Native

> This library is based on [React Native Extended StyleSheet](https://github.com/vitalets/react-native-extended-stylesheet)'s CSS Media Queries implementation.

## Installation

```
npm install react-native-css-media-query-processor --save-dev
```

or

```
yarn add react-native-css-media-query-processor --dev
```

## Usage

This library takes parsed CSS with media queries and matches it during runtime with React Native's current device dimensions and device orientation.

To minimize runtime performance hit, the media queries must be parsed already before calling `process` function. Have a look at the example to see how the parsed syntax looks like.

You can use this library together with [css-to-react-native-transform](https://github.com/kristerkari/css-to-react-native-transform) to transform a string of CSS containing media queries to an React Native style object.

Notice that there is no syntax validation for CSS media queries. This is done to ensure that the media query matching is as fast as possible. If you want to validate syntax for the media queries, you should do that when they are parsed to style objects (that's what [css-to-react-native-transform](https://github.com/kristerkari/css-to-react-native-transform) does).

### Example

Given that React Native returns the following dimensions:

```js
import { Dimensions } from "react-native";
Dimensions.get("window");
// => { width: 110, height: 100 }
```

This is a simplified example of how the CSS gets transformed in to a React Native compatible style object:

`App.css`:

```css
.foo {
  color: red;
  margin-top: 1px;
}

.bar {
  font-size: 1rem;
}

@media (min-width: 50px) and (max-width: 150px) {
  .foo {
    color: blue;
  }
  .bar {
    font-size: 2rem;
  }
}
```

↓ ↓ ↓ ↓ ↓ ↓

```js
import styles from "./App.css";
import transform from "css-to-react-native-transform";

transform(styles, { parseMediaQueries: true });
```

↓ ↓ ↓ ↓ ↓ ↓

```js
const styleObject = {
  __mediaQueries: {
    "@media (min-width: 50px) and (max-width: 150px)": [
      {
        inverse: false,
        type: "all",
        expressions: [
          { modifier: "min", feature: "width", value: "50px" },
          { modifier: "max", feature: "width", value: "150px" }
        ]
      }
    ]
  },
  foo: {
    color: "red",
    marginTop: 1
  },
  bar: {
    fontSize: 16
  },
  "@media (min-width: 50px) and (max-width: 150px)": {
    foo: {
      color: "blue"
    },
    bar: {
      fontSize: 32
    }
  }
};
```

↓ ↓ ↓ ↓ ↓ ↓

```js
import { process } from "react-native-css-media-query-processor";
import { Dimensions } from "react-native";

const win = Dimensions.get("window");
const matchObject = {
  width: win.width,
  height: win.height,
  orientation: win.width > win.height ? "landscape" : "portrait",
  "aspect-ratio": win.width / win.height,
  type: "screen"
};

process(styleObject, matchObject);
```

↓ ↓ ↓ ↓ ↓ ↓

```js
{
  foo: {
    color: "blue",
    marginTop: 1
  },
  bar: {
    fontSize: 32
  }
}
```

## Dependencies

- [deepmerge](https://github.com/KyleAMathews/deepmerge) - A library for deep (recursive) merging of Javascript objects (UMD bundle is 593B minified+gzipped)
- [micro-memoize](https://github.com/planttheidea/micro-memoize) - A tiny, crazy fast memoization library for the 95% use-case
