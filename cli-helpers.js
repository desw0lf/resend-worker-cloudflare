const { access, constants, writeFile, readFile } = require("node:fs/promises");

exports.fileUtils = {
  exists: async (path) => {
    try {
      await access(path, constants.F_OK | constants.R_OK);
      return [true, null];
    } catch (err) {
      return [false, err];
    }
  },
  read: async (path) => {
    try {
      const data = await readFile(path);
      const lines = data.toString().split(/\r?\n/).map(line => line.trim());
      return [lines, null];
    } catch (err) {
      return [null, err];
    }
  },
  write: async (path, lines) => {
    try {
      const data = lines.join("\n");
      await writeFile(path, data, { encoding: "utf8" });
      return [true, null];
    } catch (err) {
      return [false, err];
    }
  }
}

exports.log = (vals, colour = "reset") => {
  const defaultColour = "reset";
  const c = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m",
    white: "\x1b[37m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bright: "\x1b[1m",
    reset: "\x1b[0m"
  }
  if (typeof vals === "string") {
    console.log(c[colour || defaultColour] + "%s" + c.reset, vals);
    return;
  }
  if (typeof vals === "object" && Array.isArray(vals)) {
    const entries = vals.map((v) => {
      const [val, col, extra] = v;
      if (typeof val !== "string" || (typeof col !== "string" && typeof col !== "undefined") && typeof extra !== "undefined") {
        return v;
      }
      return [c[col || defaultColour] + val];
    });
    // console.log(...entries.flat(1), c.reset);
    console.log(entries.flat(1).join(""), c.reset);
    return;
  }
  console.log(vals);
}