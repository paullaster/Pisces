export default {
    apps: [
      {
        name: 'pisces',
        script: 'server.js',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
          NODE_ENV: 'production',
        },
        env_development: {
          NODE_ENV: 'development',
        }
      }
    ]
  };
  