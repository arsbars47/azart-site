// Конфиг PM2 для продакшена.
// Запуск на сервере (после `npm ci && npm run build`):
//   pm2 start ecosystem.config.js
// Обновление без даунтайма после новой сборки:
//   pm2 reload ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "azart-site",
      cwd: __dirname,
      // запускаем бинарь Next напрямую, без лишнего процесса npm
      script: "node_modules/next/dist/bin/next",
      // слушаем только localhost: наружу сайт отдаёт nginx
      args: "start --hostname 127.0.0.1 --port 3000",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production",
      },
      autorestart: true,
      max_memory_restart: "500M",
      kill_timeout: 5000,
      time: true, // метки времени в логах
    },
  ],
};
