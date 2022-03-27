const express = require('express');
const router = express.Router();

const authorController = require('../controllers/authorController')
const blogController = require('../controllers/blogController')
const middleware=require("../middleware/authh")


router.post("/authors", authorController.createAuthor)

router.post("/login", authorController.loginAuthor)

router.post("/blogs",  middleware.auth, blogController.createBlog)

router.get("/blogs",  middleware.auth, blogController.getBlog)

router.put("/blogs/:blogId", middleware.auth, blogController.updateBlog)

router.delete("/blogs/:blogId", middleware.auth, blogController.deleteBlogById)

router.delete("/blogs",  middleware.auth, blogController.deletedByQueryParams)


module.exports = router;


