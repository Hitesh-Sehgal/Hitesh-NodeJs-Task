const jwt = require('jsonwebtoken');
const userDAO = require('../DAO/userDAO');

const auth = {
    verifyToken: (req, res, next) => {
        if (!req.headers.accesstoken || req.headers.accesstoken == "" || req.headers.accesstoken == "") {
            // console.log("token not verified" ,req.headers.accessToken)
            res.send({ "statusCode": "401", "statusMessage": "provide access token " })
            return
        }
        jwt.verify(req.headers.accesstoken, 'TASK_1', (err, decoded) => {
            if (err) {
                res.send({ "statusCode": "501", "statusMessage": "access token related error", "error": err })
            } else {
                userDAO.getalluserForToken({user_id : decoded.id }, (err, result) => {
                   if (err || !result) {
                        res.send({ 'statusCode': "402", 'statusMessage': "User not exists." })
                        return
                    }
                    
                    else{
                         next();
                     }
                })
            }
        })
    }
};



module.exports = auth;