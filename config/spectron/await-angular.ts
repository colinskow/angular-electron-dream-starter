declare const window: any;
declare const document: any;
declare const global: any;

export function awaitAngular(client: any) {
  client.timeouts('script', 5000);
  // From: https://github.com/angular/protractor/blob/master/lib/clientsidescripts.js
  // Returns a promise that resolves when all of Angular 2's components are loaded and stable
  return client.executeAsync(function(done: any) {
    try {
      var testabilities: any = window.getAllAngularTestabilities();
      var count = testabilities.length;
      var decrement = function() {
        count--;
        if (count === 0) {
          done();
        }
      };
      testabilities.forEach(function(testability: any) {
        testability.whenStable(decrement);
      });
    } catch (err) {
      done(err.message);
    }
  }).then(function(err) {
    if(err && err.value) {
      throw err.value;
    }
  });
}
