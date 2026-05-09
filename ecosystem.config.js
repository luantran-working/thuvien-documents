module.exports = {
  apps: [
    {
      name: "thuvien-document.test.iit.vn",
      script: "npx",
      args: "serve -s build -l 3667",
      cwd: __dirname,
      interpreter: "none",
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
    },
  ],
};
