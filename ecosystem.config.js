module.exports = {
    apps: [
        {
            name: "ja-backend", // Tên ứng dụng NestJS
            script: "dist/apps/backend/main.js",
            env_production: {
                NODE_ENV: "production",
                PORT: 3002
            },
        },
        {
            name: "ja-admin", // Tên ứng dụng ReactJS
            script: "npx",
            args: "serve dist/apps/admin -s -p 4202",
            env: {
                NODE_ENV: "production",
                VITE_BASE_DOMAIN: 'https://ja-measurement.wolfx.app'
            },
        },
    ],
};
