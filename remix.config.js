/** @type {import("@remix-run/dev").AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  future: {
    unstable_tailwind: true,
    // makes the warning go away in v1.15
    v2_routeConvention: true,
  },
  serverDependenciesToBundle: [
    /^d3.*/,
    /^internmap.*/,
    /^delaunator.*/,
    /^robust-predicates.*/,
  ],
};
