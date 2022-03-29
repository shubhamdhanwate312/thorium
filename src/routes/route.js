const { Route } = require('express');
const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController.js')

const BooksController = require('../controllers/booksController')

// const ReviewController = require('../controllers/reviewController')





//User APIs .............................................................

router.post('/register', UserController.createUser);

router.post('/login',UserController.loginUser)


//Books API...................................................................

router.post('/books', BooksController.createBook);

router.get('/books', BooksController.getbook);

router.get('/books/:bookId', BooksController.getbookdetailsById);

router.put('/books/:bookId', BooksController.updateById);

router.delete('/books/:bookId', BooksController.deleteById);

// Review APIs..............................................................

// router.post('/books/:bookId/review', ReviewController.creatReview);

// router.put('/books/:bookId/review/:reviewId', ReviewController.updatebyReviewId);

// router.delete('/books/:bookId/review/:reviewId', ReviewController.deleteByReviewId);


module.exports = router;