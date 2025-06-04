const { join, dirname, resolve } = require("node:path");
const { fileURLToPath } = require("node:url");

const cwd = __dirname;

module.exports = {
  apps: [
    {
      name: 'Noels ecommerce',
      cwd: resolve(cwd),
      script: 'server.js',
      interpreter: 'node',
      interpreter_args: ` --experimental-transform-types --max_old_space_size=1400 --env-file=${join(cwd, '.env')}`,
      post_update: ["npm install", "npm run migrate", "echo Noels ecommerce deployed"],
      env_file: `${join(cwd, '.env')}`,
      watch: false,
      ignore_watch: ["node_modules"],
      instances: '2',
      exec_mode: 'cluster',
      max_memory_restart: '1800M',
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

