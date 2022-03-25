const { Route } = require('express');
const express = require("express");
const router = express.Router();
const controller = required("../controllers/userController.js")

router.post("/register", controller.createUser);


module.exports = router;