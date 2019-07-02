var expect = require('chai').expect;
var assert = require('chai').assert;
var app = require('../app');

// mock data
const git_url = "https://github.com/corpus-solutions/dvna";

describe('app()', function () {

  it('should listen on port 8080 when started', function () {
    // 1. ARRANGE (app is started)
    // 2. ACT (todo: request)
    // 3. ASSERT (request result)
  });

  it('should run job', function () {

    // 1. ARRANGE (app is started)
    const req = { params: { job: git_url }};
    const res = { end: function(input) {
      console.log(input);
    }};

    // 2. ACT (todo: request)
    app.runJob(req, res);

    // 3. ASSERT (will not crash)
  });

  // Use-cases
  // curl http://localhost:8080/czech
  // curl http://localhost:8080/english

  // Misuse-cases
  // curl http://localhost:8080/english%2F..%2F..
  // curl http://localhost:8080/english%2F..%2Fczech

  xit('should return file', function (done) {
    // 1. ARRANGE
    const req = { params: { arg: "czech" }};
    const res = { end: function(input) {
      console.log("function end():");
      console.log("getFile result: " + input);
      console.log("getFile type: "+typeOf(input).toString());
      done();
      //expect(input).to.be.a('string');
    }};

    // 2. ACT
    app.getFile(req, res);

    // 3. ASSERT
  });

  xit('should return file contents from path', function () {
    // 1. ARRANGE
    const path = "./language.json";

    // 2. ACT
    const contents = app.getFileContents(path);

    console.log("getFileContents contents: "+contents);
    console.log("getFileContents type: "+typeOf(contents).toString());
    // 3. ASSERT
    // expect(contents).to.be.a('string');
    if (typeOf(contents) === "string") {
      assert.ok(true);
    } else {
      assert.ok(false);
    }

    const json = JSON.parse(contents);
    expect(json.language).to.be.equal("hacked");
  });


  // it('should prevent path-traversal...')

  /// it should NOT...


  it('should terminate at end of testing', function (done) {
    app.terminate(); // terminates everything incl test.
    done();
  });

});
