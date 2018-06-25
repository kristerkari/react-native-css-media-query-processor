var Benchmark = require("benchmark");
var once = new Benchmark.Suite();
var eightTimesTheSame = new Benchmark.Suite();
var eightTimesTheSameRequire = new Benchmark.Suite();
var fourTimes = new Benchmark.Suite();
var eightTimes = new Benchmark.Suite();
var onceRequire = new Benchmark.Suite();
var fourTimesRequire = new Benchmark.Suite();
var eightTimesRequire = new Benchmark.Suite();

var process = require("./dist/perf-tests/current").process;

var styles = {
  __mediaQueries: {
    "@media screen and (max-width: 55rem)": [
      {
        inverse: false,
        type: "@media",
        expressions: [{ modifier: "max", feature: "width", value: "55rem" }]
      }
    ],
    "@media screen and (max-width: 52.375rem)": [
      {
        inverse: false,
        type: "@media",
        expressions: [{ modifier: "max", feature: "width", value: "52.375rem" }]
      }
    ],
    "@media screen and (max-width: 32rem)": [
      {
        inverse: false,
        type: "@media",
        expressions: [{ modifier: "max", feature: "width", value: "32rem" }]
      }
    ]
  },
  header: {
    width: "90%",
    maxWidth: 1104,
    marginTop: 0,
    marginRight: "auto",
    marginBottom: 0,
    marginLeft: "auto",
    paddingTop: 46,
    paddingRight: 30,
    paddingBottom: 30,
    paddingLeft: 30,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: "row"
  },
  headerHeadings: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: "column"
  },
  headerSpan: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 8,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 9.6,
    paddingLeft: 1.6,
    color: "#47a3da",
    fontFamily: "Arial"
  },
  headerNav: { display: "flex", flexDirection: "row", alignItems: "center" },
  headerNavItem: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 0,
    marginRight: 6.4,
    marginBottom: 0,
    marginLeft: 1.6,
    borderWidth: 4,
    borderStyle: "solid",
    borderColor: "#47a3da",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  h1: {
    fontSize: 34,
    lineHeight: 44,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 20,
    marginLeft: 0,
    fontWeight: "400",
    color: "#47a3da",
    fontFamily: "Arial"
  },
  contentSection: {
    paddingTop: 48,
    paddingRight: 16,
    paddingBottom: 48,
    paddingLeft: 16,
    width: "100%",
    maxWidth: 1230,
    marginTop: 0,
    marginRight: "auto",
    marginBottom: 0,
    marginLeft: "auto",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: "row"
  },
  tabsWrapper: {
    marginTop: 16,
    marginRight: 0,
    marginBottom: 32,
    marginLeft: 0
  },
  tabs: { width: "100%", marginBottom: 3, position: "relative" },
  bottomBorder: {
    height: 1,
    width: "100%",
    backgroundColor: "#47a3da",
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: -1
  },
  ul: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: "row",
    marginLeft: "auto",
    marginRight: "auto"
  },
  li: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#becbd2",
    borderBottomColor: "#47a3da",
    marginTop: 0,
    marginRight: 4,
    marginBottom: 0,
    marginLeft: 4,
    backgroundColor: "#fff"
  },
  liCurrent: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#47a3da",
    borderTopWidth: 3,
    borderBottomColor: "#fff",
    marginTop: 0,
    marginRight: 4,
    marginBottom: 0,
    marginLeft: 4,
    backgroundColor: "#fff",
    zIndex: 1
  },
  icon: { marginTop: -4, marginRight: 9, marginBottom: 0, marginLeft: 0 },
  link: {
    height: 54,
    paddingTop: 0,
    paddingRight: 29,
    paddingBottom: 0,
    paddingLeft: 29,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: "row",
    alignItems: "center"
  },
  liCurrentLinkText: { fontSize: 23.2, color: "#47a3da", fontFamily: "Arial" },
  linkText: { fontSize: 23.2, color: "#becbd2", fontFamily: "Arial" },
  mediabox: {
    width: "33%",
    flexBasis: "33%",
    marginTop: 10,
    marginRight: 0,
    marginBottom: 10,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 25,
    paddingBottom: 0,
    paddingLeft: 25
  },
  imgWrapper: { position: "relative", height: 0, paddingTop: "54.39%" },
  img: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "auto",
    maxWidth: "100%",
    resizeMode: "cover"
  },
  h3: {
    fontSize: 23,
    marginTop: 18,
    marginRight: 0,
    marginBottom: 12,
    marginLeft: 0,
    color: "#47a3da",
    fontWeight: "700",
    fontFamily: "Arial"
  },
  p: {
    fontSize: 20,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 16,
    paddingLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    lineHeight: 24,
    color: "#47a3da",
    fontFamily: "Arial"
  },
  info: {
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20
  },
  infoText: { fontSize: 16, textAlign: "center", color: "#47a3da" },
  infoLink: { color: "#ccc" },
  "@media screen and (max-width: 55rem)": {
    header: { flexDirection: "column", alignItems: "center" },
    headerSpan: { textAlign: "center" },
    h1: { textAlign: "center" }
  },
  "@media screen and (max-width: 52.375rem)": {
    liCurrentLinkText: { display: "none" },
    linkText: { display: "none" },
    icon: { marginRight: 0 },
    contentSection: { flexDirection: "column" },
    mediabox: {
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 35,
      paddingLeft: 0,
      flexDirection: "row",
      width: "100%"
    },
    imgWrapper: {
      marginTop: 0,
      marginRight: 25,
      marginBottom: 10,
      marginLeft: 0,
      width: "40%",
      paddingTop: "22.39%"
    },
    textWrapper: { width: "58%" },
    h3: { marginTop: 0, fontSize: 21 },
    p: { fontSize: 18 }
  },
  "@media screen and (max-width: 32rem)": {
    ul: {
      width: "100%",
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0
    },
    link: {
      width: "100%",
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      justifyContent: "center"
    },
    li: {
      flexGrow: 1,
      flexBasis: "20%",
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: -1
    },
    liCurrent: {
      flexGrow: 1,
      flexBasis: "20%",
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: -1
    },
    contentSection: { flexDirection: "column" },
    mediabox: { width: "100%", flexBasis: "100%", flexDirection: "column" },
    imgWrapper: { width: "100%", maxWidth: "100%", paddingTop: "54.39%" },
    textWrapper: { width: "100%" },
    img: {
      marginTop: 0,
      marginRight: "auto",
      marginBottom: 0,
      marginLeft: "auto",
      maxWidth: "100%"
    },
    h3: {
      marginTop: 20,
      marginRight: 0,
      marginBottom: 16,
      marginLeft: 0,
      textAlign: "center"
    },
    p: {
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      textAlign: "center"
    }
  }
};

