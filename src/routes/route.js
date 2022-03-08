const express = require('express');
const router = express.Router();
// const UserModel= require("../models/userModel.js")
const UserController= require("../controllers/userController")
const productController= require("../controllers/productController")
const orederController= require("../controllers/orderController")
const middleWare= require("../middlerware/middlerWare")
router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

// router.post("/createUser",middleWare.falana, UserController.createUser)
 router.post("/createUser", UserController.createUser)
router.get("/getUsersData", UserController.getUsersData)

router.post("/createProduct", productController.createProduct)

router.get("/getBooksData", productController.getProductsData)
/ router.post("/createOrder",orederController.createOrder)
// router.post("/createOrder", middleWare.falana,orederController.createOrder)
// router.post("/deleteBooks", productController.deleteBooks)

router.post("/createUser", commonMw.mid1, UserController.createUser  )

router.post("/createProduct", ProductController.createProduct )

router.post("/createOrder", commonMw.mid1, OrderController.createOrder  )
//MOMENT JS
const moment = require('moment');
const middlewareWrapper = require('cors');
router.get("/dateManipulations", function (req, res) {
    
    // const today = moment();
    // let x= today.add(10, "days")

    // let validOrNot= moment("29-02-1991", "DD-MM-YYYY").isValid()
    // console.log(validOrNot)
    
    const dateA = moment('01-01-1900', 'DD-MM-YYYY');
    const dateB = moment('01-01-2000', 'DD-MM-YYYY');

    let x= dateB.diff(dateA, "days")
    console.log(x)

    res.send({ msg: "all good"})
})

module.exports = router;
