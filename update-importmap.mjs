import fs from "fs";
import https from "https";
import path from "path";

const impormapFilepath = path.resolve(process.cwd(), "importmap.json");
const importmap = JSON.parse(fs.readFileSync(impormapFilepath));
const url = `https://mftv.s3.eu-central-1.amazonaws.com/%40DavidSprla/styleguide/${process.env.TRAVIS_COMMIT}/DavidSprla-styleguide.js`;

https
  .get(url, res => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      if (
        res.headers["content-type"] &&
        res.headers["content-type"].toLowerCase().trim() ===
          "application/javascript"
      ) {
        const module = `@DavidSprla/styleguide`;
        importmap.imports[module] = url;
        fs.writeFileSync(impormapFilepath, JSON.stringify(importmap, null, 2));
        console.log(`Updated importmap for module ${module}. New url is ${url}.`);
      } else {
        urlNotDownloadable(url, Error(`Content-Type response header must be application/javascript`));
      }
    } else {
      urlNotDownloadable(url,Error(`HTTP response status was ${res.statusCode}`));
    }
  })
  .on("error", err => {
    urlNotDownloadable(url, err);
  });

function urlNotDownloadable(url, err) {
  throw Error(
    `Refusing to update importmap - could not download javascript file at url ${url}. Error was '${err.message}'`
  );
}