var stylesWithoutMediaQueries = {
  header: {
    width: "90%",
    maxWidth: 1104,
    marginTop: 0,
    marginRight: "auto",
    marginBottom: 0,
    marginLeft: "auto",
    paddingTop: 46,
    paddingRight: 30,
    paddingBottom: 30,
    paddingLeft: 30,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: "row"
  },
  headerHeadings: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: "column"
  },
  headerSpan: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 8,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 9.6,
    paddingLeft: 1.6,
    color: "#47a3da",
    fontFamily: "Arial"
  },
  headerNav: { display: "flex", flexDirection: "row", alignItems: "center" },
  headerNavItem: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 0,
    marginRight: 6.4,
    marginBottom: 0,
    marginLeft: 1.6,
    borderWidth: 4,
    borderStyle: "solid",
    borderColor: "#47a3da",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  h1: {
    fontSize: 34,
    lineHeight: 44,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 20,
    marginLeft: 0,
    fontWeight: "400",
    color: "#47a3da",
    fontFamily: "Arial"
  },
  contentSection: {
    paddingTop: 48,
    paddingRight: 16,
    paddingBottom: 48,
    paddingLeft: 16,
    width: "100%",
    maxWidth: 1230,
    marginTop: 0,
    marginRight: "auto",
    marginBottom: 0,
    marginLeft: "auto",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: "row"
  },
  tabsWrapper: {
    marginTop: 16,
    marginRight: 0,
    marginBottom: 32,
    marginLeft: 0
  },
  tabs: { width: "100%", marginBottom: 3, position: "relative" },
  bottomBorder: {
    height: 1,
    width: "100%",
    backgroundColor: "#47a3da",
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: -1
  },
  ul: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: "row",
    marginLeft: "auto",
    marginRight: "auto"
  },
  li: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#becbd2",
    borderBottomColor: "#47a3da",
    marginTop: 0,
    marginRight: 4,
    marginBottom: 0,
    marginLeft: 4,
    backgroundColor: "#fff"
  },
  liCurrent: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#47a3da",
    borderTopWidth: 3,
    borderBottomColor: "#fff",
    marginTop: 0,
    marginRight: 4,
    marginBottom: 0,
    marginLeft: 4,
    backgroundColor: "#fff",
    zIndex: 1
  },
  icon: { marginTop: -4, marginRight: 9, marginBottom: 0, marginLeft: 0 },
  link: {
    height: 54,
    paddingTop: 0,
    paddingRight: 29,
    paddingBottom: 0,
    paddingLeft: 29,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: "row",
    alignItems: "center"
  },
  liCurrentLinkText: { fontSize: 23.2, color: "#47a3da", fontFamily: "Arial" },
  linkText: { fontSize: 23.2, color: "#becbd2", fontFamily: "Arial" },
  mediabox: {
    width: "33%",
    flexBasis: "33%",
    marginTop: 10,
    marginRight: 0,
    marginBottom: 10,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 25,
    paddingBottom: 0,
    paddingLeft: 25
  },
  imgWrapper: { position: "relative", height: 0, paddingTop: "54.39%" },
  img: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "auto",
    maxWidth: "100%",
    resizeMode: "cover"
  },
  h3: {
    fontSize: 23,
    marginTop: 18,
    marginRight: 0,
    marginBottom: 12,
    marginLeft: 0,
    color: "#47a3da",
    fontWeight: "700",
    fontFamily: "Arial"
  },
  p: {
    fontSize: 20,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 16,
    paddingLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    lineHeight: 24,
    color: "#47a3da",
    fontFamily: "Arial"
  },
  info: {
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20
  },
  infoText: { fontSize: 16, textAlign: "center", color: "#47a3da" },
  infoLink: { color: "#ccc" },
  "@media screen and (max-width: 55rem)": {
    header: { flexDirection: "column", alignItems: "center" },
    headerSpan: { textAlign: "center" },
    h1: { textAlign: "center" }
  },
  "@media screen and (max-width: 52.375rem)": {
    liCurrentLinkText: { display: "none" },
    linkText: { display: "none" },
    icon: { marginRight: 0 },
    contentSection: { flexDirection: "column" },
    mediabox: {
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 35,
      paddingLeft: 0,
      flexDirection: "row",
      width: "100%"
    },
    imgWrapper: {
      marginTop: 0,
      marginRight: 25,
      marginBottom: 10,
      marginLeft: 0,
      width: "40%",
      paddingTop: "22.39%"
    },
    textWrapper: { width: "58%" },
    h3: { marginTop: 0, fontSize: 21 },
    p: { fontSize: 18 }
  },
  "@media screen and (max-width: 32rem)": {
    ul: {
      width: "100%",
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0
    },
    link: {
      width: "100%",
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      justifyContent: "center"
    },
    li: {
      flexGrow: 1,
      flexBasis: "20%",
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: -1
    },
    liCurrent: {
      flexGrow: 1,
      flexBasis: "20%",
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: -1
    },
    contentSection: { flexDirection: "column" },
    mediabox: { width: "100%", flexBasis: "100%", flexDirection: "column" },
    imgWrapper: { width: "100%", maxWidth: "100%", paddingTop: "54.39%" },
    textWrapper: { width: "100%" },
    img: {
      marginTop: 0,
      marginRight: "auto",
      marginBottom: 0,
      marginLeft: "auto",
      maxWidth: "100%"
    },
    h3: {
      marginTop: 20,
      marginRight: 0,
      marginBottom: 16,
      marginLeft: 0,
      textAlign: "center"
    },
    p: {
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      textAlign: "center"
    }
  }
};

