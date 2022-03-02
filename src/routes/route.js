const express = require('express');
const router = express.Router();
const allController= require("../controllers/allController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})
router.post('/createNewAuthor', allController.createNewAuthor)
router.post('/createNewBook', allController.createNewBook)
router.get('/allBooks', allController.allBooks)
router.get('/updatedBookPrice', allController.updatedBookPrice)
router.get('/authorsName', allController.authorsName)

module.exports = router;
//MOMENT JS
// const moment = require('moment');
// router.get("/dateManipulations", function (req, res) {
    
    // const today = moment();
    // let x= today.add(10, "days")

    // let validOrNot= moment("29-02-1991", "DD-MM-YYYY").isValid()
    // console.log(validOrNot)
    
//     const dateA = moment('01-01-1900', 'DD-MM-YYYY');
//     const dateB = moment('01-01-2000', 'DD-MM-YYYY');

//     let x= dateB.diff(dateA, "days")
//     console.log(x)

//     res.send({ msg: "all good"})
// })

