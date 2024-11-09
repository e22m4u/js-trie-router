"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports2, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug3(...args) {
          if (!debug3.enabled) {
            return;
          }
          const self = debug3;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format2) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format2];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug3.namespace = namespace;
        debug3.useColors = createDebug.useColors();
        debug3.color = createDebug.selectColor(namespace);
        debug3.extend = extend;
        debug3.destroy = createDebug.destroy;
        Object.defineProperty(debug3, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug3);
        }
        return debug3;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env) {
      if (env.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream) {
      const level = supportsColor(stream, stream && stream.isTTY);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports2.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.formatWithOptions(exports2.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug3) {
      debug3.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug3.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports2, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/depd/index.js
var require_depd = __commonJS({
  "node_modules/depd/index.js"(exports2, module2) {
    var relative = require("path").relative;
    module2.exports = depd;
    var basePath = process.cwd();
    function containsNamespace(str, namespace) {
      var vals = str.split(/[ ,]+/);
      var ns = String(namespace).toLowerCase();
      for (var i = 0; i < vals.length; i++) {
        var val = vals[i];
        if (val && (val === "*" || val.toLowerCase() === ns)) {
          return true;
        }
      }
      return false;
    }
    function convertDataDescriptorToAccessor(obj, prop, message) {
      var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
      var value = descriptor.value;
      descriptor.get = function getter() {
        return value;
      };
      if (descriptor.writable) {
        descriptor.set = function setter(val) {
          return value = val;
        };
      }
      delete descriptor.value;
      delete descriptor.writable;
      Object.defineProperty(obj, prop, descriptor);
      return descriptor;
    }
    function createArgumentsString(arity) {
      var str = "";
      for (var i = 0; i < arity; i++) {
        str += ", arg" + i;
      }
      return str.substr(2);
    }
    function createStackString(stack) {
      var str = this.name + ": " + this.namespace;
      if (this.message) {
        str += " deprecated " + this.message;
      }
      for (var i = 0; i < stack.length; i++) {
        str += "\n    at " + stack[i].toString();
      }
      return str;
    }
    function depd(namespace) {
      if (!namespace) {
        throw new TypeError("argument namespace is required");
      }
      var stack = getStack();
      var site = callSiteLocation(stack[1]);
      var file = site[0];
      function deprecate(message) {
        log.call(deprecate, message);
      }
      deprecate._file = file;
      deprecate._ignored = isignored(namespace);
      deprecate._namespace = namespace;
      deprecate._traced = istraced(namespace);
      deprecate._warned = /* @__PURE__ */ Object.create(null);
      deprecate.function = wrapfunction;
      deprecate.property = wrapproperty;
      return deprecate;
    }
    function eehaslisteners(emitter, type) {
      var count = typeof emitter.listenerCount !== "function" ? emitter.listeners(type).length : emitter.listenerCount(type);
      return count > 0;
    }
    function isignored(namespace) {
      if (process.noDeprecation) {
        return true;
      }
      var str = process.env.NO_DEPRECATION || "";
      return containsNamespace(str, namespace);
    }
    function istraced(namespace) {
      if (process.traceDeprecation) {
        return true;
      }
      var str = process.env.TRACE_DEPRECATION || "";
      return containsNamespace(str, namespace);
    }
    function log(message, site) {
      var haslisteners = eehaslisteners(process, "deprecation");
      if (!haslisteners && this._ignored) {
        return;
      }
      var caller;
      var callFile;
      var callSite;
      var depSite;
      var i = 0;
      var seen = false;
      var stack = getStack();
      var file = this._file;
      if (site) {
        depSite = site;
        callSite = callSiteLocation(stack[1]);
        callSite.name = depSite.name;
        file = callSite[0];
      } else {
        i = 2;
        depSite = callSiteLocation(stack[i]);
        callSite = depSite;
      }
      for (; i < stack.length; i++) {
        caller = callSiteLocation(stack[i]);
        callFile = caller[0];
        if (callFile === file) {
          seen = true;
        } else if (callFile === this._file) {
          file = this._file;
        } else if (seen) {
          break;
        }
      }
      var key = caller ? depSite.join(":") + "__" + caller.join(":") : void 0;
      if (key !== void 0 && key in this._warned) {
        return;
      }
      this._warned[key] = true;
      var msg = message;
      if (!msg) {
        msg = callSite === depSite || !callSite.name ? defaultMessage(depSite) : defaultMessage(callSite);
      }
      if (haslisteners) {
        var err = DeprecationError(this._namespace, msg, stack.slice(i));
        process.emit("deprecation", err);
        return;
      }
      var format2 = process.stderr.isTTY ? formatColor : formatPlain;
      var output = format2.call(this, msg, caller, stack.slice(i));
      process.stderr.write(output + "\n", "utf8");
    }
    function callSiteLocation(callSite) {
      var file = callSite.getFileName() || "<anonymous>";
      var line = callSite.getLineNumber();
      var colm = callSite.getColumnNumber();
      if (callSite.isEval()) {
        file = callSite.getEvalOrigin() + ", " + file;
      }
      var site = [file, line, colm];
      site.callSite = callSite;
      site.name = callSite.getFunctionName();
      return site;
    }
    function defaultMessage(site) {
      var callSite = site.callSite;
      var funcName = site.name;
      if (!funcName) {
        funcName = "<anonymous@" + formatLocation(site) + ">";
      }
      var context = callSite.getThis();
      var typeName = context && callSite.getTypeName();
      if (typeName === "Object") {
        typeName = void 0;
      }
      if (typeName === "Function") {
        typeName = context.name || typeName;
      }
      return typeName && callSite.getMethodName() ? typeName + "." + funcName : funcName;
    }
    function formatPlain(msg, caller, stack) {
      var timestamp = (/* @__PURE__ */ new Date()).toUTCString();
      var formatted = timestamp + " " + this._namespace + " deprecated " + msg;
      if (this._traced) {
        for (var i = 0; i < stack.length; i++) {
          formatted += "\n    at " + stack[i].toString();
        }
        return formatted;
      }
      if (caller) {
        formatted += " at " + formatLocation(caller);
      }
      return formatted;
    }
    function formatColor(msg, caller, stack) {
      var formatted = "\x1B[36;1m" + this._namespace + "\x1B[22;39m \x1B[33;1mdeprecated\x1B[22;39m \x1B[0m" + msg + "\x1B[39m";
      if (this._traced) {
        for (var i = 0; i < stack.length; i++) {
          formatted += "\n    \x1B[36mat " + stack[i].toString() + "\x1B[39m";
        }
        return formatted;
      }
      if (caller) {
        formatted += " \x1B[36m" + formatLocation(caller) + "\x1B[39m";
      }
      return formatted;
    }
    function formatLocation(callSite) {
      return relative(basePath, callSite[0]) + ":" + callSite[1] + ":" + callSite[2];
    }
    function getStack() {
      var limit = Error.stackTraceLimit;
      var obj = {};
      var prep = Error.prepareStackTrace;
      Error.prepareStackTrace = prepareObjectStackTrace;
      Error.stackTraceLimit = Math.max(10, limit);
      Error.captureStackTrace(obj);
      var stack = obj.stack.slice(1);
      Error.prepareStackTrace = prep;
      Error.stackTraceLimit = limit;
      return stack;
    }
    function prepareObjectStackTrace(obj, stack) {
      return stack;
    }
    function wrapfunction(fn, message) {
      if (typeof fn !== "function") {
        throw new TypeError("argument fn must be a function");
      }
      var args = createArgumentsString(fn.length);
      var stack = getStack();
      var site = callSiteLocation(stack[1]);
      site.name = fn.name;
      var deprecatedfn = new Function(
        "fn",
        "log",
        "deprecate",
        "message",
        "site",
        '"use strict"\nreturn function (' + args + ") {log.call(deprecate, message, site)\nreturn fn.apply(this, arguments)\n}"
      )(fn, log, this, message, site);
      return deprecatedfn;
    }
    function wrapproperty(obj, prop, message) {
      if (!obj || typeof obj !== "object" && typeof obj !== "function") {
        throw new TypeError("argument obj must be object");
      }
      var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
      if (!descriptor) {
        throw new TypeError("must call property on owner object");
      }
      if (!descriptor.configurable) {
        throw new TypeError("property must be configurable");
      }
      var deprecate = this;
      var stack = getStack();
      var site = callSiteLocation(stack[1]);
      site.name = prop;
      if ("value" in descriptor) {
        descriptor = convertDataDescriptorToAccessor(obj, prop, message);
      }
      var get = descriptor.get;
      var set = descriptor.set;
      if (typeof get === "function") {
        descriptor.get = function getter() {
          log.call(deprecate, message, site);
          return get.apply(this, arguments);
        };
      }
      if (typeof set === "function") {
        descriptor.set = function setter() {
          log.call(deprecate, message, site);
          return set.apply(this, arguments);
        };
      }
      Object.defineProperty(obj, prop, descriptor);
    }
    function DeprecationError(namespace, message, stack) {
      var error = new Error();
      var stackString;
      Object.defineProperty(error, "constructor", {
        value: DeprecationError
      });
      Object.defineProperty(error, "message", {
        configurable: true,
        enumerable: false,
        value: message,
        writable: true
      });
      Object.defineProperty(error, "name", {
        enumerable: false,
        configurable: true,
        value: "DeprecationError",
        writable: true
      });
      Object.defineProperty(error, "namespace", {
        configurable: true,
        enumerable: false,
        value: namespace,
        writable: true
      });
      Object.defineProperty(error, "stack", {
        configurable: true,
        enumerable: false,
        get: function() {
          if (stackString !== void 0) {
            return stackString;
          }
          return stackString = createStackString.call(this, stack);
        },
        set: function setter(val) {
          stackString = val;
        }
      });
      return error;
    }
  }
});

// node_modules/setprototypeof/index.js
var require_setprototypeof = __commonJS({
  "node_modules/setprototypeof/index.js"(exports2, module2) {
    "use strict";
    module2.exports = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties);
    function setProtoOf(obj, proto) {
      obj.__proto__ = proto;
      return obj;
    }
    function mixinProperties(obj, proto) {
      for (var prop in proto) {
        if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
          obj[prop] = proto[prop];
        }
      }
      return obj;
    }
  }
});

// node_modules/statuses/codes.json
var require_codes = __commonJS({
  "node_modules/statuses/codes.json"(exports2, module2) {
    module2.exports = {
      "100": "Continue",
      "101": "Switching Protocols",
      "102": "Processing",
      "103": "Early Hints",
      "200": "OK",
      "201": "Created",
      "202": "Accepted",
      "203": "Non-Authoritative Information",
      "204": "No Content",
      "205": "Reset Content",
      "206": "Partial Content",
      "207": "Multi-Status",
      "208": "Already Reported",
      "226": "IM Used",
      "300": "Multiple Choices",
      "301": "Moved Permanently",
      "302": "Found",
      "303": "See Other",
      "304": "Not Modified",
      "305": "Use Proxy",
      "307": "Temporary Redirect",
      "308": "Permanent Redirect",
      "400": "Bad Request",
      "401": "Unauthorized",
      "402": "Payment Required",
      "403": "Forbidden",
      "404": "Not Found",
      "405": "Method Not Allowed",
      "406": "Not Acceptable",
      "407": "Proxy Authentication Required",
      "408": "Request Timeout",
      "409": "Conflict",
      "410": "Gone",
      "411": "Length Required",
      "412": "Precondition Failed",
      "413": "Payload Too Large",
      "414": "URI Too Long",
      "415": "Unsupported Media Type",
      "416": "Range Not Satisfiable",
      "417": "Expectation Failed",
      "418": "I'm a Teapot",
      "421": "Misdirected Request",
      "422": "Unprocessable Entity",
      "423": "Locked",
      "424": "Failed Dependency",
      "425": "Too Early",
      "426": "Upgrade Required",
      "428": "Precondition Required",
      "429": "Too Many Requests",
      "431": "Request Header Fields Too Large",
      "451": "Unavailable For Legal Reasons",
      "500": "Internal Server Error",
      "501": "Not Implemented",
      "502": "Bad Gateway",
      "503": "Service Unavailable",
      "504": "Gateway Timeout",
      "505": "HTTP Version Not Supported",
      "506": "Variant Also Negotiates",
      "507": "Insufficient Storage",
      "508": "Loop Detected",
      "509": "Bandwidth Limit Exceeded",
      "510": "Not Extended",
      "511": "Network Authentication Required"
    };
  }
});

// node_modules/statuses/index.js
var require_statuses = __commonJS({
  "node_modules/statuses/index.js"(exports2, module2) {
    "use strict";
    var codes = require_codes();
    module2.exports = status;
    status.message = codes;
    status.code = createMessageToStatusCodeMap(codes);
    status.codes = createStatusCodeList(codes);
    status.redirect = {
      300: true,
      301: true,
      302: true,
      303: true,
      305: true,
      307: true,
      308: true
    };
    status.empty = {
      204: true,
      205: true,
      304: true
    };
    status.retry = {
      502: true,
      503: true,
      504: true
    };
    function createMessageToStatusCodeMap(codes2) {
      var map = {};
      Object.keys(codes2).forEach(function forEachCode(code) {
        var message = codes2[code];
        var status2 = Number(code);
        map[message.toLowerCase()] = status2;
      });
      return map;
    }
    function createStatusCodeList(codes2) {
      return Object.keys(codes2).map(function mapCode(code) {
        return Number(code);
      });
    }
    function getStatusCode(message) {
      var msg = message.toLowerCase();
      if (!Object.prototype.hasOwnProperty.call(status.code, msg)) {
        throw new Error('invalid status message: "' + message + '"');
      }
      return status.code[msg];
    }
    function getStatusMessage2(code) {
      if (!Object.prototype.hasOwnProperty.call(status.message, code)) {
        throw new Error("invalid status code: " + code);
      }
      return status.message[code];
    }
    function status(code) {
      if (typeof code === "number") {
        return getStatusMessage2(code);
      }
      if (typeof code !== "string") {
        throw new TypeError("code must be a number or string");
      }
      var n = parseInt(code, 10);
      if (!isNaN(n)) {
        return getStatusMessage2(n);
      }
      return getStatusCode(code);
    }
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports2, module2) {
    if (typeof Object.create === "function") {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports2, module2) {
    try {
      util = require("util");
      if (typeof util.inherits !== "function") throw "";
      module2.exports = util.inherits;
    } catch (e) {
      module2.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/toidentifier/index.js
var require_toidentifier = __commonJS({
  "node_modules/toidentifier/index.js"(exports2, module2) {
    "use strict";
    module2.exports = toIdentifier;
    function toIdentifier(str) {
      return str.split(" ").map(function(token) {
        return token.slice(0, 1).toUpperCase() + token.slice(1);
      }).join("").replace(/[^ _0-9a-z]/gi, "");
    }
  }
});

// node_modules/http-errors/index.js
var require_http_errors = __commonJS({
  "node_modules/http-errors/index.js"(exports2, module2) {
    "use strict";
    var deprecate = require_depd()("http-errors");
    var setPrototypeOf = require_setprototypeof();
    var statuses = require_statuses();
    var inherits = require_inherits();
    var toIdentifier = require_toidentifier();
    module2.exports = createError2;
    module2.exports.HttpError = createHttpErrorConstructor();
    module2.exports.isHttpError = createIsHttpErrorFunction(module2.exports.HttpError);
    populateConstructorExports(module2.exports, statuses.codes, module2.exports.HttpError);
    function codeClass(status) {
      return Number(String(status).charAt(0) + "00");
    }
    function createError2() {
      var err;
      var msg;
      var status = 500;
      var props = {};
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        var type = typeof arg;
        if (type === "object" && arg instanceof Error) {
          err = arg;
          status = err.status || err.statusCode || status;
        } else if (type === "number" && i === 0) {
          status = arg;
        } else if (type === "string") {
          msg = arg;
        } else if (type === "object") {
          props = arg;
        } else {
          throw new TypeError("argument #" + (i + 1) + " unsupported type " + type);
        }
      }
      if (typeof status === "number" && (status < 400 || status >= 600)) {
        deprecate("non-error status code; use only 4xx or 5xx status codes");
      }
      if (typeof status !== "number" || !statuses.message[status] && (status < 400 || status >= 600)) {
        status = 500;
      }
      var HttpError = createError2[status] || createError2[codeClass(status)];
      if (!err) {
        err = HttpError ? new HttpError(msg) : new Error(msg || statuses.message[status]);
        Error.captureStackTrace(err, createError2);
      }
      if (!HttpError || !(err instanceof HttpError) || err.status !== status) {
        err.expose = status < 500;
        err.status = err.statusCode = status;
      }
      for (var key in props) {
        if (key !== "status" && key !== "statusCode") {
          err[key] = props[key];
        }
      }
      return err;
    }
    function createHttpErrorConstructor() {
      function HttpError() {
        throw new TypeError("cannot construct abstract class");
      }
      inherits(HttpError, Error);
      return HttpError;
    }
    function createClientErrorConstructor(HttpError, name, code) {
      var className = toClassName(name);
      function ClientError(message) {
        var msg = message != null ? message : statuses.message[code];
        var err = new Error(msg);
        Error.captureStackTrace(err, ClientError);
        setPrototypeOf(err, ClientError.prototype);
        Object.defineProperty(err, "message", {
          enumerable: true,
          configurable: true,
          value: msg,
          writable: true
        });
        Object.defineProperty(err, "name", {
          enumerable: false,
          configurable: true,
          value: className,
          writable: true
        });
        return err;
      }
      inherits(ClientError, HttpError);
      nameFunc(ClientError, className);
      ClientError.prototype.status = code;
      ClientError.prototype.statusCode = code;
      ClientError.prototype.expose = true;
      return ClientError;
    }
    function createIsHttpErrorFunction(HttpError) {
      return function isHttpError(val) {
        if (!val || typeof val !== "object") {
          return false;
        }
        if (val instanceof HttpError) {
          return true;
        }
        return val instanceof Error && typeof val.expose === "boolean" && typeof val.statusCode === "number" && val.status === val.statusCode;
      };
    }
    function createServerErrorConstructor(HttpError, name, code) {
      var className = toClassName(name);
      function ServerError(message) {
        var msg = message != null ? message : statuses.message[code];
        var err = new Error(msg);
        Error.captureStackTrace(err, ServerError);
        setPrototypeOf(err, ServerError.prototype);
        Object.defineProperty(err, "message", {
          enumerable: true,
          configurable: true,
          value: msg,
          writable: true
        });
        Object.defineProperty(err, "name", {
          enumerable: false,
          configurable: true,
          value: className,
          writable: true
        });
        return err;
      }
      inherits(ServerError, HttpError);
      nameFunc(ServerError, className);
      ServerError.prototype.status = code;
      ServerError.prototype.statusCode = code;
      ServerError.prototype.expose = false;
      return ServerError;
    }
    function nameFunc(func, name) {
      var desc = Object.getOwnPropertyDescriptor(func, "name");
      if (desc && desc.configurable) {
        desc.value = name;
        Object.defineProperty(func, "name", desc);
      }
    }
    function populateConstructorExports(exports3, codes, HttpError) {
      codes.forEach(function forEachCode(code) {
        var CodeError;
        var name = toIdentifier(statuses.message[code]);
        switch (codeClass(code)) {
          case 400:
            CodeError = createClientErrorConstructor(HttpError, name, code);
            break;
          case 500:
            CodeError = createServerErrorConstructor(HttpError, name, code);
            break;
        }
        if (CodeError) {
          exports3[code] = CodeError;
          exports3[name] = CodeError;
        }
      });
    }
    function toClassName(name) {
      return name.substr(-5) !== "Error" ? name + "Error" : name;
    }
  }
});

// node_modules/path-to-regexp/dist/index.js
var require_dist = __commonJS({
  "node_modules/path-to-regexp/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TokenData = void 0;
    exports2.parse = parse;
    exports2.compile = compile;
    exports2.match = match;
    exports2.pathToRegexp = pathToRegexp2;
    exports2.stringify = stringify;
    var DEFAULT_DELIMITER = "/";
    var NOOP_VALUE = (value) => value;
    var ID_START = /^[$_\p{ID_Start}]$/u;
    var ID_CONTINUE = /^[$\u200c\u200d\p{ID_Continue}]$/u;
    var DEBUG_URL = "https://git.new/pathToRegexpError";
    var SIMPLE_TOKENS = {
      // Groups.
      "{": "{",
      "}": "}",
      // Reserved.
      "(": "(",
      ")": ")",
      "[": "[",
      "]": "]",
      "+": "+",
      "?": "?",
      "!": "!"
    };
    function escapeText(str) {
      return str.replace(/[{}()\[\]+?!:*]/g, "\\$&");
    }
    function escape(str) {
      return str.replace(/[.+*?^${}()[\]|/\\]/g, "\\$&");
    }
    function* lexer(str) {
      const chars = [...str];
      let i = 0;
      function name() {
        let value = "";
        if (ID_START.test(chars[++i])) {
          value += chars[i];
          while (ID_CONTINUE.test(chars[++i])) {
            value += chars[i];
          }
        } else if (chars[i] === '"') {
          let pos = i;
          while (i < chars.length) {
            if (chars[++i] === '"') {
              i++;
              pos = 0;
              break;
            }
            if (chars[i] === "\\") {
              value += chars[++i];
            } else {
              value += chars[i];
            }
          }
          if (pos) {
            throw new TypeError(`Unterminated quote at ${pos}: ${DEBUG_URL}`);
          }
        }
        if (!value) {
          throw new TypeError(`Missing parameter name at ${i}: ${DEBUG_URL}`);
        }
        return value;
      }
      while (i < chars.length) {
        const value = chars[i];
        const type = SIMPLE_TOKENS[value];
        if (type) {
          yield { type, index: i++, value };
        } else if (value === "\\") {
          yield { type: "ESCAPED", index: i++, value: chars[i++] };
        } else if (value === ":") {
          const value2 = name();
          yield { type: "PARAM", index: i, value: value2 };
        } else if (value === "*") {
          const value2 = name();
          yield { type: "WILDCARD", index: i, value: value2 };
        } else {
          yield { type: "CHAR", index: i, value: chars[i++] };
        }
      }
      return { type: "END", index: i, value: "" };
    }
    var Iter = class {
      constructor(tokens) {
        this.tokens = tokens;
      }
      peek() {
        if (!this._peek) {
          const next = this.tokens.next();
          this._peek = next.value;
        }
        return this._peek;
      }
      tryConsume(type) {
        const token = this.peek();
        if (token.type !== type)
          return;
        this._peek = void 0;
        return token.value;
      }
      consume(type) {
        const value = this.tryConsume(type);
        if (value !== void 0)
          return value;
        const { type: nextType, index } = this.peek();
        throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${type}: ${DEBUG_URL}`);
      }
      text() {
        let result = "";
        let value;
        while (value = this.tryConsume("CHAR") || this.tryConsume("ESCAPED")) {
          result += value;
        }
        return result;
      }
    };
    var TokenData = class {
      constructor(tokens) {
        this.tokens = tokens;
      }
    };
    exports2.TokenData = TokenData;
    function parse(str, options = {}) {
      const { encodePath = NOOP_VALUE } = options;
      const it = new Iter(lexer(str));
      function consume(endType) {
        const tokens2 = [];
        while (true) {
          const path = it.text();
          if (path)
            tokens2.push({ type: "text", value: encodePath(path) });
          const param = it.tryConsume("PARAM");
          if (param) {
            tokens2.push({
              type: "param",
              name: param
            });
            continue;
          }
          const wildcard = it.tryConsume("WILDCARD");
          if (wildcard) {
            tokens2.push({
              type: "wildcard",
              name: wildcard
            });
            continue;
          }
          const open = it.tryConsume("{");
          if (open) {
            tokens2.push({
              type: "group",
              tokens: consume("}")
            });
            continue;
          }
          it.consume(endType);
          return tokens2;
        }
      }
      const tokens = consume("END");
      return new TokenData(tokens);
    }
    function compile(path, options = {}) {
      const { encode = encodeURIComponent, delimiter = DEFAULT_DELIMITER } = options;
      const data = path instanceof TokenData ? path : parse(path, options);
      const fn = tokensToFunction(data.tokens, delimiter, encode);
      return function path2(data2 = {}) {
        const [path3, ...missing] = fn(data2);
        if (missing.length) {
          throw new TypeError(`Missing parameters: ${missing.join(", ")}`);
        }
        return path3;
      };
    }
    function tokensToFunction(tokens, delimiter, encode) {
      const encoders = tokens.map((token) => tokenToFunction(token, delimiter, encode));
      return (data) => {
        const result = [""];
        for (const encoder of encoders) {
          const [value, ...extras] = encoder(data);
          result[0] += value;
          result.push(...extras);
        }
        return result;
      };
    }
    function tokenToFunction(token, delimiter, encode) {
      if (token.type === "text")
        return () => [token.value];
      if (token.type === "group") {
        const fn = tokensToFunction(token.tokens, delimiter, encode);
        return (data) => {
          const [value, ...missing] = fn(data);
          if (!missing.length)
            return [value];
          return [""];
        };
      }
      const encodeValue = encode || NOOP_VALUE;
      if (token.type === "wildcard" && encode !== false) {
        return (data) => {
          const value = data[token.name];
          if (value == null)
            return ["", token.name];
          if (!Array.isArray(value) || value.length === 0) {
            throw new TypeError(`Expected "${token.name}" to be a non-empty array`);
          }
          return [
            value.map((value2, index) => {
              if (typeof value2 !== "string") {
                throw new TypeError(`Expected "${token.name}/${index}" to be a string`);
              }
              return encodeValue(value2);
            }).join(delimiter)
          ];
        };
      }
      return (data) => {
        const value = data[token.name];
        if (value == null)
          return ["", token.name];
        if (typeof value !== "string") {
          throw new TypeError(`Expected "${token.name}" to be a string`);
        }
        return [encodeValue(value)];
      };
    }
    function match(path, options = {}) {
      const { decode = decodeURIComponent, delimiter = DEFAULT_DELIMITER } = options;
      const { regexp, keys } = pathToRegexp2(path, options);
      const decoders = keys.map((key) => {
        if (decode === false)
          return NOOP_VALUE;
        if (key.type === "param")
          return decode;
        return (value) => value.split(delimiter).map(decode);
      });
      return function match2(input) {
        const m = regexp.exec(input);
        if (!m)
          return false;
        const path2 = m[0];
        const params = /* @__PURE__ */ Object.create(null);
        for (let i = 1; i < m.length; i++) {
          if (m[i] === void 0)
            continue;
          const key = keys[i - 1];
          const decoder = decoders[i - 1];
          params[key.name] = decoder(m[i]);
        }
        return { path: path2, params };
      };
    }
    function pathToRegexp2(path, options = {}) {
      const { delimiter = DEFAULT_DELIMITER, end = true, sensitive = false, trailing = true } = options;
      const keys = [];
      const sources = [];
      const flags = sensitive ? "" : "i";
      const paths = Array.isArray(path) ? path : [path];
      const items = paths.map((path2) => path2 instanceof TokenData ? path2 : parse(path2, options));
      for (const { tokens } of items) {
        for (const seq of flatten(tokens, 0, [])) {
          const regexp2 = sequenceToRegExp(seq, delimiter, keys);
          sources.push(regexp2);
        }
      }
      let pattern = `^(?:${sources.join("|")})`;
      if (trailing)
        pattern += `(?:${escape(delimiter)}$)?`;
      pattern += end ? "$" : `(?=${escape(delimiter)}|$)`;
      const regexp = new RegExp(pattern, flags);
      return { regexp, keys };
    }
    function* flatten(tokens, index, init) {
      if (index === tokens.length) {
        return yield init;
      }
      const token = tokens[index];
      if (token.type === "group") {
        const fork = init.slice();
        for (const seq of flatten(token.tokens, 0, fork)) {
          yield* flatten(tokens, index + 1, seq);
        }
      } else {
        init.push(token);
      }
      yield* flatten(tokens, index + 1, init);
    }
    function sequenceToRegExp(tokens, delimiter, keys) {
      let result = "";
      let backtrack = "";
      let isSafeSegmentParam = true;
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.type === "text") {
          result += escape(token.value);
          backtrack += token.value;
          isSafeSegmentParam || (isSafeSegmentParam = token.value.includes(delimiter));
          continue;
        }
        if (token.type === "param" || token.type === "wildcard") {
          if (!isSafeSegmentParam && !backtrack) {
            throw new TypeError(`Missing text after "${token.name}": ${DEBUG_URL}`);
          }
          if (token.type === "param") {
            result += `(${negate(delimiter, isSafeSegmentParam ? "" : backtrack)}+)`;
          } else {
            result += `([\\s\\S]+)`;
          }
          keys.push(token);
          backtrack = "";
          isSafeSegmentParam = false;
          continue;
        }
      }
      return result;
    }
    function negate(delimiter, backtrack) {
      if (backtrack.length < 2) {
        if (delimiter.length < 2)
          return `[^${escape(delimiter + backtrack)}]`;
        return `(?:(?!${escape(delimiter)})[^${escape(backtrack)}])`;
      }
      if (delimiter.length < 2) {
        return `(?:(?!${escape(backtrack)})[^${escape(delimiter)}])`;
      }
      return `(?:(?!${escape(backtrack)}|${escape(delimiter)})[\\s\\S])`;
    }
    function stringify(data) {
      return data.tokens.map(function stringifyToken(token, index, tokens) {
        if (token.type === "text")
          return escapeText(token.value);
        if (token.type === "group") {
          return `{${token.tokens.map(stringifyToken).join("")}}`;
        }
        const isSafe = isNameSafe(token.name) && isNextNameSafe(tokens[index + 1]);
        const key = isSafe ? token.name : JSON.stringify(token.name);
        if (token.type === "param")
          return `:${key}`;
        if (token.type === "wildcard")
          return `*${key}`;
        throw new TypeError(`Unexpected token: ${token}`);
      }).join("");
    }
    function isNameSafe(name) {
      const [first, ...rest] = name;
      if (!ID_START.test(first))
        return false;
      return rest.every((char) => ID_CONTINUE.test(char));
    }
    function isNextNameSafe(token) {
      if ((token === null || token === void 0 ? void 0 : token.type) !== "text")
        return true;
      return !ID_CONTINUE.test(token.value[0]);
    }
  }
});

// src/index.js
var src_exports = {};
__export(src_exports, {
  BUFFER_ENCODING_LIST: () => BUFFER_ENCODING_LIST,
  BodyParser: () => BodyParser,
  CookieParser: () => CookieParser,
  DataSender: () => DataSender,
  EXPOSED_ERROR_PROPERTIES: () => EXPOSED_ERROR_PROPERTIES,
  ErrorSender: () => ErrorSender,
  HookInvoker: () => HookInvoker,
  HookName: () => HookName,
  HookRegistry: () => HookRegistry,
  HttpMethod: () => HttpMethod,
  METHODS_WITH_BODY: () => METHODS_WITH_BODY,
  QueryParser: () => QueryParser,
  RequestContext: () => RequestContext,
  RequestParser: () => RequestParser,
  Route: () => Route,
  RouteRegistry: () => RouteRegistry,
  RouterOptions: () => RouterOptions,
  TrieRouter: () => TrieRouter,
  UNPARSABLE_MEDIA_TYPES: () => UNPARSABLE_MEDIA_TYPES,
  createCookieString: () => createCookieString,
  createDebugger: () => createDebugger,
  createError: () => createError,
  createRequestMock: () => createRequestMock,
  createResponseMock: () => createResponseMock,
  fetchRequestBody: () => fetchRequestBody,
  getRequestPathname: () => getRequestPathname,
  isPromise: () => isPromise,
  isReadableStream: () => isReadableStream,
  isResponseSent: () => isResponseSent,
  isWritableStream: () => isWritableStream,
  parseContentType: () => parseContentType,
  parseCookie: () => parseCookie,
  parseJsonBody: () => parseJsonBody,
  toCamelCase: () => toCamelCase
});
module.exports = __toCommonJS(src_exports);

// node_modules/@e22m4u/js-format/src/utils/is-class.js
function isClass(value) {
  if (!value) return false;
  return typeof value === "function" && /^class\s/.test(Function.prototype.toString.call(value));
}

// node_modules/@e22m4u/js-format/src/value-to-string.js
var BASE_CTOR_NAMES = [
  "String",
  "Number",
  "Boolean",
  "Object",
  "Array",
  "Function",
  "Symbol",
  "Map",
  "Set",
  "Date"
];
function valueToString(input) {
  if (input == null) return String(input);
  if (typeof input === "string") return `"${input}"`;
  if (typeof input === "number" || typeof input === "boolean")
    return String(input);
  if (isClass(input)) return input.name ? input.name : "Class";
  if (input.constructor && input.constructor.name)
    return BASE_CTOR_NAMES.includes(input.constructor.name) ? input.constructor.name : `${input.constructor.name} (instance)`;
  if (typeof input === "object" && input.constructor == null) return "Object";
  return String(input);
}

// node_modules/@e22m4u/js-format/src/array-to-list.js
var SEPARATOR = ", ";
function arrayToList(input) {
  if (Array.isArray(input) && input.length)
    return input.map(valueToString).join(SEPARATOR);
  return valueToString(input);
}

// node_modules/@e22m4u/js-format/src/format.js
function format(pattern) {
  if (pattern instanceof Date) {
    pattern = pattern.toISOString();
  } else if (typeof pattern !== "string") {
    pattern = String(pattern);
  }
  const re = /(%?)(%([sdjvl]))/g;
  const args = Array.prototype.slice.call(arguments, 1);
  if (args.length) {
    pattern = pattern.replace(re, function(match, escaped, ptn, flag) {
      let arg = args.shift();
      switch (flag) {
        case "s":
          arg = String(arg);
          break;
        case "d":
          arg = Number(arg);
          break;
        case "j":
          arg = JSON.stringify(arg);
          break;
        case "v":
          arg = valueToString(arg);
          break;
        case "l":
          arg = arrayToList(arg);
          break;
      }
      if (!escaped) return arg;
      args.unshift(arg);
      return match;
    });
  }
  if (args.length) pattern += " " + args.join(" ");
  pattern = pattern.replace(/%{2}/g, "%");
  return "" + pattern;
}

// node_modules/@e22m4u/js-format/src/errorf.js
var Errorf = class extends Error {
  /**
   * Constructor.
   *
   * @param {string|undefined} pattern
   * @param {any} args
   */
  constructor(pattern = void 0, ...args) {
    const message = pattern != null ? format(pattern, ...args) : void 0;
    super(message);
  }
};

// src/utils/is-promise.js
function isPromise(value) {
  if (!value) return false;
  if (typeof value !== "object") return false;
  return typeof value.then === "function";
}

// src/utils/parse-cookie.js
function parseCookie(input) {
  if (typeof input !== "string")
    throw new Errorf(
      'The first parameter of "parseCookie" should be a String, but %v given.',
      input
    );
  return input.split(";").filter((v) => v !== "").map((v) => v.split("=")).reduce((cookies, tuple) => {
    const key = decodeURIComponent(tuple[0]).trim();
    cookies[key] = decodeURIComponent(tuple[1]).trim();
    return cookies;
  }, {});
}

// src/utils/create-error.js
function createError(errorCtor, message, ...args) {
  if (typeof errorCtor !== "function")
    throw new Errorf(
      'The first argument of "createError" should be a constructor, but %v given.',
      errorCtor
    );
  if (message != null && typeof message !== "string")
    throw new Errorf(
      'The second argument of "createError" should be a String, but %v given.',
      message
    );
  if (message == null) return new errorCtor();
  const interpolatedMessage = format(message, ...args);
  return new errorCtor(interpolatedMessage);
}

// src/utils/to-camel-case.js
function toCamelCase(input) {
  if (typeof input !== "string")
    throw new Errorf(
      'The first argument of "toCamelCase" should be a String, but %v given.',
      input
    );
  return input.replace(/(^\w|[A-Z]|\b\w)/g, (c) => c.toUpperCase()).replace(/\W+/g, "").replace(/(^\w)/g, (c) => c.toLowerCase());
}

// src/utils/create-debugger.js
var import_debug = __toESM(require_src(), 1);
function createDebugger(name) {
  if (typeof name !== "string")
    throw new Errorf(
      'The first argument of "createDebugger" should be a String, but %v given.',
      name
    );
  const debug3 = (0, import_debug.default)(`jsTrieRouter:${name}`);
  return function(message, ...args) {
    const interpolatedMessage = format(message, ...args);
    return debug3(interpolatedMessage);
  };
}

// src/utils/is-response-sent.js
function isResponseSent(res) {
  if (!res || typeof res !== "object" || Array.isArray(res) || typeof res.headersSent !== "boolean") {
    throw new Errorf(
      'The first argument of "isResponseSent" should be an instance of ServerResponse, but %v given.',
      res
    );
  }
  return res.headersSent;
}

// src/utils/is-readable-stream.js
function isReadableStream(value) {
  if (!value || typeof value !== "object") return false;
  return typeof value.pipe === "function";
}

// src/utils/parse-content-type.js
function parseContentType(input) {
  if (typeof input !== "string")
    throw new Errorf(
      'The parameter "input" of "parseContentType" should be a String, but %v given.',
      input
    );
  const res = { mediaType: void 0, charset: void 0, boundary: void 0 };
  const re = /^\s*([^\s;/]+\/[^\s;/]+)(?:;\s*charset=([^\s;]+))?(?:;\s*boundary=([^\s;]+))?.*$/i;
  const matches = re.exec(input);
  if (matches && matches[1]) {
    res.mediaType = matches[1];
    if (matches[2]) res.charset = matches[2];
    if (matches[3]) res.boundary = matches[3];
  }
  return res;
}

// src/utils/is-writable-stream.js
function isWritableStream(value) {
  if (!value || typeof value !== "object") return false;
  return typeof value.end === "function";
}

// src/utils/fetch-request-body.js
var import_http_errors = __toESM(require_http_errors(), 1);
var import_http = require("http");
var BUFFER_ENCODING_LIST = [
  "ascii",
  "utf8",
  "utf-8",
  "utf16le",
  "utf-16le",
  "ucs2",
  "ucs-2",
  "base64",
  "base64url",
  "latin1",
  "binary",
  "hex"
];
function fetchRequestBody(req, bodyBytesLimit = 0) {
  if (!(req instanceof import_http.IncomingMessage))
    throw new Errorf(
      'The first parameter of "fetchRequestBody" should be an IncomingMessage instance, but %v given.',
      req
    );
  if (typeof bodyBytesLimit !== "number")
    throw new Errorf(
      'The parameter "bodyBytesLimit" of "fetchRequestBody" should be a number, but %v given.',
      bodyBytesLimit
    );
  return new Promise((resolve, reject) => {
    const contentLength = parseInt(req.headers["content-length"] || "0", 10);
    if (bodyBytesLimit && contentLength && contentLength > bodyBytesLimit)
      throw createError(
        import_http_errors.default.PayloadTooLarge,
        "Request body limit is %s bytes, but %s bytes given.",
        bodyBytesLimit,
        contentLength
      );
    let encoding = "utf-8";
    const contentType = req.headers["content-type"] || "";
    if (contentType) {
      const parsedContentType = parseContentType(contentType);
      if (parsedContentType && parsedContentType.charset) {
        encoding = parsedContentType.charset.toLowerCase();
        if (!BUFFER_ENCODING_LIST.includes(encoding))
          throw createError(
            import_http_errors.default.UnsupportedMediaType,
            "Request encoding %v is not supported.",
            encoding
          );
      }
    }
    const data = [];
    let receivedLength = 0;
    const onData = (chunk) => {
      receivedLength += chunk.length;
      if (bodyBytesLimit && receivedLength > bodyBytesLimit) {
        req.removeAllListeners();
        const error = createError(
          import_http_errors.default.PayloadTooLarge,
          "Request body limit is %v bytes, but %v bytes given.",
          bodyBytesLimit,
          receivedLength
        );
        reject(error);
        return;
      }
      data.push(chunk);
    };
    const onEnd = () => {
      req.removeAllListeners();
      if (contentLength && contentLength !== receivedLength) {
        const error = createError(
          import_http_errors.default.BadRequest,
          'Received bytes do not match the "content-length" header.'
        );
        reject(error);
        return;
      }
      const buffer = Buffer.concat(data);
      const body = Buffer.from(buffer, encoding).toString();
      resolve(body || void 0);
    };
    const onError = (error) => {
      req.removeAllListeners();
      reject((0, import_http_errors.default)(400, error));
    };
    req.on("data", onData);
    req.on("end", onEnd);
    req.on("error", onError);
    req.resume();
  });
}

// src/utils/create-request-mock.js
var import_net = require("net");
var import_tls = require("tls");
var import_http2 = require("http");
var import_querystring = __toESM(require("querystring"), 1);

// src/utils/create-cookie-string.js
function createCookieString(data) {
  if (!data || typeof data !== "object" || Array.isArray(data))
    throw new Errorf(
      'The first parameter of "createCookieString" should be an Object, but %v given.',
      data
    );
  let cookies = "";
  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
    const val = data[key];
    if (val == null) continue;
    cookies += `${key}=${val}; `;
  }
  return cookies.trim();
}

// src/utils/create-request-mock.js
function createRequestMock(patch) {
  if (patch != null && typeof patch !== "object" || Array.isArray(patch)) {
    throw new Errorf(
      'The first parameter of "createRequestMock" should be an Object, but %v given.',
      patch
    );
  }
  patch = patch || {};
  if (patch.host != null && typeof patch.host !== "string")
    throw new Errorf(
      'The parameter "host" of "createRequestMock" should be a String, but %v given.',
      patch.host
    );
  if (patch.method != null && typeof patch.method !== "string")
    throw new Errorf(
      'The parameter "method" of "createRequestMock" should be a String, but %v given.',
      patch.method
    );
  if (patch.secure != null && typeof patch.secure !== "boolean")
    throw new Errorf(
      'The parameter "secure" of "createRequestMock" should be a Boolean, but %v given.',
      patch.secure
    );
  if (patch.path != null && typeof patch.path !== "string")
    throw new Errorf(
      'The parameter "path" of "createRequestMock" should be a String, but %v given.',
      patch.path
    );
  if (patch.query != null && typeof patch.query !== "object" && typeof patch.query !== "string" || Array.isArray(patch.query)) {
    throw new Errorf(
      'The parameter "query" of "createRequestMock" should be a String or Object, but %v given.',
      patch.query
    );
  }
  if (patch.cookie != null && typeof patch.cookie !== "string" && typeof patch.cookie !== "object" || Array.isArray(patch.cookie)) {
    throw new Errorf(
      'The parameter "cookie" of "createRequestMock" should be a String or Object, but %v given.',
      patch.cookie
    );
  }
  if (patch.headers != null && typeof patch.headers !== "object" || Array.isArray(patch.headers)) {
    throw new Errorf(
      'The parameter "headers" of "createRequestMock" should be an Object, but %v given.',
      patch.headers
    );
  }
  if (patch.stream != null && !isReadableStream(patch.stream))
    throw new Errorf(
      'The parameter "stream" of "createRequestMock" should be a Stream, but %v given.',
      patch.stream
    );
  if (patch.encoding != null) {
    if (typeof patch.encoding !== "string")
      throw new Errorf(
        'The parameter "encoding" of "createRequestMock" should be a String, but %v given.',
        patch.encoding
      );
    if (!BUFFER_ENCODING_LIST.includes(patch.encoding))
      throw new Errorf("Buffer encoding %v is not supported.", patch.encoding);
  }
  if (patch.stream) {
    if (patch.secure != null)
      throw new Errorf(
        'The "createRequestMock" does not allow specifying the "stream" and "secure" options simultaneously.'
      );
    if (patch.body != null)
      throw new Errorf(
        'The "createRequestMock" does not allow specifying the "stream" and "body" options simultaneously.'
      );
    if (patch.encoding != null)
      throw new Errorf(
        'The "createRequestMock" does not allow specifying the "stream" and "encoding" options simultaneously.'
      );
  }
  const req = patch.stream || createRequestStream(patch.secure, patch.body, patch.encoding);
  req.url = createRequestUrl(patch.path || "/", patch.query);
  req.headers = createRequestHeaders(
    patch.host,
    patch.secure,
    patch.body,
    patch.cookie,
    patch.encoding,
    patch.headers
  );
  req.method = (patch.method || "get").toUpperCase();
  return req;
}
function createRequestStream(secure, body, encoding) {
  if (encoding != null && typeof encoding !== "string")
    throw new Errorf(
      'The parameter "encoding" of "createRequestStream" should be a String, but %v given.',
      encoding
    );
  encoding = encoding || "utf-8";
  let socket = new import_net.Socket();
  if (secure) socket = new import_tls.TLSSocket(socket);
  const req = new import_http2.IncomingMessage(socket);
  if (body != null) {
    if (typeof body === "string") {
      req.push(body, encoding);
    } else if (Buffer.isBuffer(body)) {
      req.push(body);
    } else {
      req.push(JSON.stringify(body));
    }
  }
  req.push(null);
  return req;
}
function createRequestUrl(path, query) {
  if (typeof path !== "string")
    throw new Errorf(
      'The parameter "path" of "createRequestUrl" should be a String, but %v given.',
      path
    );
  if (query != null && typeof query !== "string" && typeof query !== "object" || Array.isArray(query)) {
    throw new Errorf(
      'The parameter "query" of "createRequestUrl" should be a String or Object, but %v given.',
      query
    );
  }
  let url = ("/" + path).replace("//", "/");
  if (typeof query === "object") {
    const qs = import_querystring.default.stringify(query);
    if (qs) url += `?${qs}`;
  } else if (typeof query === "string") {
    url += `?${query.replace(/^\?/, "")}`;
  }
  return url;
}
function createRequestHeaders(host, secure, body, cookie, encoding, headers) {
  if (host != null && typeof host !== "string")
    throw new Errorf(
      'The parameter "host" of "createRequestHeaders" a non-empty String, but %v given.',
      host
    );
  host = host || "localhost";
  if (secure != null && typeof secure !== "boolean")
    throw new Errorf(
      'The parameter "secure" of "createRequestHeaders" should be a String, but %v given.',
      secure
    );
  secure = Boolean(secure);
  if (cookie != null && typeof cookie !== "object" && typeof cookie !== "string" || Array.isArray(cookie)) {
    throw new Errorf(
      'The parameter "cookie" of "createRequestHeaders" should be a String or Object, but %v given.',
      cookie
    );
  }
  if (headers != null && typeof headers !== "object" || Array.isArray(headers)) {
    throw new Errorf(
      'The parameter "headers" of "createRequestHeaders" should be an Object, but %v given.',
      headers
    );
  }
  headers = headers || {};
  if (encoding != null && typeof encoding !== "string")
    throw new Errorf(
      'The parameter "encoding" of "createRequestHeaders" should be a String, but %v given.',
      encoding
    );
  encoding = encoding || "utf-8";
  const obj = { ...headers };
  obj["host"] = host;
  if (secure) obj["x-forwarded-proto"] = "https";
  if (cookie != null) {
    if (typeof cookie === "string") {
      obj["cookie"] = obj["cookie"] ? obj["cookie"] : "";
      obj["cookie"] += cookie;
    } else if (typeof cookie === "object") {
      obj["cookie"] = obj["cookie"] ? obj["cookie"] : "";
      obj["cookie"] += createCookieString(cookie);
    }
  }
  if (obj["content-type"] == null) {
    if (typeof body === "string") {
      obj["content-type"] = "text/plain";
    } else if (Buffer.isBuffer(body)) {
      obj["content-type"] = "application/octet-stream";
    } else if (typeof body === "object" || typeof body === "boolean" || typeof body === "number") {
      obj["content-type"] = "application/json";
    }
  }
  if (body != null && obj["content-length"] == null) {
    if (typeof body === "string") {
      const length = Buffer.byteLength(body, encoding);
      obj["content-length"] = String(length);
    } else if (Buffer.isBuffer(body)) {
      const length = Buffer.byteLength(body);
      obj["content-length"] = String(length);
    } else if (typeof body === "object" || typeof body === "boolean" || typeof body === "number") {
      const json = JSON.stringify(body);
      const length = Buffer.byteLength(json, encoding);
      obj["content-length"] = String(length);
    }
  }
  return obj;
}

// src/utils/create-response-mock.js
var import_stream = require("stream");
function createResponseMock() {
  const res = new import_stream.PassThrough();
  patchEncoding(res);
  patchHeaders(res);
  patchBody(res);
  return res;
}
function patchEncoding(res) {
  Object.defineProperty(res, "_encoding", {
    configurable: true,
    writable: true,
    value: void 0
  });
  Object.defineProperty(res, "setEncoding", {
    configurable: true,
    value: function(enc) {
      this._encoding = enc;
      return this;
    }
  });
  Object.defineProperty(res, "getEncoding", {
    configurable: true,
    value: function() {
      return this._encoding;
    }
  });
}
function patchHeaders(res) {
  Object.defineProperty(res, "_headersSent", {
    configurable: true,
    writable: true,
    value: false
  });
  Object.defineProperty(res, "headersSent", {
    configurable: true,
    get() {
      return this._headersSent;
    }
  });
  Object.defineProperty(res, "_headers", {
    configurable: true,
    writable: true,
    value: {}
  });
  Object.defineProperty(res, "setHeader", {
    configurable: true,
    value: function(name, value) {
      if (this.headersSent)
        throw new Error(
          "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client"
        );
      const key = name.toLowerCase();
      this._headers[key] = String(value);
      return this;
    }
  });
  Object.defineProperty(res, "getHeader", {
    configurable: true,
    value: function(name) {
      return this._headers[name.toLowerCase()];
    }
  });
  Object.defineProperty(res, "getHeaders", {
    configurable: true,
    value: function() {
      return JSON.parse(JSON.stringify(this._headers));
    }
  });
}
function patchBody(res) {
  let resolve, reject;
  const promise = new Promise((res2, rej) => {
    resolve = res2;
    reject = rej;
  });
  const data = [];
  res.on("data", (c) => data.push(c));
  res.on("error", (e) => reject(e));
  res.on("end", () => {
    res._headersSent = true;
    resolve(Buffer.concat(data));
  });
  Object.defineProperty(res, "getBody", {
    configurable: true,
    value: function() {
      return promise.then((buffer) => {
        const enc = this.getEncoding();
        const str = buffer.toString(enc);
        return data.length ? str : void 0;
      });
    }
  });
}

// src/utils/get-request-pathname.js
function getRequestPathname(req) {
  if (!req || typeof req !== "object" || Array.isArray(req) || typeof req.url !== "string") {
    throw new Errorf(
      'The first argument of "getRequestPathname" should be an instance of IncomingMessage, but %v given.',
      req
    );
  }
  return (req.url || "/").replace(/\?.*$/, "");
}

// node_modules/@e22m4u/js-service/src/errors/invalid-argument-error.js
var InvalidArgumentError = class extends Errorf {
};

// node_modules/@e22m4u/js-service/src/service-container.js
var ServiceContainer = class _ServiceContainer {
  /**
   * Services map.
   *
   * @type {Map<any, any>}
   * @private
   */
  _services = /* @__PURE__ */ new Map();
  /**
   * Parent container.
   *
   * @type {ServiceContainer}
   * @private
   */
  _parent;
  /**
   * Constructor.
   *
   * @param {ServiceContainer|undefined} parent
   */
  constructor(parent = void 0) {
    if (parent != null) {
      if (!(parent instanceof _ServiceContainer))
        throw new InvalidArgumentError(
          'The provided parameter "parent" of ServicesContainer.constructor must be an instance ServiceContainer, but %v given.',
          parent
        );
      this._parent = parent;
    }
  }
  /**
   * Получить существующий или новый экземпляр.
   *
   * @param {*} ctor
   * @param {*} args
   * @return {*}
   */
  get(ctor, ...args) {
    if (!ctor || typeof ctor !== "function")
      throw new InvalidArgumentError(
        "The first argument of ServicesContainer.get must be a class constructor, but %v given.",
        ctor
      );
    if (!this._services.has(ctor) && this._parent && this._parent.has(ctor)) {
      return this._parent.get(ctor);
    }
    let service = this._services.get(ctor);
    if (!service || args.length) {
      service = "prototype" in ctor && ctor.prototype instanceof Service ? new ctor(this, ...args) : new ctor(...args);
      this._services.set(ctor, service);
    } else if (typeof service === "function") {
      service = service();
      this._services.set(ctor, service);
    }
    return service;
  }
  /**
   * Проверка существования конструктора в контейнере.
   *
   * @param {*} ctor
   * @return {boolean}
   */
  has(ctor) {
    if (this._services.has(ctor)) return true;
    if (this._parent) return this._parent.has(ctor);
    return false;
  }
  /**
   * Добавить конструктор в контейнер.
   *
   * @param {*} ctor
   * @param {*} args
   * @return {this}
   */
  add(ctor, ...args) {
    if (!ctor || typeof ctor !== "function")
      throw new InvalidArgumentError(
        "The first argument of ServicesContainer.add must be a class constructor, but %v given.",
        ctor
      );
    const factory = () => ctor.prototype instanceof Service ? new ctor(this, ...args) : new ctor(...args);
    this._services.set(ctor, factory);
    return this;
  }
  /**
   * Добавить конструктор и создать экземпляр.
   *
   * @param {*} ctor
   * @param {*} args
   * @return {this}
   */
  use(ctor, ...args) {
    if (!ctor || typeof ctor !== "function")
      throw new InvalidArgumentError(
        "The first argument of ServicesContainer.use must be a class constructor, but %v given.",
        ctor
      );
    const service = ctor.prototype instanceof Service ? new ctor(this, ...args) : new ctor(...args);
    this._services.set(ctor, service);
    return this;
  }
  /**
   * Добавить конструктор и связанный экземпляр.
   *
   * @param {*} ctor
   * @param {*} service
   * @return {this}
   */
  set(ctor, service) {
    if (!ctor || typeof ctor !== "function")
      throw new InvalidArgumentError(
        "The first argument of ServicesContainer.set must be a class constructor, but %v given.",
        ctor
      );
    if (!service || typeof service !== "object" || Array.isArray(service))
      throw new InvalidArgumentError(
        "The second argument of ServicesContainer.set must be an Object, but %v given.",
        service
      );
    this._services.set(ctor, service);
    return this;
  }
};

// node_modules/@e22m4u/js-service/src/service.js
var Service = class {
  /**
   * Container.
   *
   * @type {ServiceContainer}
   */
  container;
  /**
   * Constructor.
   *
   * @param {ServiceContainer|undefined} container
   */
  constructor(container = void 0) {
    this.container = container instanceof ServiceContainer ? container : new ServiceContainer();
  }
  /**
   * Получить существующий или новый экземпляр.
   *
   * @param {*} ctor
   * @param {*} args
   * @return {*}
   */
  getService(ctor, ...args) {
    return this.container.get(ctor, ...args);
  }
  /**
   * Проверка существования конструктора в контейнере.
   *
   * @param {*} ctor
   * @return {boolean}
   */
  hasService(ctor) {
    return this.container.has(ctor);
  }
  /**
   * Добавить конструктор в контейнер.
   *
   * @param {*} ctor
   * @param {*} args
   * @return {this}
   */
  addService(ctor, ...args) {
    this.container.add(ctor, ...args);
    return this;
  }
  /**
   * Добавить конструктор и создать экземпляр.
   *
   * @param {*} ctor
   * @param {*} args
   * @return {this}
   */
  useService(ctor, ...args) {
    this.container.use(ctor, ...args);
    return this;
  }
  /**
   * Добавить конструктор и связанный экземпляр.
   *
   * @param {*} ctor
   * @param {*} service
   * @return {this}
   */
  setService(ctor, service) {
    this.container.set(ctor, service);
    return this;
  }
};

// src/debuggable-service.js
var DebuggableService = class extends Service {
  /**
   * Debug.
   *
   * @type {Function}
   */
  debug;
  /**
   * Constructor.
   *
   * @param {ServiceContainer} container
   */
  constructor(container) {
    super(container);
    const serviceName = toCamelCase(this.constructor.name);
    this.debug = createDebugger(serviceName);
    this.debug("The %v is created.", this.constructor);
  }
};

// src/hooks/hook-registry.js
var HookName = {
  PRE_HANDLER: "preHandler",
  POST_HANDLER: "postHandler"
};
var HookRegistry = class extends DebuggableService {
  /**
   * Hooks.
   *
   * @type {Map<string, Function[]>}
   * @private
   */
  _hooks = /* @__PURE__ */ new Map();
  /**
   * Add hook.
   *
   * @param {string} name
   * @param {Function} hook
   * @returns {this}
   */
  addHook(name, hook) {
    if (!name || typeof name !== "string")
      throw new Errorf("The hook name is required, but %v given.", name);
    if (!Object.values(HookName).includes(name))
      throw new Errorf("The hook name %v is not supported.", name);
    if (!hook || typeof hook !== "function")
      throw new Errorf(
        "The hook %v should be a Function, but %v given.",
        name,
        hook
      );
    const hooks = this._hooks.get(name) || [];
    hooks.push(hook);
    this._hooks.set(name, hooks);
    return this;
  }
  /**
   * Has hook.
   *
   * @param {string} name
   * @param {Function} hook
   * @returns {boolean}
   */
  hasHook(name, hook) {
    if (!name || typeof name !== "string")
      throw new Errorf("The hook name is required, but %v given.", name);
    if (!Object.values(HookName).includes(name))
      throw new Errorf("The hook name %v is not supported.", name);
    if (!hook || typeof hook !== "function")
      throw new Errorf(
        "The hook %v should be a Function, but %v given.",
        name,
        hook
      );
    const hooks = this._hooks.get(name) || [];
    return hooks.indexOf(hook) > -1;
  }
  /**
   * Get hooks.
   *
   * @param {string} name
   * @returns {Function[]}
   */
  getHooks(name) {
    if (!name || typeof name !== "string")
      throw new Errorf("The hook name is required, but %v given.", name);
    if (!Object.values(HookName).includes(name))
      throw new Errorf("The hook name %v is not supported.", name);
    return this._hooks.get(name) || [];
  }
};

// src/hooks/hook-invoker.js
var HookInvoker = class extends DebuggableService {
  /**
   * Invoke and continue until value received.
   *
   * @param {Route} route
   * @param {string} hookName
   * @param {import('http').ServerResponse} response
   * @param {*[]} args
   * @returns {Promise<*>|*}
   */
  invokeAndContinueUntilValueReceived(route, hookName, response, ...args) {
    if (!route || !(route instanceof Route))
      throw new Errorf(
        'The parameter "route" of the HookInvoker.invokeAndContinueUntilValueReceived should be a Route instance, but %v given.',
        route
      );
    if (!hookName || typeof hookName !== "string")
      throw new Errorf(
        'The parameter "hookName" of the HookInvoker.invokeAndContinueUntilValueReceived should be a non-empty String, but %v given.',
        hookName
      );
    if (!Object.values(HookName).includes(hookName))
      throw new Errorf("The hook name %v is not supported.", hookName);
    if (!response || typeof response !== "object" || Array.isArray(response) || typeof response.headersSent !== "boolean") {
      throw new Errorf(
        'The parameter "response" of the HookInvoker.invokeAndContinueUntilValueReceived should be a ServerResponse instance, but %v given.',
        response
      );
    }
    const hooks = [
      ...this.getService(HookRegistry).getHooks(hookName),
      ...route.hookRegistry.getHooks(hookName)
    ];
    let result = void 0;
    for (const hook of hooks) {
      if (isResponseSent(response)) {
        result = response;
        break;
      }
      if (result == null) {
        result = hook(...args);
      } else if (isPromise(result)) {
        result = result.then((prevVal) => {
          if (isResponseSent(response)) {
            result = response;
            return;
          }
          if (prevVal != null) return prevVal;
          return hook(...args);
        });
      } else {
        break;
      }
    }
    return result;
  }
};

// src/route.js
var HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE"
};
var debug = createDebugger("route");
var Route = class {
  /**
   * Method.
   *
   * @type {string}
   * @private
   */
  _method;
  /**
   * Getter of the method.
   *
   * @returns {string}
   */
  get method() {
    return this._method;
  }
  /**
   * Path template.
   *
   * @type {string}
   * @private
   */
  _path;
  /**
   * Getter of the path.
   *
   * @returns {string}
   */
  get path() {
    return this._path;
  }
  /**
   * Handler.
   *
   * @type {RouteHandler}
   * @private
   */
  _handler;
  /**
   * Getter of the handler.
   *
   * @returns {*}
   */
  get handler() {
    return this._handler;
  }
  /**
   * Hook registry.
   *
   * @type {HookRegistry}
   * @private
   */
  _hookRegistry = new HookRegistry();
  /**
   * Getter of the hook registry.
   *
   * @returns {HookRegistry}
   */
  get hookRegistry() {
    return this._hookRegistry;
  }
  /**
   * Constructor.
   *
   * @param {RouteDefinition} routeDef
   */
  constructor(routeDef) {
    if (!routeDef || typeof routeDef !== "object" || Array.isArray(routeDef))
      throw new Errorf(
        "The first parameter of Route.controller should be an Object, but %v given.",
        routeDef
      );
    if (!routeDef.method || typeof routeDef.method !== "string")
      throw new Errorf(
        'The option "method" of the Route should be a non-empty String, but %v given.',
        routeDef.method
      );
    this._method = routeDef.method.toUpperCase();
    if (typeof routeDef.path !== "string")
      throw new Errorf(
        'The option "path" of the Route should be a String, but %v given.',
        routeDef.path
      );
    this._path = routeDef.path;
    if (typeof routeDef.handler !== "function")
      throw new Errorf(
        'The option "handler" of the Route should be a Function, but %v given.',
        routeDef.handler
      );
    this._handler = routeDef.handler;
    if (routeDef.preHandler != null) {
      const preHandlerHooks = Array.isArray(routeDef.preHandler) ? routeDef.preHandler : [routeDef.preHandler];
      preHandlerHooks.forEach((hook) => {
        this._hookRegistry.addHook(HookName.PRE_HANDLER, hook);
      });
    }
    if (routeDef.postHandler != null) {
      const postHandlerHooks = Array.isArray(routeDef.postHandler) ? routeDef.postHandler : [routeDef.postHandler];
      postHandlerHooks.forEach((hook) => {
        this._hookRegistry.addHook(HookName.POST_HANDLER, hook);
      });
    }
  }
  /**
   * Handle request.
   *
   * @param {RequestContext} context
   * @returns {*}
   */
  handle(context) {
    const requestPath = getRequestPathname(context.req);
    debug(
      "Invoking the Route handler for the request %s %v.",
      this.method.toUpperCase(),
      requestPath
    );
    return this._handler(context);
  }
};

// src/senders/data-sender.js
var DataSender = class extends DebuggableService {
  /**
   * Send.
   *
   * @param {import('http').ServerResponse} res
   * @param {*} data
   * @returns {undefined}
   */
  send(res, data) {
    if (data === res || res.headersSent) {
      this.debug(
        "Response sending was skipped because its headers where sent already ."
      );
      return;
    }
    if (data == null) {
      res.statusCode = 204;
      res.end();
      this.debug("The empty response was sent.");
      return;
    }
    if (isReadableStream(data)) {
      res.setHeader("Content-Type", "application/octet-stream");
      data.pipe(res);
      this.debug("The stream response was sent.");
      return;
    }
    let debugMsg;
    switch (typeof data) {
      case "object":
      case "boolean":
      case "number":
        if (Buffer.isBuffer(data)) {
          res.setHeader("content-type", "application/octet-stream");
          debugMsg = "The Buffer was sent as binary data.";
        } else {
          res.setHeader("content-type", "application/json");
          debugMsg = format("The %v was sent as JSON.", typeof data);
          data = JSON.stringify(data);
        }
        break;
      default:
        res.setHeader("content-type", "text/plain");
        debugMsg = "The response data was sent as plain text.";
        data = String(data);
        break;
    }
    res.end(data);
    this.debug(debugMsg);
  }
};

// src/senders/error-sender.js
var import_util = require("util");
var import_statuses = __toESM(require_statuses(), 1);
var EXPOSED_ERROR_PROPERTIES = ["code", "details"];
var ErrorSender = class extends DebuggableService {
  /**
   * Handle.
   *
   * @param {import('http').IncomingMessage} req
   * @param {import('http').ServerResponse} res
   * @param {Error} error
   * @returns {undefined}
   */
  send(req, res, error) {
    let safeError = {};
    if (error) {
      if (typeof error === "object") {
        safeError = error;
      } else {
        safeError = { message: String(error) };
      }
    }
    const statusCode = error.statusCode || error.status || 500;
    const body = { error: {} };
    if (safeError.message && typeof safeError.message === "string") {
      body.error.message = safeError.message;
    } else {
      body.error.message = (0, import_statuses.default)(statusCode);
    }
    EXPOSED_ERROR_PROPERTIES.forEach((name) => {
      if (name in safeError) body.error[name] = safeError[name];
    });
    const requestData = {
      url: req.url,
      method: req.method,
      headers: req.headers
    };
    const inspectOptions = {
      showHidden: false,
      depth: null,
      colors: true,
      compact: false
    };
    console.warn((0, import_util.inspect)(requestData, inspectOptions));
    console.warn((0, import_util.inspect)(body, inspectOptions));
    res.statusCode = statusCode;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify(body, null, 2), "utf-8");
    this.debug(
      "The %s error is sent for the request %s %v.",
      statusCode,
      req.method,
      getRequestPathname(req)
    );
  }
  /**
   * Send 404.
   *
   * @param {import('http').IncomingMessage} req
   * @param {import('http').ServerResponse} res
   * @returns {undefined}
   */
  send404(req, res) {
    res.statusCode = 404;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end("404 Not Found", "utf-8");
    this.debug(
      "The 404 error is sent for the request %s %v.",
      req.method,
      getRequestPathname(req)
    );
  }
};

// src/parsers/body-parser.js
var import_http_errors2 = __toESM(require_http_errors(), 1);

// src/router-options.js
var RouterOptions = class extends DebuggableService {
  /**
   * Request body bytes limit.
   *
   * @type {number}
   * @private
   */
  _requestBodyBytesLimit = 512e3;
  // 512kb
  /**
   * Getter of request body bytes limit.
   *
   * @returns {number}
   */
  get requestBodyBytesLimit() {
    return this._requestBodyBytesLimit;
  }
  /**
   * Set request body bytes limit.
   *
   * @param {number} input
   * @returns {RouterOptions}
   */
  setRequestBodyBytesLimit(input) {
    if (typeof input !== "number" || input < 0)
      throw new Errorf(
        'The option "requestBodyBytesLimit" must be a positive Number or 0, but %v given.',
        input
      );
    this._requestBodyBytesLimit = input;
    return this;
  }
};

// src/parsers/body-parser.js
var METHODS_WITH_BODY = ["POST", "PUT", "PATCH", "DELETE"];
var UNPARSABLE_MEDIA_TYPES = ["multipart/form-data"];
var BodyParser = class extends DebuggableService {
  /**
   * Parsers.
   *
   * @type {{[mime: string]: Function}}
   */
  _parsers = {
    "text/plain": (v) => String(v),
    "application/json": parseJsonBody
  };
  /**
   * Set parser.
   *
   * @param {string} mediaType
   * @param {Function} parser
   * @returns {this}
   */
  defineParser(mediaType, parser) {
    if (!mediaType || typeof mediaType !== "string")
      throw new Errorf(
        'The parameter "mediaType" of BodyParser.defineParser should be a non-empty String, but %v given.',
        mediaType
      );
    if (!parser || typeof parser !== "function")
      throw new Errorf(
        'The parameter "parser" of BodyParser.defineParser should be a Function, but %v given.',
        parser
      );
    this._parsers[mediaType] = parser;
    return this;
  }
  /**
   * Has parser.
   *
   * @param {string} mediaType
   * @returns {boolean}
   */
  hasParser(mediaType) {
    if (!mediaType || typeof mediaType !== "string")
      throw new Errorf(
        'The parameter "mediaType" of BodyParser.hasParser should be a non-empty String, but %v given.',
        mediaType
      );
    return Boolean(this._parsers[mediaType]);
  }
  /**
   * Delete parser.
   *
   * @param {string} mediaType
   * @returns {this}
   */
  deleteParser(mediaType) {
    if (!mediaType || typeof mediaType !== "string")
      throw new Errorf(
        'The parameter "mediaType" of BodyParser.deleteParser should be a non-empty String, but %v given.',
        mediaType
      );
    const parser = this._parsers[mediaType];
    if (!parser) throw new Errorf("The parser of %v is not found.", mediaType);
    delete this._parsers[mediaType];
    return this;
  }
  /**
   * Parse.
   *
   * @param {import('http').IncomingMessage} req
   * @returns {Promise<*>|undefined}
   */
  parse(req) {
    if (!METHODS_WITH_BODY.includes(req.method.toUpperCase())) {
      this.debug(
        "Body parsing was skipped for the %s request.",
        req.method.toUpperCase()
      );
      return;
    }
    const contentType = (req.headers["content-type"] || "").replace(
      /^([^;]+);.*$/,
      "$1"
    );
    if (!contentType) {
      this.debug(
        "Body parsing was skipped because the request has no content type."
      );
      return;
    }
    const { mediaType } = parseContentType(contentType);
    if (!mediaType)
      throw createError(
        import_http_errors2.default.BadRequest,
        'Unable to parse the "content-type" header.'
      );
    const parser = this._parsers[mediaType];
    if (!parser) {
      if (UNPARSABLE_MEDIA_TYPES.includes(mediaType)) {
        this.debug("Body parsing was skipped for %v.", mediaType);
        return;
      }
      throw createError(
        import_http_errors2.default.UnsupportedMediaType,
        "Media type %v is not supported.",
        mediaType
      );
    }
    const bodyBytesLimit = this.getService(RouterOptions).requestBodyBytesLimit;
    return fetchRequestBody(req, bodyBytesLimit).then((rawBody) => {
      if (rawBody != null) return parser(rawBody);
      return rawBody;
    });
  }
};
function parseJsonBody(input) {
  if (typeof input !== "string") return void 0;
  try {
    return JSON.parse(input);
  } catch (error) {
    if (process.env["DEBUG"] || process.env["NODE_ENV"] === "development")
      console.warn(error);
    throw createError(import_http_errors2.default.BadRequest, "Unable to parse request body.");
  }
}

// src/parsers/query-parser.js
var import_querystring2 = __toESM(require("querystring"), 1);
var QueryParser = class extends DebuggableService {
  /**
   * Parse
   *
   * @param {import('http').IncomingMessage} req
   * @returns {object}
   */
  parse(req) {
    const queryStr = req.url.replace(/^[^?]*\??/, "");
    const query = queryStr ? import_querystring2.default.parse(queryStr) : {};
    const queryKeys = Object.keys(query);
    if (queryKeys.length) {
      queryKeys.forEach((key) => {
        this.debug("The query %v has the value %v.", key, query[key]);
      });
    } else {
      this.debug(
        "The request %s %v has no query.",
        req.method,
        getRequestPathname(req)
      );
    }
    return query;
  }
};

// src/parsers/cookie-parser.js
var CookieParser = class extends DebuggableService {
  /**
   * Parse
   *
   * @param {import('http').IncomingMessage} req
   * @returns {object}
   */
  parse(req) {
    const cookieString = req.headers["cookie"] || "";
    const cookie = parseCookie(cookieString);
    const cookieKeys = Object.keys(cookie);
    if (cookieKeys.length) {
      cookieKeys.forEach((key) => {
        this.debug("The cookie %v has the value %v.", key, cookie[key]);
      });
    } else {
      this.debug(
        "The request %s %v has no cookie.",
        req.method,
        getRequestPathname(req)
      );
    }
    return cookie;
  }
};

// src/parsers/request-parser.js
var import_http3 = require("http");
var RequestParser = class extends DebuggableService {
  /**
   * Parse.
   *
   * @param {IncomingMessage} req
   * @returns {Promise<object>|object}
   */
  parse(req) {
    if (!(req instanceof import_http3.IncomingMessage))
      throw new Errorf(
        "The first argument of RequestParser.parse should be an instance of IncomingMessage, but %v given.",
        req
      );
    const data = {};
    const promises = [];
    const parsedQuery = this.getService(QueryParser).parse(req);
    if (isPromise(parsedQuery)) {
      promises.push(parsedQuery.then((v) => data.query = v));
    } else {
      data.query = parsedQuery;
    }
    const parsedCookie = this.getService(CookieParser).parse(req);
    if (isPromise(parsedCookie)) {
      promises.push(parsedCookie.then((v) => data.cookie = v));
    } else {
      data.cookie = parsedCookie;
    }
    const parsedBody = this.getService(BodyParser).parse(req);
    if (isPromise(parsedBody)) {
      promises.push(parsedBody.then((v) => data.body = v));
    } else {
      data.body = parsedBody;
    }
    data.headers = JSON.parse(JSON.stringify(req.headers));
    return promises.length ? Promise.all(promises).then(() => data) : data;
  }
};

// node_modules/@e22m4u/js-path-trie/src/path-trie.js
var import_path_to_regexp = __toESM(require_dist(), 1);

// node_modules/@e22m4u/js-path-trie/src/utils/create-debugger.js
var import_debug2 = __toESM(require_src(), 1);
function createDebugger2() {
  const debug3 = (0, import_debug2.default)(`jsPathTrie`);
  return function(message, ...args) {
    const interpolatedMessage = format(message, ...args);
    return debug3(interpolatedMessage);
  };
}

// node_modules/@e22m4u/js-path-trie/src/path-trie.js
var debug2 = createDebugger2();
var PathTrie = class {
  /**
   * Root node.
   *
   * @type {Node}
   * @private
   */
  _root = {
    token: "",
    regexp: void 0,
    names: [],
    value: void 0,
    children: {}
  };
  /**
   * Add value.
   *
   * @param {string} pathTemplate
   * @param {*} value
   * @returns {this}
   */
  add(pathTemplate, value) {
    if (typeof pathTemplate !== "string")
      throw new Errorf(
        "The first argument of PathTrie.add should be a String, but %v given.",
        pathTemplate
      );
    if (value == null)
      throw new Errorf(
        "The second argument of PathTrie.add is required, but %v given.",
        value
      );
    debug2("Adding the value to %v.", pathTemplate);
    const tokens = pathTemplate.split("/").filter(Boolean);
    this._createNode(tokens, 0, value, this._root);
    return this;
  }
  /**
   * Match value.
   *
   * @param {string} path
   * @returns {ResolvedValue|undefined}
   */
  match(path) {
    if (typeof path !== "string")
      throw new Errorf(
        "The first argument of PathTrie.match should be a String, but %v given.",
        path
      );
    debug2("Matching a value with the path %v.", path);
    const tokens = path.split("/").filter(Boolean);
    const params = {};
    const result = this._matchNode(tokens, 0, params, this._root);
    if (!result || !result.node.value) return;
    return { value: result.node.value, params };
  }
  /**
   * Create node.
   *
   * @param {string[]} tokens
   * @param {number} index
   * @param {*} value
   * @param {Node} parent
   * @returns {Node}
   * @private
   */
  _createNode(tokens, index, value, parent) {
    if (tokens.length === 0 && index === 0) {
      if (parent.value == null) {
        parent.value = value;
      } else if (parent.value !== value) {
        throw new Errorf('The duplicate path "" has a different value.');
      }
      debug2("The value has set to the root node.");
      return parent;
    }
    const token = tokens[index];
    if (token == null)
      throw new Errorf(
        "Invalid index %v has passed to the PathTrie._createNode.",
        index
      );
    const isLast = tokens.length - 1 === index;
    let child = parent.children[token];
    if (isLast && child != null) {
      debug2("The node %v already exist.", token);
      if (child.value == null) {
        child.value = value;
      } else if (child.value !== value) {
        throw new Errorf(
          "The duplicate path %v has a different value.",
          "/" + tokens.join("/")
        );
      }
      return child;
    }
    debug2("The node %v does not exist.", token);
    child = {
      token,
      regexp: void 0,
      names: [],
      value: void 0,
      children: {}
    };
    if (isLast) {
      debug2("The node %v is last.", token);
      child.value = value;
    }
    if (token.indexOf(":") > -1) {
      debug2("The node %v has parameters.", token);
      const modifiers = /([?*+{}])/.exec(token);
      if (modifiers)
        throw new Errorf(
          "The symbol %v is not supported in path %v.",
          modifiers[0],
          "/" + tokens.join("/")
        );
      let regexp, keys;
      try {
        const regexpAndKeys = (0, import_path_to_regexp.pathToRegexp)(token);
        regexp = regexpAndKeys.regexp;
        keys = regexpAndKeys.keys;
      } catch (error) {
        if (error.message.indexOf("Missing parameter") > -1)
          throw new Errorf(
            'The symbol ":" should be used to define path parameters, but no parameters found in the path %v.',
            "/" + tokens.join("/")
          );
        throw error;
      }
      if (Array.isArray(keys) && keys.length) {
        child.names = keys.map((p) => `${p.name}`);
        child.regexp = regexp;
      } else {
        throw new Errorf(
          'The symbol ":" should be used to define path parameters, but no parameters found in the path %v.',
          "/" + tokens.join("/")
        );
      }
      debug2("Found parameters are %l.", child.names);
    }
    parent.children[token] = child;
    debug2("The node %v has created.", token);
    if (isLast) return child;
    return this._createNode(tokens, index + 1, value, child);
  }
  /**
   * Match node.
   *
   * @param {string[]} tokens
   * @param {number} index
   * @param {object} params
   * @param {Node} parent
   * @returns {ResolvedNode|undefined}
   * @private
   */
  _matchNode(tokens, index, params, parent) {
    if (tokens.length === 0 && index === 0) {
      if (parent.value) {
        debug2(
          "The path %v matched with the root node.",
          "/" + tokens.join("/")
        );
        return { node: parent, params };
      }
      return;
    }
    const token = tokens[index];
    if (token == null)
      throw new Errorf(
        "Invalid index %v has passed to the PathTrie._matchNode.",
        index
      );
    const resolvedNodes = this._matchChildrenNodes(token, parent);
    debug2("%v nodes matches the token %v.", resolvedNodes.length, token);
    if (!resolvedNodes.length) return;
    const isLast = tokens.length - 1 === index;
    if (isLast) {
      debug2("The token %v is last.", token);
      for (const child of resolvedNodes) {
        debug2("The node %v matches the token %v.", child.node.token, token);
        if (child.node.value) {
          debug2("The node %v has a value.", child.node.token);
          const paramNames = Object.keys(child.params);
          if (paramNames.length) {
            paramNames.forEach((name) => {
              debug2(
                "The node %v has parameter %v with the value %v.",
                child.node.token,
                name,
                child.params[name]
              );
            });
          } else {
            debug2("The node %v has no parameters.", child.node.token);
          }
          Object.assign(params, child.params);
          return { node: child.node, params };
        }
      }
    } else {
      for (const child of resolvedNodes) {
        const result = this._matchNode(tokens, index + 1, params, child.node);
        if (result) {
          debug2("A value has found for the path %v.", "/" + tokens.join("/"));
          const paramNames = Object.keys(child.params);
          if (paramNames.length) {
            paramNames.forEach((name) => {
              debug2(
                "The node %v has parameter %v with the value %v.",
                child.node.token,
                name,
                child.params[name]
              );
            });
          } else {
            debug2("The node %v has no parameters.", child.node.token);
          }
          Object.assign(params, child.params);
          return result;
        }
      }
    }
    debug2("No matched nodes with the path %v.", "/" + tokens.join("/"));
    return void 0;
  }
  /**
   * Match children nodes.
   *
   * @param {string} token
   * @param {Node} parent
   * @returns {ResolvedNode[]}
   * @private
   */
  _matchChildrenNodes(token, parent) {
    const resolvedNodes = [];
    let child = parent.children[token];
    if (child) {
      resolvedNodes.push({ node: child, params: {} });
      return resolvedNodes;
    }
    for (const key in parent.children) {
      child = parent.children[key];
      if (!child.names || !child.regexp) continue;
      const match = child.regexp.exec(token);
      if (match) {
        const resolved = { node: child, params: {} };
        let i = 0;
        for (const name of child.names) {
          const val = match[++i];
          resolved.params[name] = decodeURIComponent(val);
        }
        resolvedNodes.push(resolved);
      }
    }
    return resolvedNodes;
  }
};

// src/route-registry.js
var RouteRegistry = class extends DebuggableService {
  /**
   * Constructor.
   *
   * @param {ServiceContainer} container
   */
  constructor(container) {
    super(container);
    this._trie = new PathTrie();
  }
  /**
   * Define route.
   *
   * @param {import('./route.js').RouteDefinition} routeDef
   * @returns {Route}
   */
  defineRoute(routeDef) {
    if (!routeDef || typeof routeDef !== "object" || Array.isArray(routeDef))
      throw new Errorf(
        "The route definition should be an Object, but %v given.",
        routeDef
      );
    const route = new Route(routeDef);
    const triePath = `${route.method}/${route.path}`;
    this._trie.add(triePath, route);
    this.debug(
      "The route %s %v is registered.",
      route.method.toUpperCase(),
      route.path
    );
    return route;
  }
  /**
   * Match route by request.
   *
   * @param {import('http').IncomingRequest} req
   * @returns {ResolvedRoute|undefined}
   */
  matchRouteByRequest(req) {
    const requestPath = (req.url || "/").replace(/\?.*$/, "");
    this.debug(
      "Matching %s %v with registered routes.",
      req.method.toUpperCase(),
      requestPath
    );
    const triePath = `${req.method.toUpperCase()}/${requestPath}`;
    const resolved = this._trie.match(triePath);
    if (resolved) {
      const route = resolved.value;
      this.debug(
        "The request %s %v was matched to the route %s %v.",
        req.method.toUpperCase(),
        requestPath,
        route.method.toUpperCase(),
        route.path
      );
      const paramNames = Object.keys(resolved.params);
      if (paramNames) {
        paramNames.forEach((name) => {
          this.debug(
            "The path parameter %v has the value %v.",
            name,
            resolved.params[name]
          );
        });
      } else {
        this.debug("No path parameters found.");
      }
      return { route, params: resolved.params };
    }
    this.debug(
      "No matched route for the request %s %v.",
      req.method.toUpperCase(),
      requestPath
    );
  }
};

// src/request-context.js
var RequestContext = class {
  /**
   * Service container.
   *
   * @type {import('@e22m4u/js-service').ServiceContainer}
   */
  container;
  /**
   * Request.
   *
   * @type {import('http').IncomingMessage}
   */
  req;
  /**
   * Response.
   *
   * @type {import('http').ServerResponse}
   */
  res;
  /**
   * Query.
   *
   * @type {object}
   */
  query = {};
  /**
   * Path parameters.
   *
   * @type {object}
   */
  params = {};
  /**
   * Headers.
   *
   * @type {object}
   */
  headers = {};
  /**
   * Parsed cookie.
   *
   * @type {object}
   */
  cookie = {};
  /**
   * Parsed body.
   *
   * @type {*}
   */
  body;
  /**
   * Method.
   *
   * @returns {string}
   */
  get method() {
    return this.req.method.toUpperCase();
  }
  /**
   * Path.
   *
   * @returns {string}
   */
  get path() {
    return this.req.url;
  }
  /**
   * Pathname.
   *
   * @type {string|undefined}
   * @private
   */
  _pathname = void 0;
  /**
   * Pathname.
   *
   * @returns {string}
   */
  get pathname() {
    if (this._pathname != null) return this._pathname;
    this._pathname = getRequestPathname(this.req);
    return this._pathname;
  }
  /**
   * Constructor.
   *
   * @param {ServiceContainer} container
   * @param {import('http').IncomingMessage} request
   * @param {import('http').ServerResponse} response
   */
  constructor(container, request, response) {
    if (!(container instanceof ServiceContainer))
      throw new Errorf(
        'The parameter "container" of RequestContext.constructor should be an instance of ServiceContainer, but %v given.',
        container
      );
    this.container = container;
    if (!request || typeof request !== "object" || Array.isArray(request) || !isReadableStream(request)) {
      throw new Errorf(
        'The parameter "request" of RequestContext.constructor should be an instance of IncomingMessage, but %v given.',
        request
      );
    }
    this.req = request;
    if (!response || typeof response !== "object" || Array.isArray(response) || !isWritableStream(response)) {
      throw new Errorf(
        'The parameter "response" of RequestContext.constructor should be an instance of ServerResponse, but %v given.',
        response
      );
    }
    this.res = response;
  }
};

// src/trie-router.js
var TrieRouter = class extends DebuggableService {
  /**
   * Define route.
   *
   * Example 1:
   * ```
   * const router = new TrieRouter();
   * router.defineRoute({
   *   method: HttpMethod.GET,        // Request method.
   *   path: '/',                      // Path template.
   *   handler: ctx => 'Hello world!', // Request handler.
   * });
   * ```
   *
   * Example 2:
   * ```
   * const router = new TrieRouter();
   * router.defineRoute({
   *   method: HttpMethod.POST,       // Request method.
   *   path: '/users/:id',             // The path template may have parameters.
   *   preHandler(ctx) { ... },        // The "preHandler" is executed before a route handler.
   *   handler(ctx) { ... },           // Request handler function.
   *   postHandler(ctx, data) { ... }, // The "postHandler" is executed after a route handler.
   * });
   * ```
   *
   * @param {import('./route-registry.js').RouteDefinition} routeDef
   * @returns {import('./route.js').Route}
   */
  defineRoute(routeDef) {
    return this.getService(RouteRegistry).defineRoute(routeDef);
  }
  /**
   * Request listener.
   *
   * Example:
   * ```
   * import http from 'http';
   * import {TrieRouter} from '@e22m4u/js-trie-router';
   *
   * const router = new TrieRouter();
   * const server = new http.Server();
   * server.on('request', router.requestListener); // Sets the request listener.
   * server.listen(3000);                          // Starts listening for connections.
   * ```
   *
   * @returns {Function}
   */
  get requestListener() {
    return this._handleRequest.bind(this);
  }
  /**
   * Handle incoming request.
   *
   * @param {import('http').IncomingMessage} req
   * @param {import('http').ServerResponse} res
   * @returns {Promise<undefined>}
   * @private
   */
  async _handleRequest(req, res) {
    const requestPath = (req.url || "/").replace(/\?.*$/, "");
    this.debug("Preparing to handle %s %v.", req.method, requestPath);
    const resolved = this.getService(RouteRegistry).matchRouteByRequest(req);
    if (!resolved) {
      this.debug("No route for the request %s %v.", req.method, requestPath);
      this.getService(ErrorSender).send404(req, res);
    } else {
      const { route, params } = resolved;
      const container = new ServiceContainer(this.container);
      const context = new RequestContext(container, req, res);
      context.params = params;
      const reqDataOrPromise = this.getService(RequestParser).parse(req);
      if (isPromise(reqDataOrPromise)) {
        const reqData = await reqDataOrPromise;
        Object.assign(context, reqData);
      } else {
        Object.assign(context, reqDataOrPromise);
      }
      let data, error;
      const hookInvoker = this.getService(HookInvoker);
      try {
        data = hookInvoker.invokeAndContinueUntilValueReceived(
          route,
          HookName.PRE_HANDLER,
          res,
          context
        );
        if (isPromise(data)) data = await data;
        if (data == null) {
          data = route.handle(context);
          if (isPromise(data)) data = await data;
          let postHandlerData = hookInvoker.invokeAndContinueUntilValueReceived(
            route,
            HookName.POST_HANDLER,
            res,
            context,
            data
          );
          if (isPromise(postHandlerData))
            postHandlerData = await postHandlerData;
          if (postHandlerData != null) data = postHandlerData;
        }
      } catch (err) {
        error = err;
      }
      if (error) {
        this.getService(ErrorSender).send(req, res, error);
      } else {
        this.getService(DataSender).send(res, data);
      }
    }
  }
  /**
   * Add hook.
   *
   * Example:
   * ```
   * import {TrieRouter} from '@e22m4u/js-trie-router';
   * import {HookName} from '@e22m4u/js-trie-router';
   *
   * // Router instance.
   * const router = new TrieRouter();
   *
   * // Adds the "preHandler" hook for each route.
   * router.addHook(
   *   HookName.PRE_HANDLER,
   *   ctx => { ... },
   * );
   *
   * // Adds the "postHandler" hook for each route.
   * router.addHook(
   *   HookName.POST_HANDLER,
   *   ctx => { ... },
   * );
   * ```
   *
   * @param {string} name
   * @param {Function} hook
   * @returns {this}
   */
  addHook(name, hook) {
    this.getService(HookRegistry).addHook(name, hook);
    return this;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BUFFER_ENCODING_LIST,
  BodyParser,
  CookieParser,
  DataSender,
  EXPOSED_ERROR_PROPERTIES,
  ErrorSender,
  HookInvoker,
  HookName,
  HookRegistry,
  HttpMethod,
  METHODS_WITH_BODY,
  QueryParser,
  RequestContext,
  RequestParser,
  Route,
  RouteRegistry,
  RouterOptions,
  TrieRouter,
  UNPARSABLE_MEDIA_TYPES,
  createCookieString,
  createDebugger,
  createError,
  createRequestMock,
  createResponseMock,
  fetchRequestBody,
  getRequestPathname,
  isPromise,
  isReadableStream,
  isResponseSent,
  isWritableStream,
  parseContentType,
  parseCookie,
  parseJsonBody,
  toCamelCase
});
/*! Bundled license information:

depd/index.js:
  (*!
   * depd
   * Copyright(c) 2014-2018 Douglas Christopher Wilson
   * MIT Licensed
   *)

statuses/index.js:
  (*!
   * statuses
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)

toidentifier/index.js:
  (*!
   * toidentifier
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)

http-errors/index.js:
  (*!
   * http-errors
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
