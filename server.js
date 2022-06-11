let app = require('express')(),
    server = require('http').Server(app),
    bodyParser = require('body-parser');

let userRoute = require('./Routes/user'),
    util = require('./Utilities/util'),
    config = require("./Utilities/config").config;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


app.use(function(err, req, res, next) {
    return res.send({ "errorCode": util.statusCode.FOUR_ZERO_ZERO, "errorMessage": util.statusMessage.SOMETHING_WENT_WRONG });
});

app.use('/user', userRoute);

server.listen(config.NODE_SERVER_PORT.port, function() {
    console.log('Server running on port ' + config.NODE_SERVER_PORT.port);
});