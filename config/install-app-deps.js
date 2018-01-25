const fs = require('fs');
const path = require('path');
const installOrRebuild = fs.existsSync('electron-builder/out/util/yarn')
  ? require('electron-builder/out/util/yarn').installOrRebuild
  : require('electron-builder-lib/out/util/yarn').installOrRebuild;
const printErrorAndExit = require('builder-util/out/promise').printErrorAndExit;

const root = process.cwd();

const rootPackage = require(path.join(root, 'package.json'));
const platform = process.platform;
const arch = process.arch;
const appDir = path.join(root, 'node_modules_electron');
const electronVersion = getElectronVersion(root);

writeAppPackage(rootPackage, appDir);

const options = {
  frameworkInfo: {
    version: electronVersion,
    useCustomDist: false
  },
  platform,
  arch
}

installOrRebuild(rootPackage.build, appDir, options, true)
  .catch(printErrorAndExit);


function getElectronVersion(root) {
  const electronPath = path.join(root, 'node_modules', 'electron');
  const file = path.join(electronPath, 'package.json');
  const package = require(file);
  return package.version;
}

function writeAppPackage(metadata, appDir) {
  const fields = ['name', 'productName', 'version', 'description', 'keywords',
        'author', 'homepage', 'license', 'dependencies'];
  var output = {};
  fields.forEach(function(field) {
    output[field] = metadata[field];
  });
  const outputPath = path.join(appDir, 'package.json');
  if (!fs.existsSync(appDir)){
    fs.mkdirSync(appDir);
  }
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
}
