import memoize from "micro-memoize";

describe("media queries", () => {
  const rn = {
    Platform: {
      OS: "ios"
    },
    Dimensions: {
      get: () => {
        return { width: 110, height: 100 };
      }
    }
  };

  jest.setMock("react-native", rn);
  delete require.cache["../index"];
  const process = require("../index").process;
  it("should extract and apply media queries", () => {
    const obj = {
      __mediaQueries: {
        "@media (min-width: 50px) and (min-height: 100px)": [
          {
            inverse: false,
            type: "all",
            expressions: [
              { modifier: "min", feature: "width", value: "50px" },
              { modifier: "min", feature: "height", value: "100px" }
            ]
          }
        ],
        "@media ios": [
          {
            inverse: false,
            type: "ios",
            expressions: []
          }
        ]
      },
      a: 1,
      b: 2,
      e: {
        x: 1,
        y: 2
      },
      "@media (min-width: 50px) and (min-height: 100px)": {
        a: 2,
        c: 3,
        d: 4,
        e: {
          x: 2,
          z: 3
        }
      },
      "@media ios": {
        d: 5
      }
    };
    expect(process(obj)).toEqual({
      a: 2,
      b: 2,
      c: 3,
      d: 5,
      e: {
        x: 2,
        y: 2,
        z: 3
      }
    });
  });

  it("should return the same object if there are no parsed media queries", () => {
    expect(process({ a: 1 })).toEqual({ a: 1 });
  });

  it("should not modify passed in object", () => {
    const styles = {
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
        ],
        "@media (min-width: 150px) and (max-width: 200px)": [
          {
            inverse: false,
            type: "all",
            expressions: [
              { modifier: "min", feature: "width", value: "150px" },
              { modifier: "max", feature: "width", value: "200px" }
            ]
          }
        ]
      },
      "@media (min-width: 50px) and (max-width: 150px)": {
        a: 1
      },
      "@media (min-width: 150px) and (max-width: 200px)": {
        a: 2
      }
    };

    const result = process(styles);

    expect(result).toEqual({ a: 1 });
    expect(styles).toEqual({
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
        ],
        "@media (min-width: 150px) and (max-width: 200px)": [
          {
            inverse: false,
            type: "all",
            expressions: [
              { modifier: "min", feature: "width", value: "150px" },
              { modifier: "max", feature: "width", value: "200px" }
            ]
          }
        ]
      },
      "@media (min-width: 50px) and (max-width: 150px)": {
        a: 1
      },
      "@media (min-width: 150px) and (max-width: 200px)": {
        a: 2
      }
    });
  });

  it("should allow memoized objects to be passed in", () => {
    const styles = b => {
      return {
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
          ],
          "@media (min-width: 150px) and (max-width: 200px)": [
            {
              inverse: false,
              type: "all",
              expressions: [
                { modifier: "min", feature: "width", value: "150px" },
                { modifier: "max", feature: "width", value: "200px" }
              ]
            }
          ]
        },
        a: b,
        "@media (min-width: 50px) and (max-width: 150px)": {
          a: 1
        },
        "@media (min-width: 150px) and (max-width: 200px)": {
          a: 2
        }
      };
    };

    const mstyles = memoize(styles);
    expect(process(mstyles(0))).toEqual({ a: 1 });
  });

  it("should process width", () => {
    expect(
      process({
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
          ],
          "@media (min-width: 150px) and (max-width: 200px)": [
            {
              inverse: false,
              type: "all",
              expressions: [
                { modifier: "min", feature: "width", value: "150px" },
                { modifier: "max", feature: "width", value: "200px" }
              ]
            }
          ]
        },
        "@media (min-width: 50px) and (max-width: 150px)": {
          a: 1
        },
        "@media (min-width: 150px) and (max-width: 200px)": {
          a: 2
        }
      })
    ).toEqual({ a: 1 });
  });

  it("should process height", () => {
    expect(
      process({
        __mediaQueries: {
          "@media (min-height: 50px) and (max-height: 150px)": [
            {
              inverse: false,
              type: "all",
              expressions: [
                { modifier: "min", feature: "height", value: "50px" },
                { modifier: "max", feature: "height", value: "150px" }
              ]
            }
          ],
          "@media (min-height: 150px) and (max-height: 200px)": [
            {
              inverse: false,
              type: "all",
              expressions: [
                { modifier: "min", feature: "height", value: "150px" },
                { modifier: "max", feature: "height", value: "200px" }
              ]
            }
          ]
        },
        "@media (min-height: 50px) and (max-height: 150px)": {
          a: 1
        },
        "@media (min-height: 150px) and (max-height: 200px)": {
          a: 2
        }
      })
    ).toEqual({ a: 1 });
  });

  it("should support rem", () => {
    expect(
      process({
        __mediaQueries: {
          "@media (min-height: 3.125rem) and (max-height: 9.375rem)": [
            {
              inverse: false,
              type: "all",
              expressions: [
                { modifier: "min", feature: "height", value: "3.125rem" },
                { modifier: "max", feature: "height", value: "9.375rem" }
              ]
            }
          ],
          "@media (min-height: 9.375rem) and (max-height: 12.5rem)": [
            {
              inverse: false,
              type: "all",
              expressions: [
                { modifier: "min", feature: "height", value: "9.375rem" },
                { modifier: "max", feature: "height", value: "12.5rem" }
              ]
            }
          ]
        },
        "@media (min-height: 3.125rem) and (max-height: 9.375rem)": {
          a: 1
        },
        "@media (min-height: 9.375rem) and (max-height: 12.5rem)": {
          a: 2
        }
      })
    ).toEqual({ a: 1 });
    expect(
      process({
        __mediaQueries: {
          "@media screen and (min-height: 9.375rem) and (max-height: 12.5rem)": [
            {
              inverse: false,
              type: "screen",
              expressions: [
                { modifier: "min", feature: "height", value: "9.375rem" },
                { modifier: "max", feature: "height", value: "12.5rem" }
              ]
            }
          ],
          "@media screen and (min-height: 3.125rem) and (max-height: 9.375rem)": [
            {
              inverse: false,
              type: "screen",
              expressions: [
                { modifier: "min", feature: "height", value: "3.125rem" },
                { modifier: "max", feature: "height", value: "9.375rem" }
              ]
            }
          ]
        },
        a: 0,
        "@media screen and (min-height: 9.375rem) and (max-height: 12.5rem)": {
          a: 1
        },
        "@media screen and (min-height: 3.125rem) and (max-height: 9.375rem)": {
          a: 2
        }
      })
    ).toEqual({ a: 2 });
  });

  it("should support screen type", () => {
    expect(
      process({
        __mediaQueries: {
          "@media screen and (min-height: 50px) and (max-height: 150px)": [
            {
              inverse: false,
              type: "screen",
              expressions: [
                { modifier: "min", feature: "height", value: "50px" },
                { modifier: "max", feature: "height", value: "150px" }
              ]
            }
          ],
          "@media screen and (min-height: 150px) and (max-height: 200px)": [
            {
              inverse: false,
              type: "screen",
              expressions: [
                { modifier: "min", feature: "height", value: "150px" },
                { modifier: "max", feature: "height", value: "200px" }
              ]
            }
          ]
        },
        a: 0,
        "@media screen and (min-height: 50px) and (max-height: 150px)": {
          a: 1
        },
        "@media screen and (min-height: 150px) and (max-height: 200px)": {
          a: 2
        }
      })
    ).toEqual({ a: 1 });
  });

  it("should support all type", () => {
    expect(
      process({
        __mediaQueries: {
          "@media all and (min-height: 150px) and (max-height: 200px)": [
            {
              inverse: false,
              type: "all",
              expressions: [
                { modifier: "min", feature: "height", value: "150px" },
                { modifier: "max", feature: "height", value: "200px" }
              ]
            }
          ],
          "@media all and (min-height: 50px) and (max-height: 150px)": [
            {
              inverse: false,
              type: "all",
              expressions: [
                { modifier: "min", feature: "height", value: "50px" },
                { modifier: "max", feature: "height", value: "150px" }
              ]
            }
          ]
        },
        a: 0,
        "@media all and (min-height: 150px) and (max-height: 200px)": {
          a: 1
        },
        "@media all and (min-height: 50px) and (max-height: 150px)": {
          a: 2
        }
      })
    ).toEqual({ a: 2 });
  });

  it("should process mixed types", () => {
    expect(
      process({
        __mediaQueries: {
          "@media ios": [
            {
              inverse: false,
              type: "ios",
              expressions: []
            }
          ],
          "@media android": [
            {
              inverse: false,
              type: "android",
              expressions: []
            }
          ],
          "@media screen and (min-width: 50px)": [
            {
              inverse: false,
              type: "screen",
              expressions: [
                { modifier: "min", feature: "width", value: "50px" }
              ]
            }
          ],
          "@media all and (min-width: 50px)": [
            {
              inverse: false,
              type: "all",
              expressions: [
                { modifier: "min", feature: "width", value: "50px" }
              ]
            }
          ],
          "@media (orientation: landscape)": [
            {
              inverse: false,
              type: "all",
              expressions: [{ feature: "orientation", value: "landscape" }]
            }
          ]
        },
        "@media ios": {
          a: 1
        },
        "@media android": {
          a: 2
        },
        "@media screen and (min-width: 50px)": {
          b: 3
        },
        "@media all and (min-width: 50px)": {
          c: 4
        },
        "@media (orientation: landscape)": {
          d: 5
        }
      })
    ).toEqual({ a: 1, b: 3, c: 4, d: 5 });
  });

  it("should support OR queries", () => {
    expect(
      process({
        __mediaQueries: {
          "@media all and (min-height: 150px), (max-height: 200px)": [
            {
              inverse: false,
              type: "all",
              expressions: [
                { modifier: "min", feature: "height", value: "150px" }
              ]
            },
            {
              inverse: false,
              type: "all",
              expressions: [
                { modifier: "max", feature: "height", value: "200px" }
              ]
            }
          ],
          "@media all and (min-height: 200px), (max-height: 150px)": [
            {
              inverse: false,
              type: "all",
              expressions: [
                { modifier: "min", feature: "height", value: "200px" }
              ]
            },
            {
              inverse: false,
              type: "all",
              expressions: [
                { modifier: "max", feature: "height", value: "150px" }
              ]
            }
          ]
        },
        a: 0,
        "@media all and (min-height: 150px), (max-height: 200px)": {
          a: 1
        },
        "@media all and (min-height: 200px), (max-height: 150px)": {
          a: 2
        }
      })
    ).toEqual({ a: 2 });
    expect(
      process({
        __mediaQueries: {
          "@media (orientation: portrait), (orientation: landscape)": [
            {
              inverse: false,
              type: "all",
              expressions: [
                {
                  modifier: undefined,
                  feature: "orientation",
                  value: "portrait"
                }
              ]
            },
            {
              inverse: false,
              type: "all",
              expressions: [
                {
                  modifier: undefined,
                  feature: "orientation",
                  value: "landscape"
                }
              ]
            }
          ]
        },
        a: 1,
        "@media (orientation: portrait), (orientation: landscape)": {
          a: 2
        }
      })
    ).toEqual({ a: 2 });
  });

  it("should process orientation", () => {
    expect(
      process({
        __mediaQueries: {
          "@media (orientation: landscape)": [
            {
              inverse: false,
              type: "all",
              expressions: [
                {
                  modifier: undefined,
                  feature: "orientation",
                  value: "landscape"
                }
              ]
            }
          ],
          "@media (orientation: portrait)": [
            {
              inverse: false,
              type: "all",
              expressions: [
                {
                  modifier: undefined,
                  feature: "orientation",
                  value: "portrait"
                }
              ]
            }
          ]
        },
        "@media (orientation: landscape)": {
          a: 1
        },
        "@media (orientation: portrait)": {
          a: 2
        }
      })
    ).toEqual({ a: 1 });
  });

  it("should process type", () => {
    expect(
      process({
        __mediaQueries: {
          "@media ios": [
            {
              inverse: false,
              type: "ios",
              expressions: []
            }
          ],
          "@media android": [
            {
              inverse: false,
              type: "android",
              expressions: []
            }
          ]
        },
        "@media ios": {
          a: 1
        },
        "@media android": {
          a: 2
        }
      })
    ).toEqual({ a: 1 });
    expect(
      process({
        __mediaQueries: {
          "@media android": [
            {
              inverse: false,
              type: "android",
              expressions: []
            }
          ],
          "@media ios": [
            {
              inverse: false,
              type: "ios",
              expressions: []
            }
          ]
        },
        "@media android": {
          a: 1
        },
        "@media ios": {
          a: 2
        }
      })
    ).toEqual({ a: 2 });
  });

  it("should process media query with not operator and type", () => {
    expect(
      process({
        __mediaQueries: {
          "@media not print": [
            {
              inverse: true,
              type: "print",
              expressions: []
            }
          ],
          "@media print": [
            {
              inverse: false,
              type: "print",
              expressions: []
            }
          ]
        },
        a: 1,
        "@media not print": {
          a: 2
        },
        "@media print": {
          a: 3
        }
      })
    ).toEqual({ a: 2 });
  });

  it("should process media query with NOT and OR operators and type", () => {
    expect(
      process({
        __mediaQueries: {
          "@media not print, (orientation: landscape)": [
            {
              inverse: true,
              type: "print",
              expressions: []
            },
            {
              expressions: [
                {
                  feature: "orientation",
                  modifier: undefined,
                  value: "landscape"
                }
              ],
              inverse: false,
              type: "all"
            }
          ],
          "@media print": [
            {
              inverse: false,
              type: "print",
              expressions: []
            }
          ]
        },
        a: 1,
        "@media not print, (orientation: landscape)": {
          a: 2
        },
        "@media print": {
          a: 3
        }
      })
    ).toEqual({ a: 2 });
    expect(
      process({
        __mediaQueries: {
          "@media not ios, (orientation: landscape)": [
            {
              inverse: true,
              type: "ios",
              expressions: []
            },
            {
              expressions: [
                {
                  feature: "orientation",
                  modifier: undefined,
                  value: "landscape"
                }
              ],
              inverse: false,
              type: "all"
            }
          ],
          "@media print": [
            {
              inverse: false,
              type: "print",
              expressions: []
            }
          ]
        },
        a: 1,
        "@media not ios, (orientation: landscape)": {
          a: 2
        },
        "@media print": {
          a: 3
        }
      })
    ).toEqual({ a: 2 });
    expect(
      process({
        __mediaQueries: {
          "@media not print, (orientation: portrait)": [
            {
              inverse: true,
              type: "print",
              expressions: []
            },
            {
              expressions: [
                {
                  feature: "orientation",
                  modifier: undefined,
                  value: "portrait"
                }
              ],
              inverse: false,
              type: "all"
            }
          ],
          "@media print": [
            {
              inverse: false,
              type: "print",
              expressions: []
            }
          ]
        },
        a: 1,
        "@media not ios, (orientation: portrait)": {
          a: 2
        },
        "@media print": {
          a: 3
        }
      })
    ).toEqual({ a: 1 });
  });

  it("should process media query with NOT and AND operators and platform", () => {
    expect(
      process({
        __mediaQueries: {
          "@media android": [
            {
              inverse: false,
              type: "android",
              expressions: []
            }
          ],
          "@media not android and (orientation: landscape)": [
            {
              inverse: true,
              type: "android",
              expressions: [
                {
                  feature: "orientation",
                  modifier: undefined,
                  value: "landscape"
                }
              ]
            }
          ]
        },
        a: 1,
        "@media android": {
          a: 2
        },
        "@media not ios and (orientation: landscape)": {
          a: 3
        }
      })
    ).toEqual({ a: 1 });
    expect(
      process({
        __mediaQueries: {
          "@media android": [
            {
              inverse: false,
              type: "android",
              expressions: []
            }
          ],
          "@media not android and (orientation: portrait)": [
            {
              inverse: true,
              type: "android",
              expressions: [
                {
                  feature: "orientation",
                  modifier: undefined,
                  value: "portrait"
                }
              ]
            }
          ]
        },
        a: 1,
        "@media android": {
          a: 2
        },
        "@media not android and (orientation: portrait)": {
          a: 3
        }
      })
    ).toEqual({ a: 3 });
  });

  it("should process media query with not operator and platform", () => {
    expect(
      process({
        __mediaQueries: {
          "@media android": [
            {
              inverse: false,
              type: "android",
              expressions: []
            }
          ],
          "@media not android": [
            {
              inverse: true,
              type: "android",
              expressions: []
            }
          ]
        },
        a: 1,
        "@media android": {
          a: 2
        },
        "@media not android": {
          a: 3
        }
      })
    ).toEqual({ a: 3 });
  });

  it("should ignore non-matching media queries", () => {
    expect(
      process({
        __mediaQueries: {
          "@media print and (min-width: 50px)": [
            {
              inverse: false,
              type: "print",
              expressions: [
                { modifier: "min", feature: "width", value: "50px" }
              ]
            }
          ]
        },
        a: 0,
        "@media print and (min-width: 50px)": {
          a: 1
        }
      })
    ).toEqual({ a: 0 });
  });
});

describe("merge", () => {
  delete require.cache["../index"];
  const merge = require("deepmerge");
  it("should merge 2 objects", () => {
    expect(
      merge({ a: 1, b: 1, c: { d: 1 } }, { b: 2, c: { d: 3, e: 1 } })
    ).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: 1
      }
    });
  });

  it("should not modify input", () => {
    const obj1 = { a: 1, b: 1, c: { d: 1 } };
    const obj2 = { b: 2, c: { d: 3, e: 1 } };
    const result = merge(obj1, obj2);

    expect(result).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: 1
      }
    });
    expect(obj1).toEqual({ a: 1, b: 1, c: { d: 1 } });
    expect(obj2).toEqual({ b: 2, c: { d: 3, e: 1 } });
  });
});
