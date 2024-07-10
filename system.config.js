module.exports = {
    "apps": [
      {
        "name": "qik-emailer-service",
        "script": "app.js",
        "instances": 1,
        "autorestart": true,
        "watch": false,
        "max_memory_restart": "1G",
        "env": {
          "NODE_ENV": "development",
          "PORT": 3003
        },
        "env_production": {
          "NODE_ENV": "production",
          "PORT": 3003
        }
      }
    ]
  }
  