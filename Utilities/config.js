const ck = require('ckey');

let config = {
    "DB_URL": {
        "host": ck.MYSQL_HOST,
        "user": ck.MYSQL_USER,
        "password": ck.MYSQL_PASSWORD,
        "database": ck.MYSQL_DATABASE
    },
    "NODE_SERVER_PORT": {
        "port": ck.NODE_SERVER_PORT
    },
    "NODE_SERVER_URL": {
        "url": ck.NODE_SERVER
    }
};




module.exports = {
    config: config
};