var portrait = {
  width: 420,
  height: 690
};

var landscape = {
  width: 690,
  height: 420
};

var Platform = {
  OS: "ios"
};

console.log("-----------------------------------------");

once
  .add("1 call", function() {
    process(styles, portrait, Platform);
  })
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").map("name"));
    console.log("-----------------------------------------");
  })
  .run({ async: false });

onceRequire
  .add("1 call (require)", function() {
    require("./dist/perf-tests/current").process(styles, portrait, Platform);
  })
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").map("name"));
    console.log("-----------------------------------------");
  })
  .run({ async: false });

fourTimes
  .add("4 calls (orientation change)", function() {
    process(styles, portrait, Platform);
    process(styles, landscape, Platform);
    process(styles, portrait, Platform);
    process(styles, landscape, Platform);
  })
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").map("name"));
    console.log("-----------------------------------------");
  })
  .run({ async: false });

fourTimesRequire
  .add("4 calls (orientation change, require)", function() {
    require("./dist/perf-tests/current").process(styles, portrait, Platform);
    require("./dist/perf-tests/current").process(styles, landscape, Platform);
    require("./dist/perf-tests/current").process(styles, portrait, Platform);
    require("./dist/perf-tests/current").process(styles, landscape, Platform);
  })
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").map("name"));
    console.log("-----------------------------------------");
  })
  .run({ async: false });

