/// <reference types="mocha" />
/// <reference types="chai" />
/// <reference types="chai-as-promised" />
import path = require('path');
import electron = require('electron');
import { Application } from 'spectron';
import { awaitAngular } from './spectron/await-angular';
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const appPath = path.join(__dirname, '..', 'dist');

export function launchApp() {
  return new Application({
    path: electron,
    args: [appPath]
  } as any);
}

export { awaitAngular };

export function awaitReady(app) {
  return app.start()
    .then(() => {
      return app.client.waitUntilWindowLoaded(5000);
    })
    .then(() => {
      return awaitAngular(app.client);
    });
}

export function stopApp(app) {
  if (app && app.isRunning()) {
    return app.stop();
  }
}
