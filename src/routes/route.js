const { Route } = require('express');
const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController.js')

const BooksController = require('../controllers/booksController')

const ReviewController = require('../controllers/reviewController')

// const { authentication, authorisation } = require('../middleWare/middleware');

const middleware=require('../middleWare/middleware')

//User APIs .............................................................

router.post('/register', UserController.createUser);

router.post('/login', UserController.loginUser)


//Books API...................................................................

router.post('/books', middleware.auth, BooksController.createBook);

router.get('/books', middleware.auth, BooksController.getbook);

router.get('/books/:bookId', middleware.auth, BooksController.getbookdetailsById);

router.put('/books/:bookId',middleware.auth, BooksController.updateById);

router.delete('/books/:bookId', middleware.auth, BooksController.deleteById);

// Review APIs..............................................................

router.post('/books/:bookId/review', ReviewController.creatReview);

router.put('/books/:bookId/review/:reviewId', ReviewController.updatebyReviewId);

router.delete('/books/:bookId/review/:reviewId', ReviewController.deleteByReviewId);


module.exports = router;