eightTimesTheSame
  .add("8 calls (the same parameters)", function() {
    process(styles, portrait, Platform);
    process(styles, portrait, Platform);
    process(styles, portrait, Platform);
    process(styles, portrait, Platform);
    process(styles, portrait, Platform);
    process(styles, portrait, Platform);
    process(styles, portrait, Platform);
    process(styles, portrait, Platform);
  })
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").map("name"));
    console.log("-----------------------------------------");
  })
  .run({ async: false });

eightTimesTheSameRequire
  .add("8 calls (the same parameters, require)", function() {
    require("./dist/perf-tests/current").process(styles, portrait, Platform);
    require("./dist/perf-tests/current").process(styles, portrait, Platform);
    require("./dist/perf-tests/current").process(styles, portrait, Platform);
    require("./dist/perf-tests/current").process(styles, portrait, Platform);
    require("./dist/perf-tests/current").process(styles, portrait, Platform);
    require("./dist/perf-tests/current").process(styles, portrait, Platform);
    require("./dist/perf-tests/current").process(styles, portrait, Platform);
    require("./dist/perf-tests/current").process(styles, portrait, Platform);
  })
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").map("name"));
    console.log("-----------------------------------------");
  })
  .run({ async: false });

eightTimes
  .add("8 calls (orientation change)", function() {
    process(styles, portrait, Platform);
    process(styles, landscape, Platform);
    process(styles, portrait, Platform);
    process(styles, landscape, Platform);
    process(styles, portrait, Platform);
    process(styles, landscape, Platform);
    process(styles, portrait, Platform);
    process(styles, landscape, Platform);
  })
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").map("name"));
    console.log("-----------------------------------------");
  })
  .run({ async: false });

eightTimesRequire
  .add("8 calls (orientation change, require)", function() {
    require("./dist/perf-tests/current").process(styles, portrait, Platform);
    require("./dist/perf-tests/current").process(styles, landscape, Platform);
    require("./dist/perf-tests/current").process(styles, portrait, Platform);
    require("./dist/perf-tests/current").process(styles, landscape, Platform);
    require("./dist/perf-tests/current").process(styles, portrait, Platform);
    require("./dist/perf-tests/current").process(styles, landscape, Platform);
    require("./dist/perf-tests/current").process(styles, portrait, Platform);
    require("./dist/perf-tests/current").process(styles, landscape, Platform);
  })
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").map("name"));
    console.log("-----------------------------------------");
  })
  .run({ async: false });
