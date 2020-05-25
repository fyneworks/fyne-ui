import apps from './apps';

export const config = {
  apps: [
    apps.dialog.config,
    apps.inline.config
  ],
  global_dependencies: [
    {
      name: 'React',
      id: 'react',
      //url: 'https://cdnjs.cloudflare.com/ajax/libs/react/16.13.0/umd/react.development.js',
      url: process.env.NODE_ENV == 'development'
            ? 'https://cdnjs.cloudflare.com/ajax/libs/react/16.13.0/umd/react.development.js'
            : 'https://cdnjs.cloudflare.com/ajax/libs/react/16.13.1/umd/react.production.min.js'
      ,
      global_object: 'React'
    },
    {
      name: 'React DOM',
      id: 'react-dom',
      //url: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.13.0/umd/react-dom.development.min.js',
      url: process.env.NODE_ENV == 'development'
            ? 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.13.0/umd/react-dom.development.min.js'
            : 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.13.1/umd/react-dom.production.min.js'
      ,
      global_object: 'ReactDOM'
    }
  ]
};