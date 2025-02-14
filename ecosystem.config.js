module.exports = {
    apps: [
        {
            name: "ja-backend", // Tên ứng dụng NestJS
            script: "nx",
            args: "serve backend", // Chạy lệnh `nx serve api`
            interpreter: "node",
            watch: false, // Không cần watch vì nx đã xử lý hot reload
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
        },
        {
            name: "ja-admin", // Tên ứng dụng ReactJS
            script: "nx",
            args: "serve admin", // Chạy lệnh `nx serve web`
            interpreter: "node",
            watch: false,
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
        },
    ],
};
