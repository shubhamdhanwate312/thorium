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

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ Status: false, msg: "Provide input" })
        }

        if (!isValid(longUrl)) {
            return res.status(400).send({ Status: false, ERROR: "Please provide a url field and enter url" })
        }
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

                let url = await urlModel.create({
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

        const urlCode = req.params.urlCode;

        if (!/^(?=.*[a-zA-Z].*)[a-zA-Z\d!@#-_$%&*]{8,}$/.test(urlCode)) {
            return res.status(400).send({ status: false, message: " enter a valid urlCode" });
        }

        // First lets check inside cache memory
        const checkCache = await GET_ASYNC(urlCode);
        console.log(checkCache)
        if (checkCache) {
            return res.status(302).redirect(checkCache);
        } else {
            const getUrlCode = await urlModel.findOne({ urlCode });

            if (!getUrlCode) {
                return res.status(404).send({ status: false, message: "no such url exist" });
            }


            const addCache = SET_ASYNC(
                getUrlCode.longUrl,
                urlCode
            ); if (!addCache) {
                return res.status(404).send({ status: false, message: "no such url exist" });
            }

            // if we found the document by urlCode then redirecting the user to original url
            return res.status(302).redirect(getUrlCode.longUrl);
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

module.exports = { CreaturlShortner, geturlcode }
 
