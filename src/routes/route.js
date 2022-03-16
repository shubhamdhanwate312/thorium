const express = require('express');
const router = express.Router();

const BlogController= require("../controllers/blogController")

const AutherController= require("../controllers/AutherController")

const middleware=require("../middleware/authh")

// Creat auther......
router.post("/auther",AutherController.createauther)
//Login auther....
router.post("/login",BlogController.loginAuther)
// Creat blog.......
router.post("/blog",middleware.authenticate,BlogController.createblog)
//Getblog.....
router.get("/getblogg",middleware.authenticate,BlogController.getBlog)
//Updateblog.....
router.put("/updateblogg/:blogID",middleware.authenticate,BlogController.updateblog)
//Delete blog by ID......
router.delete("/deleteblogg/:blogID",middleware.authenticate,BlogController.deletebyId)
//Delete blog by Query.......
router.delete("/deletequery",middleware.authenticate,BlogController.deletebyQuery)

module.exports = router;
