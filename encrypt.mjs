#!/usr/bin/env node
import encryptionController from "./encryption.js";
import { fileUtils, log } from "./cli-helpers.js";

const args = process.argv.slice(2).reduce((acc, str) => {
  const [key, v] = str.split("=");
  return { ...acc, [key]: v === "true" || v === undefined ? true : v === "false" ? false : v };
}, {});

async function encrypt(str, salt) {
  if (!str.includes("@") || !str.includes(".")) {
    console.error("Not a valid email address");
    return;
  }
  const val = await encryptionController.default.encrypt(str, salt);
  return val;
}

async function decrypt(str, salt) {
  const val = await encryptionController.default.decrypt(str, salt);
  return val;
}

async function getCurrentSalt() {
  const [lines, error] = await fileUtils.read(".dev.vars");
  if (error) {
    throw Error("Error reading .dev.vars");
  }
  const found = lines.find((line) => line.startsWith("SALT="));
  if (!found) { 
    throw Error("Error, couldn't find the SALT in .dev.vars");
  }
  return found;
}

function showHelp(scriptName = "encrypt.mjs") {
  log(`
Usage: 
  ./${scriptName} [options]

Description:
  This script allows you to encrypt and decrypt email addresses using a specified salt. 
  The salt can either be provided via an argument or read from the .dev.vars file.

Options:
  --encrypt=<email>       Encrypt the provided email address.
  --decrypt=<value>       Decrypt the provided encrypted value.
  --salt=<salt>           Provide a salt to use for encryption/decryption. 
                          If not provided, the script will look for a SALT in the .dev.vars file.
  --help                  Show this help message.

Examples:
  Encrypt an email:
    ./${scriptName} --encrypt=johndoe@example.com --salt=mySalt123

  Decrypt an email:
    ./${scriptName} --decrypt=encryptedStringHere --salt=mySalt123

  Use the salt from the .dev.vars file:
    ./${scriptName} --encrypt=johndoe@example.com

  Show help:
    ./${scriptName} --help
  `);
}

async function init() {
  if (args["--help"]) {
    showHelp();
    return;
  }
  const salt = args["--salt"] ? Promise.resolve(args["--salt"]) : getCurrentSalt();
  if (args["--decrypt"]) {
    try {
      const decrypted = await decrypt(args["--decrypt"], salt);
      log("\nYour decrypted email is:");
      log(decrypted);
    } catch(_err) {
      log("Error decrypting email", "red");
    }
    return;
  }
  if (!args["--encrypt"]) {
    console.error("Please provide an email address via --encrypt=<email>");
    return;
  }
  try {
    const encrypted = await encrypt(args["--encrypt"], salt);
    log("\nYour encrypted email is:", "bgCyan");
    log(encrypted);
  } catch(_err) {
    log("Error encrypting email", "red");
  }
}

init();