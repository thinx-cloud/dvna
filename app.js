require('sqreen');

var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: 'e7e7d4e63ce44d1abf867c2ec928cb4e',
  captureUncaught: true,
  captureUnhandledRejections: true
});

// record a generic message and send it to Rollbar
// rollbar.log("DVNA running!");

const express = require("express");
const fsx = require("fs-extra");
const exec = require("child_process");
const app = express();
const port = process.env.port || 5000;

/* CWE-770, CWE-307, CWE-400: set up rate limiter: maximum of five requests per minute
var RateLimit = require('express-rate-limit');
var limiter = new RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 5
});
// apply rate limiter to all requests
app.use(limiter);
*/



function getFileContents(path) {

  /* CWE-22, CWE-23, CWE-36, CWE-73, CWE-99: Validate user input before using
   it to construct a file path, either using an off-the-shelf library like
   the sanitize-filename npm package, or by performing custom validation.

   Ideally, follow these rules:
   * Do not allow more than a single "." character.
   * Do not allow directory separators such as "/" or "\" (depending on the file system).
   * Do not rely on simply replacing problematic sequences such as "../".
     For example, after applying this filter to ".../...//", the resulting
     string would still be "../".
   * Use a whitelist of known good patterns.
  */

  const object = fsx.readFileSync(path);
  return object;
}

function getFile(req, res) {
  const input = req.params.arg;
  console.log("Unvalidated user input: " + input);
  const languageFile = getFileContents("./languages/" + input);

  // Chybějící sanitace:
  // languageFile = languageFile.replace(/^\//, "");
  console.log(languageFile.toString());
  res.end(languageFile);
  // TODO: Take (non-)validated user input and use execSync to create shell injection vulnerability
}

function runJob(req, res) {
  const input = req.params.job;
  const command = "git clone " + input;
  console.log("Command with unvalidated user input: "+command);

  /* CWE-78, CWE-88: If possible, use hard-coded string literals to specify the command
     to run or library to load. Instead of passing the user input directly
    to the process or library function, examine the user input and then choose
    among hard-coded string literals.
    If the applicable libraries or commands cannot be determined at compile time,
    then add code to verify that the user input string is safe before using it. */
  var result = exec.execSync(command).toString();
  console.log(result);
  res.end(result);
}

function terminate() {
  process.exit();
}

// Global handler

app.all("/*", function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-type,Accept");

  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }

});


//
// Example 1: path traversal (read only)
//

// Use-cases
// curl http://localhost:5000/czech
// curl http://localhost:5000/english

// Misuse-cases
// curl http://localhost:5000/english%2F..%2F..
// curl http://localhost:5000/english%2F..%2Fczech

app.get("/:arg", getFile);

//
// Example 2: shell injection (root takeover)
//

// curl http://localhost:5000/job/git%40github.com%3Asuculent%2Fthinx-connect.git
// curl http://localhost:5000/job/git%40github.com%3Asuculent%2Fthinx-connect.git%26%26%20cat%20%2Fetc%2Fpasswd

// Use-cases

app.get("/job/:job", runJob);

// Server listener

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// Public exports for testing

module.exports = { runJob, getFile, getFileContents, terminate };
