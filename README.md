# React Native CSS Media Query processor

[![Build Status](https://travis-ci.org/kristerkari/react-native-css-media-query-processor.svg?branch=master)](https://travis-ci.org/kristerkari/react-native-css-media-query-processor)
[![Build status](https://ci.appveyor.com/api/projects/status/1itowtpn7a51rc5x/branch/master?svg=true)](https://ci.appveyor.com/project/kristerkari/react-native-css-media-query-processor/branch/master)
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

You can use this library together with [css-to-react-native-transform](https://github.com/kristerkari/css-to-react-native-transform) to transform a string of CSS containing media queries to an React Native style object.

Given that React Native returns the following dimensions:

```js
import { Dimensions } from "react-native";
Dimensions.get("window");
// => { width: 110, height: 100 }
```

`App.css`:

```css
.foo {
  color: red;
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
import { process } from "react-native-css-media-query-processor";

process(transform(styles, { parseMediaQueries: true }));
```

↓ ↓ ↓ ↓ ↓ ↓

```js
{
  foo: {
    color: "blue"
  },
  bar: {
    fontSize: 32
  }
}
```
