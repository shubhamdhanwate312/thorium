const express = require('express');
const router = express.Router();
const UserController = require("../controllers/userController")
const BookController = require("../controllers/bookController")
const ReviewController = require("../controllers/reviewcontroller")
const { authentication, authorisation} = require('../middleware/auth');


//▶User API.............
router.post("/register", UserController.createUser);
router.post("/login", UserController.loginUser)


//▶Book API..............
router.post('/books',authentication, BookController.createBook);
router.get('/books',authentication, BookController.getBooks);
router.get('/books/:bookId',authentication, BookController.getBookById);
router.put('/books/:bookId',authentication,authorisation, BookController.updateBook);
router.delete('/books/:bookId',authentication,authorisation, BookController.deleteBookById);


//▶Review API.............
router.post('/books/:bookId/review', ReviewController.createReview);
router.put('/books/:bookId/review/:reviewId', ReviewController.updateReviews);
router.delete('/books/:bookId/review/:reviewId', ReviewController.deleteReviewById);


module.exports = router;