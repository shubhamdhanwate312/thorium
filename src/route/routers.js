const express = require('express')
const router = express.Router()
const urlController = require('../controllers/urlController')

//testing
router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

//url shortner
router.post("/url/shorten", urlController.urlShortner)

//get url
router.get("/:urlCode", urlController);

module.exports = router;