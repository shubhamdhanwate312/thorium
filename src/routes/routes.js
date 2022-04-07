const express = require('express');
const router = express.Router();
const urlController = require("../controllers/urlController")



//url shortner
router.post("/url/shorten", urlController.CreaturlShortner)
router.get("/:urlCode", urlController.geturlcode)


module.exports = router;