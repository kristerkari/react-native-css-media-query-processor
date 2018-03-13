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

  it("should support values with extra whitespace", () => {
    expect(
      process({
        " @media android ": {
          a: 1
        },
        " @media  ios  ": {
          a: 2
        }
      })
    ).toEqual({ a: 2 });

    expect(
      process({
        " @media screen and (min-height:   50px) and     (max-height: 150px)  ": {
          a: 1
        },
        "@media   screen and   (min-height:   150px)   and (  max-height: 200px)": {
          a: 2
        }
      })
    ).toEqual({ a: 1 });

    expect(
      process({
        "@media    android": {
          a: 1
        },
        "@media    ios": {
          a: 2
        }
      })
    ).toEqual({ a: 2 });
  });

  it("should support media queries with lower and uppercase", () => {
    expect(
      process({
        "@media ANDROID": {
          a: 1
        },
        "@media IOS": {
          a: 2
        }
      })
    ).toEqual({ a: 2 });

    expect(
      process({
        "@MEDIA screen and (MIN-HEIGHT: 50px) and (MAX-HEIGHT: 150px)": {
          a: 1
        },
        "@media screen and (min-height: 150px) and (max-height: 200px)": {
          a: 2
        }
      })
    ).toEqual({ a: 1 });
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

  it("should throw for invalid types", () => {
    expect(() =>
      process({
        a: 0,
        "@media screens": {
          a: 1
        }
      })
    ).toThrow('Failed to parse media query type "screens"');
    expect(() =>
      process({
        a: 0,
        "@media sdfgsdfg": {
          a: 1
        }
      })
    ).toThrow('Failed to parse media query type "sdfgsdfg"');
  });

  it("should throw for invalid features", () => {
    expect(() =>
      process({
        a: 0,
        "@media (min-heigh: 50px) and (max-height: 150px)": {
          a: 1
        }
      })
    ).toThrow('Failed to parse media query feature "min-heigh"');
    expect(() =>
      process({
        a: 0,
        "@media (orientations: landscape)": {
          a: 1
        }
      })
    ).toThrow('Failed to parse media query feature "orientations"');
  });

  it("should throw for values without units", () => {
    expect(() =>
      process({
        a: 0,
        "@media (min-height: 50) and (max-height: 150px)": {
          a: 1
        }
      })
    ).toThrow('Failed to parse media query expression "(min-height: 50)"');
    expect(() =>
      process({
        a: 0,
        "@media (min-height: 50px) and (max-height: 150)": {
          a: 1
        }
      })
    ).toThrow('Failed to parse media query expression "(max-height: 150)"');
    expect(() =>
      process({
        a: 0,
        "@media (min-width)": {
          a: 1
        }
      })
    ).toThrow('Failed to parse media query expression "(min-width)"');
  });
});
