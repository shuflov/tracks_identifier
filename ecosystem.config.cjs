module.exports = {
  apps: [
    {
      name: 'tracks-backend',
      script: './server/index.js',
      cwd: '/home/pi/tracks_identifier',
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
      cwd: '/home/pi/tracks_identifier',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};