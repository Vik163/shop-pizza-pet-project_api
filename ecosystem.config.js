module.exports = {
  apps: [
    {
      name: 'nestjs-app',
      script: './dist/src/main.js',
      autorestart: true,
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
