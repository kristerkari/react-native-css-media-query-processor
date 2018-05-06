import mediaQuery from "../mediaquery.js";

describe("match", () => {
  describe("Equality Check", function() {
    it("Orientation: should return true for a correct match (===)", function() {
      expect(
        mediaQuery.match(
          [
            {
              inverse: false,
              type: "all",
              expressions: [{ feature: "orientation", value: "portrait" }]
            }
          ],
          { orientation: "portrait" }
        )
      ).toBe(true);
    });

    it("Orientation: should return false for an incorrect match (===)", function() {
      expect(
        mediaQuery.match(
          [
            {
              inverse: false,
              type: "all",
              expressions: [{ feature: "orientation", value: "landscape" }]
            }
          ],
          {
            orientation: "portrait"
          }
        )
      ).toBe(false);
    });

    it("Scan: should return true for a correct match (===)", function() {
      expect(
        mediaQuery.match(
          [
            {
              inverse: false,
              type: "all",
              expressions: [{ feature: "scan", value: "progressive" }]
            }
          ],
          { scan: "progressive" }
        )
      ).toBe(true);
    });

    it("Scan: should return false for an incorrect match (===)", function() {
      expect(
        mediaQuery.match(
          [
            {
              inverse: false,
              type: "all",
              expressions: [{ feature: "scan", value: "progressive" }]
            }
          ],
          { scan: "interlace" }
        )
      ).toBe(false);
    });

    it("Width: should return true for a correct match", function() {
      expect(
        mediaQuery.match(
          [
            {
              inverse: false,
              type: "all",
              expressions: [
                { modifier: undefined, feature: "width", value: "800px" }
              ]
            }
          ],
          { width: 800 }
        )
      ).toBe(true);
    });

    it("Width: should return false for an incorrect match", function() {
      expect(
        mediaQuery.match(
          [
            {
              inverse: false,
              type: "all",
              expressions: [
                { modifier: undefined, feature: "width", value: "800px" }
              ]
            }
          ],
          { width: 900 }
        )
      ).toBe(false);
    });
  });

  describe("Length Check", function() {
    describe("Width", function() {
      it("should return true for a width higher than a min-width", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "width", modifier: "min", value: "48em" }
                ],
                inverse: false,
                type: "all"
              }
            ],
            { width: "80em" }
          )
        ).toBe(true);
      });

      it("should return false for a width lower than a min-width", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "width", modifier: "min", value: "48em" }
                ],
                inverse: false,
                type: "all"
              }
            ],
            { width: "20em" }
          )
        ).toBe(false);
      });

      it("should return false when no width value is specified", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "width", modifier: "min", value: "48em" }
                ],
                inverse: false,
                type: "all"
              }
            ],
            { resolution: 72 }
          )
        ).toBe(false);
      });
    });

    describe("Different Units", function() {
      it("should work with ems", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "width", modifier: "min", value: "500px" }
                ],
                inverse: false,
                type: "all"
              }
            ],
            { width: "48em" }
          )
        ).toBe(true);
      });

      it("should work with rems", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "width", modifier: "min", value: "500px" }
                ],
                inverse: false,
                type: "all"
              }
            ],
            { width: "48rem" }
          )
        ).toBe(true);
      });

      it("should work with cm", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "height", modifier: "max", value: "1000px" }
                ],
                inverse: false,
                type: "all"
              }
            ],
            { height: "20cm" }
          )
        ).toBe(true);
      });

      it("should work with mm", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "height", modifier: "max", value: "1000px" }
                ],
                inverse: false,
                type: "all"
              }
            ],
            { height: "200mm" }
          )
        ).toBe(true);
      });

      it("should work with inch", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "height", modifier: "max", value: "1000px" }
                ],
                inverse: false,
                type: "all"
              }
            ],
            { height: "20in" }
          )
        ).toBe(false);
      });

      it("should work with pt", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "height", modifier: "max", value: "1000px" }
                ],
                inverse: false,
                type: "all"
              }
            ],
            { height: "850pt" }
          )
        ).toBe(false);
      });

      it("should work with pc", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "height", modifier: "max", value: "1000px" }
                ],
                inverse: false,
                type: "all"
              }
            ],
            { height: "60pc" }
          )
        ).toBe(true);
      });
    });
  });

  describe("Resolution Check", function() {
    it("should return true for a resolution match", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "resolution", modifier: undefined, value: "50dpi" }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { resolution: 50 }
        )
      ).toBe(true);
    });

    it("should return true for a resolution higher than a min-resolution", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "resolution", modifier: "min", value: "50dpi" }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { resolution: 72 }
        )
      ).toBe(true);
    });

    it("should return false for a resolution higher than a max-resolution", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "resolution", modifier: "max", value: "72dpi" }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { resolution: 300 }
        )
      ).toBe(false);
    });

    it("should return false if resolution isnt passed in", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "resolution", modifier: "min", value: "72dpi" }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { width: 300 }
        )
      ).toBe(false);
    });

    it("should convert units properly", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "resolution", modifier: "min", value: "72dpi" }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { resolution: "75dpcm" }
        )
      ).toBe(false);

      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "resolution", modifier: undefined, value: "192dpi" }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { resolution: "2dppx" }
        )
      ).toBe(true);
    });
  });

  describe("Aspect Ratio Check", function() {
    it("should return true for an aspect-ratio higher than a min-aspect-ratio", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "aspect-ratio", modifier: "min", value: "4/3" }
              ],
              inverse: false,
              type: "all"
            }
          ],
          {
            "aspect-ratio": "16 / 9"
          }
        )
      ).toBe(true);
    });

    it("should return false for an aspect-ratio higher than a max-aspect-ratio", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "aspect-ratio", modifier: "max", value: "4/3" }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { "aspect-ratio": "16/9" }
        )
      ).toBe(false);
    });

    it("should return false if aspect-ratio isnt passed in", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "aspect-ratio", modifier: "max", value: "72dpi" }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { width: 300 }
        )
      ).toBe(false);
    });

    it("should work numbers", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "aspect-ratio", modifier: "min", value: "2560/1440" }
              ],
              inverse: false,
              type: "all"
            }
          ],
          {
            "aspect-ratio": 4 / 3
          }
        )
      ).toBe(false);
    });
  });

  describe("Grid/Color/Color-Index/Monochrome", function() {
    it("should return true for a correct match", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "grid", modifier: undefined, value: undefined }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { grid: 1 }
        )
      ).toBe(true);
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "color", modifier: undefined, value: undefined }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { color: 1 }
        )
      ).toBe(true);
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "color-index", modifier: undefined, value: "3" }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { "color-index": 3 }
        )
      ).toBe(true);
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "monochrome", modifier: undefined, value: undefined }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { monochrome: 1 }
        )
      ).toBe(true);
    });

    it("should return false for an incorrect match", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "grid", modifier: undefined, value: undefined }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { grid: 0 }
        )
      ).toBe(false);
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "color", modifier: undefined, value: undefined }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { color: 0 }
        )
      ).toBe(false);
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "color-index", modifier: undefined, value: "3" }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { "color-index": 2 }
        )
      ).toBe(false);
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "monochrome", modifier: undefined, value: undefined }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { monochrome: 0 }
        )
      ).toBe(false);
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "monochrome", modifier: undefined, value: undefined }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { monochrome: "foo" }
        )
      ).toBe(false);
    });
  });

  describe("Type", function() {
    it("should return true for a correct match", function() {
      expect(
        mediaQuery.match(
          [{ expressions: [], inverse: false, type: "screen" }],
          { type: "screen" }
        )
      ).toBe(true);
    });

    it("should return false for an incorrect match", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "color", modifier: undefined, value: "1" }
              ],
              inverse: false,
              type: "screen"
            }
          ],
          {
            type: "tv",
            color: 1
          }
        )
      ).toBe(false);
    });

    it("should return false for a media query without a type when type is specified in the value object", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "width", modifier: "min", value: "500px" }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { type: "screen" }
        )
      ).toBe(false);
    });

    it("should return true for a media query without a type when type is not specified in the value object", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "width", modifier: "min", value: "500px" }
              ],
              inverse: false,
              type: "all"
            }
          ],
          { width: 700 }
        )
      ).toBe(true);
    });
  });

  describe("Not", function() {
    it("should return false when theres a match on a `not` query", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "color", modifier: undefined, value: undefined }
              ],
              inverse: true,
              type: "screen"
            }
          ],
          {
            type: "screen",
            color: 1
          }
        )
      ).toBe(false);
    });

    it("should not disrupt an OR query", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "color", modifier: undefined, value: undefined }
              ],
              inverse: true,
              type: "screen"
            },
            {
              expressions: [
                { feature: "height", modifier: "min", value: "48em" }
              ],
              inverse: false,
              type: "screen"
            }
          ],
          {
            type: "screen",
            height: 1000
          }
        )
      ).toBe(true);
    });

    it("should return false for when type === all", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "width", modifier: "min", value: "48em" }
              ],
              inverse: true,
              type: "all"
            }
          ],
          {
            type: "all",
            width: 1000
          }
        )
      ).toBe(false);
    });

    it("should return true for inverted value", function() {
      expect(
        mediaQuery.match(
          [
            {
              expressions: [
                { feature: "width", modifier: "min", value: "48em" }
              ],
              inverse: true,
              type: "screen"
            }
          ],
          { width: "24em" }
        )
      ).toBe(true);
    });
  });

  describe("mediaQuery.match() Integration Tests", function() {
    describe("Real World Use Cases (mostly AND)", function() {
      it("should return true because of width and type match", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "width", modifier: "min", value: "767px" }
                ],
                inverse: false,
                type: "screen"
              }
            ],
            {
              type: "screen",
              width: 980
            }
          )
        ).toBe(true);
      });

      it("should return true because of width is within bounds", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "width", modifier: "min", value: "767px" },
                  { feature: "width", modifier: "max", value: "979px" }
                ],
                inverse: false,
                type: "screen"
              }
            ],
            {
              type: "screen",
              width: 800
            }
          )
        ).toBe(true);
      });

      it("should return false because width is out of bounds", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "width", modifier: "min", value: "767px" },
                  { feature: "width", modifier: "max", value: "979px" }
                ],
                inverse: false,
                type: "screen"
              }
            ],
            {
              type: "screen",
              width: 980
            }
          )
        ).toBe(false);
      });

      it("should return false since monochrome is not specified", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  {
                    feature: "monochrome",
                    modifier: undefined,
                    value: undefined
                  }
                ],
                inverse: false,
                type: "screen"
              }
            ],
            { width: 980 }
          )
        ).toBe(false);
      });

      it("should return true since color > 0", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "color", modifier: undefined, value: undefined }
                ],
                inverse: false,
                type: "screen"
              }
            ],
            {
              type: "screen",
              color: 1
            }
          )
        ).toBe(true);
      });

      it("should return false since color = 0", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "color", modifier: undefined, value: undefined }
                ],
                inverse: false,
                type: "screen"
              }
            ],
            {
              type: "screen",
              color: 0
            }
          )
        ).toBe(false);
      });
    });

    describe("Grouped Media Queries (OR)", function() {
      it("should return true because of color", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "width", modifier: "min", value: "767px" }
                ],
                inverse: false,
                type: "screen"
              },
              {
                expressions: [
                  { feature: "color", modifier: undefined, value: undefined }
                ],
                inverse: false,
                type: "screen"
              }
            ],
            {
              type: "screen",
              color: 1
            }
          )
        ).toBe(true);
      });

      it("should return true because of width and type", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "width", modifier: "max", value: "1200px" }
                ],
                inverse: false,
                type: "screen"
              },
              {
                expressions: [
                  {
                    feature: "monochrome",
                    modifier: undefined,
                    value: undefined
                  }
                ],
                inverse: false,
                type: "handheld"
              }
            ],
            {
              type: "screen",
              width: 1100
            }
          )
        ).toBe(true);
      });

      it("should return false because of monochrome mis-match", function() {
        expect(
          mediaQuery.match(
            [
              {
                expressions: [
                  { feature: "width", modifier: "max", value: "1200px" }
                ],
                inverse: false,
                type: "screen"
              },
              {
                expressions: [
                  {
                    feature: "monochrome",
                    modifier: undefined,
                    value: undefined
                  }
                ],
                inverse: false,
                type: "handheld"
              }
            ],
            {
              type: "screen",
              monochrome: 0
            }
          )
        ).toBe(false);
      });
    });
  });
});
