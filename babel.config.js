module.exports = {
    sourceType: 'unambiguous',
    "presets": [
        [
            "@babel/preset-env",
            {
                // see https://babeljs.io/docs/en/babel-preset-env#targets
                // see https://github.com/browserslist/browserslist
                // see https://github.com/browserslist/browserslist#queries
                "targets": ["defaults"]/*{
                    "ie": "8",
                    "edge": "17",
                    "firefox": "60",
                    "chrome": "67",
                    "safari": "11.1",
                }*/,

                "useBuiltIns": "usage",
                // see https://babeljs.io/docs/en/usage#polyfill
 
            }
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "absoluteRuntime": false,
                "corejs": false,
                "helpers": true,
                "regenerator": true,
                "useESModules": false,
                "version": "7.0.0-beta.0"
            }
        ],
        "@babel/plugin-proposal-object-rest-spread",
        //"@babel/plugin-syntax-dynamic-import",
        //"@babel/plugin-syntax-import-meta",
        //"@babel/plugin-proposal-class-properties",
        //"@babel/plugin-proposal-json-strings",
        "@babel/plugin-transform-spread",
    ]
}
