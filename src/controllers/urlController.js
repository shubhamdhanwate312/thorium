const urlModel = require('../models/urlModel')
const validUrl = require('valid-url')
const shortid = require('shortid')
const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    16368,
    "redis-16368.c15.us-east-1-2.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("Y52LH5DG1XbiVCkNC2G65MvOFswvQCRQ", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});



//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

//String only

const isValid = function (value) {
    if (typeof value == 'undefined' || value == null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}



const CreaturlShortner = async function (req, res) {
    try {
        const longUrl = req.body.longUrl

        if (Object.keys(longUrl).length === 0) { return res.status(400).send({ status: false, message: "please input Some data" }) }

        if (!(/(:?^((https|http|HTTP|HTTPS){1}:\/\/)(([w]{3})[\.]{1})?([a-zA-Z0-9]{1,}[\.])[\w]*((\/){1}([\w@?^=%&amp;~+#-_.]+))*)$/.test(longUrl.trim()))) {

            return res.status(400).send({ status: false, message: "please provide valid URL" })

        }
        const myUrl = 'http:localhost:3000'

        const urlCode = shortid.generate().toLowerCase()

        const uRl = await GET_ASYNC(`${longUrl}`)
        console.log(uRl)
        if (validUrl.isUri(longUrl)) {


            let url = await urlModel.findOne({ longUrl }).select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })

            if (url) {
                await SET_ASYNC(`${longUrl}`, JSON.stringify(url))
                res.status(200).send({ status: true, data: url })
            }
            else {

                const shortUrl = myUrl + '/' + urlCode

                console.log(shortUrl)

                url = await urlModel.create({
                    urlCode,
                    longUrl,
                    shortUrl
                })

                let result = {

                    urlCode: url.urlCode,

                    longUrl: url.longUrl,

                    shortUrl: url.shortUrl

                }
                return res.status(201).send({ status: true, data: result })
            }
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, err: err.message })
    }
}


//...............................

let geturlcode = async function (req, res) {
    try {
        let urlCode = req.params.urlCode;
        if (!isValid(urlCode)) {
            return res.status(400).send({ status: false, msg: "not valid urlCode" });
        }
        let cachedData = await GET_ASYNC(`${req.params.urlCode}`);
        console.log(cachedData)
        if (cachedData) {
            const data = JSON.parse(cachedData)

            return res.status(302).redirect(data.longUrl)
        }

        else {
            let fetchUrl = await urlModel.findOne({ urlCode })
            await SET_ASYNC(`${urlCode}`, JSON.stringify(fetchUrl))
            console.log(fetchUrl)
            if (!fetchUrl) {
                return res.status(404).send({ status: false, msg: " this urlCode not found" });
            }
        }
        res.status(302).redirect(fetchUrl.longUrl);

    }
    catch (err) {
        return res.status(500).send({ status: false, err: err.message })
    }
}


module.exports = { CreaturlShortner, geturlcode }

