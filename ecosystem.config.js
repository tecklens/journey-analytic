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
            script: "serve",
            args: "-s dist/apps/admin -p 4202",
            env_production: {
                NODE_ENV: "production",
                VITE_BASE_DOMAIN: 'https://ja-measurement.wolfx.app'
            },
        },
    ],
};
