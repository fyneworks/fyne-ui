const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv');
const npm_package = require('./package.json');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {

  // https://www.bennadel.com/blog/3598-webpack-4-automatically-makes-process-env-node-env-available-in-your-javascript.htm
  const isDevelopmentMode = ( argv.mode === "development" || process.env.NODE_ENV == "development");
  const dotenvFile = './.env' + (isDevelopmentMode?'.local':'');
  const dotenv = Dotenv.config({ path:dotenvFile }).parsed;
  const ENV = Object.assign({},
    dotenv,
    {
      NODE_ENV: process.env.NODE_ENV || 'production',
    }
  );
  console.log('webpack env', {isDevelopmentMode, dotenvFile, dotenv, ENV });

  // Locally, we want robust source-maps. However, in production, we want something
	// that can help with debugging without giving away all of the source-code. This
	// production setting will give us proper file-names and line-numbers for debugging;
	// but, without actually providing any code content.
	var devtool = isDevelopmentMode
		? "eval-source-map"
		: "nosources-source-map"
	;
 
	// By default, each module is identified based on Webpack's internal ordering. This
	// can cause issues for cache-busting and long-term browser caching as a localized
	// change can create a rippling effect on module identifiers. As such, we want to
	// identify modules based on a name that is order-independent. Both of the following
	// plugins do roughly the same thing; only, the one in development provides a longer
	// and more clear ID.
	var moduleIdentifierPlugin = isDevelopmentMode
		? new webpack.NamedModulesPlugin()
		: new webpack.HashedModuleIdsPlugin()
  ;
  



  const commonPlugins = [

    // this seems to be the only way to get data into process
    // .env dotenv files loaded into webpack then explicitly loaded here
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(ENV)
    }),
    // THIS HAS TO BE DONE MANUALLY HERE,
    // BUT IT HAPPENS AUTOMATICALLY IN CRA
    // https://create-react-app.dev/docs/adding-custom-environment-variables/

    moduleIdentifierPlugin,
  ];



  const baseConfig = {
    //mode: 'production',
    resolve: {
      alias: {
        "@fyne/ui": path.resolve(__dirname, "src/index.js"),
        "@fyne/analytics": path.resolve(__dirname, "src/analytics.js"),
        "@fyne/hubster": path.resolve(__dirname, "src/hubster.js"),
        "@fyne/context": path.resolve(__dirname, "src/context.js"),
        "@fyne/network": path.resolve(__dirname, "src/network.js"),
        "@fyne/antispam": path.resolve(__dirname, "src/antispam.js"),
        "@fyne/form": path.resolve(__dirname, "src/form.js"),
        "@fyne/select": path.resolve(__dirname, "src/select.js"),
      }
    },
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' },
            { test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, loader: "file" },
            {
              test: /\.(js|mjs|jsx)$/,
              //exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader', //['babel-loader','eslint-loader'],
                query: {
                  presets: [
                    "@babel/preset-env",
                    "@babel/preset-react"
                  ]
                }
              }
            },
            {
              test: /\.(scss|sass|css)$/,
              use: [
                // style-loader
                { loader:'style-loader' },
                // css-loader
                { loader: 'css-loader', options: { modules: true } },
                // sass-loader
                { loader:'sass-loader' },
                // sass-loader https://github.com/postcss/postcss#usage
                { loader:'postcss-loader' },
              ]
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
            {
              test: /\.(png|jpg|gif)$/i,
              use: [
                {
                  loader: 'url-loader',
                  options: {
                    limit: 8192,
                  },
                },
              ],
            },
        ]
    },
    
    devtool,
    stats: {
      // Nice colored output
      colors: true
    },

    // yuck, lazy load a big load, don't chop it up.
    //optimization: {
    //    splitChunks: {
    //        chunks: "all"
    //    }
    //},
  };


  const externals = {
    'react': 'window.React',
    'react-dom': 'ReactDOM',
    'react-addons-transition-group': 'var React.addons.TransitionGroup',
    'react-addons-pure-render-mixin': 'var React.addons.PureRenderMixin',
    'react-addons-create-fragment': 'var React.addons.createFragment',
    'react-addons-update': 'var React.addons.update'
  };

  const inlineConfig = Object.assign({}, baseConfig, {
    entry: {
      form: './dev/form/inline.js'
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'inline.js'
    },
    plugins: commonPlugins,
    externals
  });

  const dialogConfig = Object.assign({}, baseConfig, {
    entry: {
      form: './dev/form/dialog.js'
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'dialog.js'
    },
    plugins:  commonPlugins,
    externals
  });


  // the app lazy loaded in various methods withe fyneUI
  const fyneConfig = Object.assign({}, baseConfig, {
    entry: {
      main: './dev/fyne/index.js'
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'fyne.js'
    },
    plugins: []
      .concat([new CleanWebpackPlugin()])
      .concat(commonPlugins)
      .concat([new HtmlWebpackPlugin({ filename: 'index.html', template: './dev/index.html'})])
      .concat([new HtmlWebpackPlugin({ filename: 'dialog.html', template: './dev/form/dialog.html'})])
      .concat([new HtmlWebpackPlugin({ filename: 'inline.html', template: './dev/form/inline.html' })])
      .concat([new HtmlWebpackPlugin({ filename: 'dynamic.html', template: './dev/form/dynamic.html' })])
      .concat([new CopyWebpackPlugin([{ from: 'favicon' }]),])
      .concat([new CopyWebpackPlugin([{ from: 'static' }]),])
    ,
    devServer: {
      port: 9002,
      compress: true,
      open: true,
      hot: true,
      //inline: false,
      disableHostCheck: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      },
      //contentBase: [
      //  path.join(__dirname, 'dist'),
      //  path.join(__dirname, 'static'),
      //  path.join(__dirname, 'form', 'dist')
      //],
      after: function(app, server, compiler) {
        console.log("Dev server stopped");
      }
    }
  });
  
  
  // the app bundle including fyneUI integration
  const directConfig = Object.assign({}, baseConfig, {
    entry: {
      form: './dev/form/direct.js'
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'direct.js'
    },
    plugins: []
    .concat(commonPlugins)
    .concat([new HtmlWebpackPlugin({ filename: 'direct.html', template: './dev/form/direct.html'})])
  });

  
  // the app without fyneUI integration
  const plainConfig = Object.assign({}, baseConfig, {
    entry: {
      form: './dev/form/plain.js'
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'plain.js'
    },
    plugins: []
    .concat(commonPlugins)
    .concat([new HtmlWebpackPlugin({ filename: 'plain.html', template: './dev/form/plain.html'})])
  });


  // bundles array
  const bundles = [fyneConfig, dialogConfig, inlineConfig, directConfig, plainConfig]
  
  return bundles;
}