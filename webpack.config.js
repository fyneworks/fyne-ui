const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv');
const pkg = require('./package.json');
const libraryName = pkg.name;

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
        "@fyne/ui": path.resolve(__dirname, "src/"),
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












  // distribution bundles
  const prodBundles = [
    'context',
    'analytics',
    'antispam',
    'api',
    'form',
    'hubster',
    'network',
    'select'
  ].map(b=>
    Object.assign({}, baseConfig, {
      entry: {main:path.resolve(__dirname,'src', b+'.js')},
      output: {
        path:path.resolve(__dirname, './dist'),filename:''+b+'.js',
        library: libraryName,      
        libraryTarget: 'umd',
        publicPath: '/dist/',      
        umdNamedDefine: true  
      },
      optimization: {
        minimize: false,
      },
      plugins: commonPlugins,
      externals, // don't bundle react or react-dom
    })
  );


  // demo bundles
  const demoBundles = [
  
    // the app lazy loaded in various methods withe fyneUI
    Object.assign({}, baseConfig, {
      entry: {main:path.resolve(__dirname,'dev','fyne','index.js')},
      output: { path:path.resolve(__dirname, './demo'),filename:'fyne.js'},
      plugins: []
        .concat([new CleanWebpackPlugin()])
        .concat(commonPlugins)
        .concat([new HtmlWebpackPlugin({ filename: 'index.html', template: './dev/index.html'})])
        .concat([new HtmlWebpackPlugin({ filename: 'dialog.html', template: './dev/form/dialog.html'})])
        .concat([new HtmlWebpackPlugin({ filename: 'inline.html', template: './dev/form/inline.html' })])
        .concat([new HtmlWebpackPlugin({ filename: 'dynamic.html', template: './dev/form/dynamic.html' })])
        .concat([new CopyWebpackPlugin([{ from: 'favicon' }]),])
        .concat([new CopyWebpackPlugin([{ from: 'static' }]),]),
      externals, // don't bundle react or react-dom
    }),

    Object.assign({}, baseConfig, {
      entry: {main:path.resolve(__dirname,'dev','form','inline.js')},
      output: { path:path.resolve(__dirname, './demo'),filename:'inline.js'},
      plugins: commonPlugins,
      externals, // don't bundle react or react-dom
    }),
  
    Object.assign({}, baseConfig, {
      entry: {main:path.resolve(__dirname,'dev','form','dialog.js')},
      output: { path:path.resolve(__dirname, './demo'),filename:'dialog.js'},
      plugins:  commonPlugins,
      externals, // don't bundle react or react-dom
    }),
    
    // the app bundle including fyneUI integration
    Object.assign({}, baseConfig, {
      entry: {main:path.resolve(__dirname,'dev','form','direct.js')},
      output: { path:path.resolve(__dirname, './demo'),filename:'direct.js'},
      plugins: commonPlugins.concat([new HtmlWebpackPlugin({ filename: 'direct.html', template: './dev/form/direct.html'})]),
    }),
  
    // the app without fyneUI integration
    Object.assign({}, baseConfig, {
      entry: {main:path.resolve(__dirname,'dev','form','plain.js')},
      output: { path:path.resolve(__dirname, './demo'),filename:'plain.js'},
      plugins: commonPlugins.concat([new HtmlWebpackPlugin({ filename: 'plain.html', template: './dev/form/plain.html'})]),
    }),

  ];




  const withDevServer = bundles => {
    bundles[0] = Object.assign({}, bundles[0], {
      devServer: {
        port: 9002,
        compress: true,
        open: true,
        hot: true,
        //colors: true, -- cli only, --color
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
        before: function(app, server, compiler) {
          console.log("Dev server started");
        },
        after: function(app, server, compiler) {
          console.log("Dev server stopped");
        }
      }
    });
    return bundles;
  }






  if(process.env.NODE_ENV=='development'){
    return withDevServer(demoBundles);
  }

  return prodBundles.concat(demoBundles);
}