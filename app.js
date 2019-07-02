const express = require('express');
const fsx = require('fs-extra');
const exec = require("child_process");

const app = express();
const port = process.env.port || 8080;

function get_file_contents(path) {
  const object = fsx.readFileSync(path)
  return object;
}

function getFile(req, res) {
  const input = req.params.arg;
  console.log("Unvalidated user input: " + input);
  const language_file = get_file_contents("./languages/" + input);

  // Chybějící sanitace:
  // language_file = language_file.replace(/^\//, "");
  console.log(language_file.toString());
  res.end(language_file);
  // TODO: Take (non-)validated user input and use execSync to create shell injection vulnerability
};

function runJob(req, res) {
  const input = req.params.job;
  const command = "git clone " + input;
  console.log("Command with unvalidated user input: "+command);
  var result = exec.execSync(command).toString();
  console.log(result);
  res.end(result);
}

//
// Example 1: path traversal (read only)
//

// Use-cases
// curl http://localhost:8080/czech
// curl http://localhost:8080/english

// Misuse-cases
// curl http://localhost:8080/english%2F..%2F..
// curl http://localhost:8080/english%2F..%2Fczech

app.get('/:arg', getFile);

//
// Example 2: shell injection (root takeover)
//

// curl http://localhost:8080/job/git%40github.com%3Asuculent%2Fthinx-connect.git
// curl http://localhost:8080/job/git%40github.com%3Asuculent%2Fthinx-connect.git%26%26%20cat%20%2Fetc%2Fpasswd

// Use-cases

app.get('/job/:job', runJob);

// Server listener

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
