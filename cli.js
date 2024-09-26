#!/usr/bin/env node
const readline = require("readline");
const { fileUtils, log } = require("./cli-helpers.js");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n%100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}

function maskText(str, start, end, char = "*") {
  if (str.length <= start + end) return char.repeat(str.length);
  return str.slice(0, start) + char.repeat(str.length - start - end) + str.slice(-end);
}

function generateRandomId(count) {
  const arr = Array.apply(null, Array(count)).map(() => Math.random().toString(36).substring(2));
  return Date.now().toString(36) + arr.join("");
}

const askQuestion = (query, opts = {}, type) => {
  return new Promise(resolve => {
    const def = opts.defaultValue && type === "boolean" ? opts.defaultValue ? "y" : "n" : opts.defaultValue;
    const q = opts.defaultValue ? `${query} (${def}): ` : `${query}: `;

    const askAgain = () => {
      rl.question(q, (answer) => {
        if (type === "number") {
          answer = parseFloat(answer);
        } else if (type === "boolean") {
          answer = answer === true ||["1", "y", "yes", "true"].includes(answer.toLowerCase());
        }
        
        if (opts.required && !answer) {
          console.warn("This field is required. Please provide a value.");
          return askAgain();
        }

        if (opts.validation) {
          const [isValid, message] = opts.validation(answer);
          if (!isValid) {
            console.warn(message);
            return askAgain();
          }
        }
        
        resolve(answer || opts.defaultValue);
      });
    };

    askAgain();
  });
};

async function saveSetup(profiles, salt) {
  const filePath = ".dev.vars";
  const [fileExists] = await fileUtils.exists(filePath);
  let overwrite = true;
  let previousData = {};
  if (fileExists) {
    log(`'${filePath}' already exists.`, "yellow");
    overwrite = await askQuestion("                         ----> Overwrite values?", { defaultValue: true }, "boolean");
  }
  if (!overwrite) {
    log("Aborting setup.", "red");
    return false;
  }
  if (fileExists) {
    const [lines, error] = await fileUtils.read(filePath);
    if (error) {
      log("Error, can't read file.", "red");
      return;
    }
    previousData = lines.reduce((acc, line) => {
      const [key, val] = line.split("=");
      return { ...acc, [key]: val };
    }, {});
  }

  const data = {
    ...previousData,
    "RESEND_CONFIG": profiles.map((profile) => new URLSearchParams(profile).toString()).join("|"),
    "SALT": salt 
  };
  const [isSucess] = await fileUtils.write(filePath, Object.entries(data).map(([key, val]) => `${key}=${val}`));
  if (isSucess) {
    return true;
  }
  log("Error, can't write file.", "red");
  return false;
}

async function setupProject() {
  const profileCount = await askQuestion("How many Resend.com API keys/profiles do you wish to setup?", { defaultValue: 1 }, "number");
  const profileCountArray = Array.from({ length: profileCount }, (_, i) => i + 1);
  let profiles = [];
  for (const step of profileCountArray) {
    const profileName = await askQuestion(`What do you want your${profileCount === 1 ? "" : " " + ordinal(step) } profile name to be?`, { defaultValue: step === 1 ? "main" : `profile${step}` });
    const api_key = await askQuestion(`What is your Resend.com API key? <${profileName}>`, { required: true, validation: (str) => {
      if (!str.startsWith("re_")) {
        return [false, "The API key must start with 're_'."];
      }
      return [true, "?"];
    }});
    const domain = await askQuestion(`What is your Resend.com domain? <${profileName}>`, { required: true, validation: (str) => {
      if (!str.includes(".")) {
        return [false, "The domain must be a valid domain."];
      }
      if (str.includes("@")) {
        return [false, "The domain cannot contain an @ symbol."];
      }
      return [true, "?"];
    }});
    profiles.push({ profile: profileName, api_key, domain });
  }

  log(`Salt is used to encrypt and decrypt the recipient's email. You can:
 - let the CLI generate a random salt
   OR
 - provide your own salt
   OR
 - leave it blank (option to use encrypted email will not work)`, "cyan");
  const isRandomSalt = await askQuestion("Generate a random salt?", { defaultValue: true }, "boolean");
  const salt = isRandomSalt ? await Promise.resolve(generateRandomId(3)) : await askQuestion("What string would you like to use as your salt?");

  const isSaved = await saveSetup(profiles, salt);

  if (!isSaved) {
    return new Error("Setup failed. Please try again.");
  }
  
  const logSeparator = "====================================";
  log("\n" + logSeparator, "green");
  log(logSeparator, "green");
  log("Setup Complete!", "green");
  log(logSeparator, "green");
  log(logSeparator, "green");
  profiles.forEach((profile) => {
    console.log("\n");
    log([["Profile <", "bright"], [profile.profile, "magenta"], [">:", "bright"]]);
    log(`API Key: ${maskText(profile.api_key, 5, 4)}`);
    log(`Domain: ${profile.domain}`);
  });
  log(`\nSalt: ${salt ? maskText(salt, 4, 4) : "-none-"}`, salt ? undefined : "yellow");
  log("\n" + logSeparator, "green");
  log(logSeparator, "green");

  rl.close();
}

async function init() {
  await setupProject();
}

init();