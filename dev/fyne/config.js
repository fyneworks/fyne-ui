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
      url: 'https://cdnjs.cloudflare.com/ajax/libs/react/16.13.0/umd/react.development.js',
      //dev_url: 'https://cdnjs.cloudflare.com/ajax/libs/react/16.13.0/umd/react.development.js',
      //url: 'https://cdnjs.cloudflare.com/ajax/libs/react/16.13.1/umd/react.production.min.js',
      global_object: 'React'
    },
    {
      name: 'React DOM',
      id: 'react-dom',
      url: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.13.0/umd/react-dom.development.min.js',
      //dev_url: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.13.0/umd/react-dom.development.min.js',
      //url: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.13.1/umd/react-dom.production.min.js',
      global_object: 'ReactDOM'
    }
  ]
};