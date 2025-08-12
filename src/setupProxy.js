const { Proxy } = require('@domoinc/ryuu-proxy');
const manifest = require(`../public/manifest.json`);
const fs = require('fs');

let tempManifest;
const tempPath = `${process.cwd()}/src/manifest.tmp.json`;
try {
  tempManifest = fs.readFileSync(tempPath, 'utf8');
  tempManifest = JSON.parse(tempManifest);
  fs.unlinkSync(tempPath);
} catch (e) {
  // No overrides selected
}
const hasOverrides = tempManifest !== undefined;

const config = {
  manifest: hasOverrides ? tempManifest : manifest,
};
const proxy = new Proxy(config);

module.exports = function(app) {
  app.use(proxy.express());
};
