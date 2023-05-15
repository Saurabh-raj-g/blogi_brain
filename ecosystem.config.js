module.exports = {
    apps: [
        {
            name: "blogiBrain-backend",
            script: "./build/server.js",
            instances: "max",
            exec_mode: "cluster",
            autorestart: true,
        },
    ],
};
