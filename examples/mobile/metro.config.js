/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const escape = require("escape-string-regexp");
const blacklist = require("metro-config/src/defaults/blacklist");
/* eslint-enable @typescript-eslint/no-var-requires */

/*
 * This was taken from react-navigation's monorepo
 * https://github.com/react-navigation/react-navigation/blob/802db004ae70608c31df79cbc710ee77adf3ec3f/example/metro.config.js
 */

const root = path.resolve(__dirname, "..", "..");
const packages = path.resolve(root, "packages");

// List all packages under `packages/`
const workspaces = fs
  .readdirSync(packages)
  .map((p) => path.join(packages, p))
  .filter((p) => fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, "package.json")));

// Get the list of dependencies for all packages in the monorepo
const modules = Array.from(
  new Set(
    ["@expo/vector-icons"]
      .concat(
        ...workspaces.map((it) => {
          const pkg = JSON.parse(fs.readFileSync(path.join(it, "package.json"), "utf8"));

          // We need to make sure that only one version is loaded for peerDependencies
          // So we blacklist them at the root, and alias them to the versions in example's node_modules
          return [
            ...Object.keys(pkg.peerDependencies || {}),
            ...Object.keys(pkg.dependencies || {}),
            // ...Object.keys(pkg.devDependencies || {}),
          ];
        })
      )
      .filter(
        (m) =>
          // Remove duplicates and package names of the packages in the monorepo
          !m.startsWith("@uplift-ltd/")
      )
  )
);

module.exports = {
  projectRoot: __dirname,

  // We need to watch the root of the monorepo
  // This lets Metro find the monorepo packages automatically using haste
  // This also lets us import modules from monorepo root
  watchFolders: [root],

  resolver: {
    // We need to blacklist the peerDependencies we've collected in packages' node_modules
    blacklistRE: blacklist(
      [].concat(
        ...workspaces.map((w) =>
          modules.map((m) => new RegExp(`^${escape(path.join(w, "node_modules", m))}\\/.*$`))
        )
      )
    ),

    // When we import a package from the monorepo, metro won't be able to find their deps
    // We need to specify them in `extraNodeModules` to tell metro where to find them
    extraNodeModules: modules.reduce(
      (acc, name) => ({
        ...acc,
        [name]: path.join(root, "node_modules", name),
      }),
      {}
    ),
  },

  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        // When an asset is imported outside the project root, it has wrong path on Android
        // So we fix the path to correct one
        if (/\/packages\/.+\.png\?.+$/.test(req.url)) {
          req.url = `/assets/../${req.url}`;
        }

        return middleware(req, res, next);
      };
    },
  },
};
