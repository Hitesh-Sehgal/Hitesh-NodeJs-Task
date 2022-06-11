let express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    userService = require('../Services/userService'),
    authHandler = require('../middleware/verifyToken');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log("ABC", file)
        cb(null, 'Uploads')
    },
    filename: function (req, file, cb) {
        // console.log("qwerty", file)
        cb(null, `${Date.now()}-node_task-${file.originalname}`);
    }
});


/* User Login */
router.post('/userLogin', (req, res) => {
    userService.userLogin(req.body, (data) => {
        res.send(data);
    });
});

let multerUpload = multer({ storage: storage });
/* Add Product API */
router.post('/addProduct', multerUpload.single("product_image"), (req, res) => {
    userService.addProduct(req.body, req.file, (data) => {
        res.send(data);
    });
});

/* Get Product List */
router.get('/getProductList', authHandler.verifyToken, (req, res) => {
    userService.getProductList(req.headers, (data) => {
        res.send(data);
    });
});

/* Add To Cart API */
router.post('/addToCart', authHandler.verifyToken, (req, res) => {
    userService.addToCart(req.body, req.headers, (data) => {
        res.send(data);
    });
});

/* Update Cart */
router.post('/updateCart', authHandler.verifyToken, (req, res) => {
    userService.updateCart(req.body, req.headers, (data) => {
        res.send(data);
    });
});

/* Get Cart */
router.get('/getCart', authHandler.verifyToken, (req, res) => {
    userService.getCart(req.headers, (data) => {
        res.send(data);
    });
});


module.exports = router;