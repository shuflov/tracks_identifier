module.exports = {
  apps: [
    {
      name: 'tracks-backend',
      script: './server/index.js',
      cwd: '/home/shuflovic/tracks_identifier',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'tracks-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/shuflovic/tracks_identifier',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};