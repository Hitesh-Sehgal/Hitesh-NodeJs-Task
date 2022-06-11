let dbConfig = require("../Utilities/dbConfig");


/**** Get all User Information *****/
let getalluserForToken = (criteria, callback) => {
    let conditions = "";

    if (criteria.user_id) {
        criteria.user_id ? conditions += `u.user_id = '${criteria.user_id}'` : true;
    }
    dbConfig.getDB().query(`select u.* from users as u where ${conditions}`, callback);

}

/**** Get User Login Data *****/
let userLogin = (criteria, callback) => {
    dbConfig.getDB().query(`select u.* from users as u where u.email_id = '${criteria.email_id}' and u.password = '${criteria.password}'`, callback);
}

/**** Add Products *****/
let addProduct = (dataToSet, callback) => {
    dbConfig.getDB().query("insert into products set ? ", dataToSet, callback);
}

/**** Get Product List *****/
let getProductList = (criteria, callback) => {
    dbConfig.getDB().query(`select p.*, IFNULL((select ci.quantity from cart_items as ci left join cart as c on c.id = ci.cart_id where ci.product_id = p.id and c.user_id = ${criteria.user_id}), 0) as in_cart_quantity from products as p where p.status = '1' and p.quantity > 0`, callback);
}

/**** Add to cart *****/
let addToCart = (dataToSet, callback) => {
    dbConfig.getDB().query(`SELECT * FROM cart WHERE user_id = ${dataToSet.user_id}`, function (err, res) {
        if (err) {
            callback(err, null)
        }
        else {
            if (res.length > 0) {
                let cart_id = res[0]['id'];
                var cart_items = {
                    quantity: dataToSet.quantity,
                    product_id: dataToSet.product_id,
                    price: dataToSet.price,
                    cart_id: cart_id
                }
                dbConfig.getDB().query("insert into cart_items SET ? ", cart_items);
                dbConfig.getDB().query(`UPDATE products SET quantity = quantity - '${dataToSet.quantity}' where id = '${cart_items.product_id}' `, callback);
            }
            else{
                let setData1 = {
                    user_id: dataToSet.user_id
                }
                dbConfig.getDB().query("insert into cart SET ? ", setData1, function (err, cartDbData) {
                    var cart_items = {
                        quantity: dataToSet.quantity,
                        product_id: dataToSet.product_id,
                        price: dataToSet.price,
                        cart_id: cartDbData.insertId
                    }
                    dbConfig.getDB().query("insert into cart_items SET ? ", cart_items);

                    dbConfig.getDB().query(`UPDATE products SET quantity = quantity - '${dataToSet.quantity}' where id = '${cart_items.product_id}' `, callback);
                });
            }
        }
    })
}

/**** Update cart *****/
let updateCart = (dataToSet, callback) => {
    dbConfig.getDB().query(`SELECT * FROM cart WHERE user_id = ${dataToSet.user_id}`, function (err, res) {
        if (err) {
            callback(err, null)
        }
        else {
            if (res.length > 0) {
                let cart_id = res[0]['id'];
                dbConfig.getDB().query(`SELECT * FROM cart_items WHERE cart_id = ${cart_id} AND product_id = ${dataToSet.product_id}`, function (err1, res1) {
                    if (err1) {
                        callback(err1, null)
                    }
                    else {
                        let cart_items_id = res1[0]['id'];
                        
                        dbConfig.getDB().query(`UPDATE cart_items SET quantity = '${dataToSet.quantity}' where id = '${cart_items_id}' `, function (err5, res5) {
                            if (err5) {
                                callback(err5, null)
                            } else {
                                dbConfig.getDB().query(`UPDATE products SET quantity = quantity - '${dataToSet.quantity}' + '${res1[0].quantity}' where id = '${dataToSet.product_id}' `, callback);
                            }
                        });
                    }
                });
            }
        }
    });

}

/*** Get Cart Data ***/
let getCart = (criteria, callback) => {
    dbConfig.getDB().query(`SELECT ci.*, p.product_name, p.description, p.product_image, ci.quantity as cart_quantity, p.status FROM cart as c left join cart_items as ci on c.id = ci.cart_id left join products as p on p.id = ci.product_id WHERE c.user_id = ${criteria.user_id}`, async function (err, res) {
            if (err) {
                callback(err, null)
            } else {
                let total_price = 0;
                
                if (res && res.length > 0) {
                    res.forEach(element => {
                        element.totalProductPrice = parseFloat(element.price) * parseInt(element.quantity);
                        total_price = total_price + parseFloat(element.totalProductPrice);
                    });
                
                    total_price = Math.round((total_price + Number.EPSILON) * 100) / 100;

                }
                
                let obj = {
                    products: res,
                    total_price: total_price,
                }
                callback(null, obj)
            }
        });
}

module.exports = {
    getalluserForToken: getalluserForToken,
    userLogin: userLogin,
    addProduct: addProduct,
    getProductList: getProductList,
    addToCart: addToCart,
    updateCart: updateCart,
    getCart: getCart,

}