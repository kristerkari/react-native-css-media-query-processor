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

  it("should not modify passed in object", () => {
    const styles = {
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

  it("should support OR queries", () => {
    expect(
      process({
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
        "@media android": {
          a: 1
        },
        "@media ios": {
          a: 2
        }
      })
    ).toEqual({ a: 2 });
  });

  it("should ignore non-matching media queries", () => {
    expect(
      process({
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
