const express = require('express');
const router = express.Router();
const UserController= require("../controllers/userController")
const BookController= require("../controllers/bookController")


// User API.............
router.post("/registerUser", UserController.createUser);
router.post("/loginUser", UserController.loginUser)

//Books API..............
router.post('/CreateBooks', BookController.createBook);
router.get('/books', BookController.getbook);
router.get('/books/:bookId', BookController.getbookdetailsById);
router.put('/books/:bookId', BookController.updateBook);
router.delete('/books/:bookId', BookController.deleteById);

module.exports = router;