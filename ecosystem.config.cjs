const { join, dirname, resolve } = require("node:path");
const { fileURLToPath } = require("node:url");

const cwd = __dirname;

module.exports = {
  apps: [
    {
      name: 'Noels ecommerce',
      cwd: resolve(cwd),
      script: 'server.js',
      env_file: `${join(cwd, '.env')}`,
      watch: false,
      ignore_watch: ["node_modules"],
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '3G',
      post_update: ["npm install", "npm run migrate", "echo Noels ecommerce backend api service deployed"],
      node_args: ["--max_old_space_size=500", `--env-file=${join(cwd, '.env')}`],
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',

      }
    }
  ]
};

