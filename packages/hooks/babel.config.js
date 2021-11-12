/* eslint-disable func-names */
const { BABEL_ENV } = process.env;
const isCJS = BABEL_ENV !== undefined && BABEL_ENV === "cjs";
const isESM = BABEL_ENV !== undefined && BABEL_ENV === "esm";

module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      "@babel/preset-env",
      {
        modules: isCJS ? "commonjs" : false,
        targets: {
          esmodules: isESM ? true : undefined,
        },
        loose: true,
      },
    ],
    "@babel/preset-typescript",
  ];
  const plugins = [["@babel/plugin-transform-runtime", { corejs: 3 }]];

  return {
    presets,
    plugins,
  };
};
