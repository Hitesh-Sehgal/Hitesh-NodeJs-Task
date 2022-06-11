let async = require('async'),
    jwt = require('jsonwebtoken');

let util = require('../Utilities/util'),
    userDAO = require('../DAO/userDAO');
    require('dotenv').config();


/*****  Login API *****/
let userLogin = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.email_id || !data.password) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING, "result": null })
                return;
            }

            let criteria = {
                email_id: data.email_id,
                password: util.encryptData(data.password)
            }
            userDAO.userLogin(criteria, (err, dbData) => {
                console.log("User Login--->", err)
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR, "result": null })
                }
                else if (dbData && dbData.length) {
                    const token = jwt.sign({ id: dbData[0].user_id }, process.env.TokenKey, {})
                    dbData[0].token = token

                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.LOGIN_SUCCESS, "result": dbData[0] });
                }
                else {
                    cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.INCORRECT_CREDENTIALS, "result": null });
                }
            });
        }
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

/******* Add Product *******/
let addProduct = (data, files, cb) => {
    async.auto({
            checkUserExistsinDB: (cb) => {
                if (!data.product_name || !data.description || !data.quantity || !data.unit_price) {
                    cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING, "result": null })
                    return;
                }

                var productData = {
                    "product_name": data.product_name ? data.product_name : '',
                    "description": data.description ? data.description : '',
                    "quantity": data.quantity ? data.quantity : 0,
                    "unit_price": data.unit_price ? data.unit_price : 0.0,
                    "status": '1'
                }

                if(files != undefined){
                    productData.product_image = files.filename
                }
                userDAO.addProduct(productData, (err, dbData) => {
                    console.log("Add Product-->", err)
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR, "result": null });
                        return;
                    } else {
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.PRODUCT_ADDED, "result": productData});
                    }
                });
            }                             
        },
        (err, response) => {
            cb(response.checkUserExistsinDB);
        })
}

/*****  Get Product List *****/
let getProductList = (headers, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token
            })

            let criteria = {
                "user_id": userId
            }
            
            userDAO.getProductList(criteria, (err, dbData) => {
                console.log("Get Product List--->", err)
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR, "result": null })
                }
                else if (dbData && dbData.length) {

                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Products List", "result": dbData });
                }
                else {
                    cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": "No Products Available"});
                }
            });
        }
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

/************ Add To Cart ***********/
let addToCart = (data, headers, cb) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.product_id || !data.quantity || !data.price) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token
            })

            let cartData = {
                "user_id": userId,
                "product_id": data.product_id ? data.product_id : '',
                "quantity": data.quantity ? data.quantity : '0',
                "price": data.price ? data.price : '0'
            }
            userDAO.addToCart(cartData, (err, dbData) => {
                console.log("Add to cart--->", err);
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR, "result": null });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Added to cart successfully"});
                    return;
                }
            });
        }
    }, (err, response) => {
        cb(response.checkUserExistsinDB);
    })
}

/************ Update Cart ***********/
let updateCart = (data, headers, cb) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.product_id || !data.quantity) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token
            })

            let cartData = {
                "user_id": userId,
                "product_id": data.product_id ? data.product_id : '',
                "quantity": data.quantity ? data.quantity : '0'
            }
            userDAO.updateCart(cartData, (err, dbData) => {
                console.log("Update cart--->", err);
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR, "result": null });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Cart Updated successfully"});
                    return;
                }
            });
        }
    }, (err, response) => {
        cb(response.checkUserExistsinDB);
    })
}

/*************** Get Cart Detail *****************/
let getCart = (headers, cb) => {
    async.auto({
        checkUserExistsinDB: (cb) => {

            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token
            })

            let criteria = {
                user_id: userId
            }
            userDAO.getCart(criteria, (err, dbData) => {
                console.log("Get cart--->", err);
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_FOUR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Cart Got successfully", "result": dbData});
                    return;
                }
            });
        }
    }, (err, response) => {
        cb(response.checkUserExistsinDB);
    })
}

module.exports = {
    userLogin: userLogin,
    addProduct: addProduct,
    getProductList: getProductList,
    addToCart: addToCart,
    updateCart: updateCart,
    getCart: getCart,

}