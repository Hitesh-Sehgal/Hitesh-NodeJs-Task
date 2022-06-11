let jwt = require('jsonwebtoken'),
    MD5 = require("md5");


let encryptData = (stringToCrypt) => {
    return MD5(stringToCrypt);
};

    // Define Error Codes
let statusCode = {
    OK: 200,
    FOUR_ZERO_FOUR: 404,
    INTERNAL_SERVER_ERROR: 400,
    FOUR_ZERO_ONE: 401,
    FOUR_ZERO_ZERO: 400,
    BAD_REQUEST: 404,
    FIVE_ZERO_ZERO: 500,
};

// Define Error Messages
let statusMessage = {
    PARAMS_MISSING: 'Mandatory Fields Missing',
    DB_ERROR: 'database related error occured', // data base related error...
    INTERNAL_SERVER_ERROR: 'Internal server error.', //500
    SOMETHING_WENT_WRONG: 'Something went wrong.',
    LOGIN_SUCCESS: "Login Successfully.",
    PRODUCT_ADDED: "Product Added Successfully",
    INCORRECT_CREDENTIALS: "Incorrect Credentials.",
    INVALID_TOKEN: "User Authentication Failed. Please login again."
};


let jwtDecode = (token, callback) => {
  jwt.verify(token, process.env.TokenKey, (err, decoded) => {
      if (err) {
          callback(null)
      } else {
          callback(null, decoded.id)
      }
  })
}

let jwtEncode = (auth) => {
  // console.log("token generate")
  var token = jwt.sign({ id: auth }, process.env.TokenKey, {})
  return token;
}


module.exports = {
    statusCode: statusCode,
    statusMessage: statusMessage,
    encryptData: encryptData,
    jwtDecode: jwtDecode,
    jwtEncode: jwtEncode,

}