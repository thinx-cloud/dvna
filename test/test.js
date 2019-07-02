var expect = require('chai').expect;
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

  /*
  it('should return file', function () {
    // 1. ARRANGE
    // 2. ACT
    // 3. ASSERT
  });

  it('should return file contents', function () {
    // 1. ARRANGE
    // 2. ACT
    // 3. ASSERT
  });
  */

  // it('should prevent path-traversal...')

  /// it should NOT...


  it('should terminate at end of testing', function () {
    app.terminate(); // terminates everything incl test.
    done();
  });

});
