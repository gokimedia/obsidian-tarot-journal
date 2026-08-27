import { readFile, writeFile } from "node:fs/promises";

const targetVersion = process.env.npm_package_version;
if (!targetVersion) throw new Error("npm_package_version is not set");

const manifest = JSON.parse(await readFile("manifest.json", "utf8"));
const versions = JSON.parse(await readFile("versions.json", "utf8"));

manifest.version = targetVersion;
versions[targetVersion] = manifest.minAppVersion;

await writeFile("manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile("versions.json", `${JSON.stringify(versions, null, 2)}\n`);
