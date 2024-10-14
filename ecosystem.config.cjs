module.exports = {
    apps: [
      {
        name: 'noels-deliveries-api',
        script: 'server.js',
        env_file: "./.env.local",
        watch: false,
        ignore_watch:["node_modules"],
        instances: 'max',
        exec_mode: 'cluster',
        max_memory_restart: '3G',
        post_update:["npm install", "echo noels deliveries apis lauched"],
        node_args: ["--max_old_space_size=500", "--env-file=.env"],
        env_production: {
          NODE_ENV: 'production',
        },
        env_development: {
          NODE_ENV: 'development',

        }
      }
    ]
  };
  
