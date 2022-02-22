let obj=require('../Logger/logger')
let obj1=require('../util/helper')
let obj2=require('../validator/formatter')
let _=require("lodash")


const express = require('express');
const router = express.Router();

router.get('/test-me', function (req, res) {
    // obj.printMyMessage('thorium')
    obj.welcome('welcome')
    obj1.helper('helper')
    obj2.trim()
    obj2.convert()
    res.send('Welcome to my first Application')
});

router.get('/hello', function (req, res) {
    console.log(_.chunk(['jan','feb','march','april','may','june','july','aug','sept','oct','nov','dec'], 4));
console.log(_.union([35,36],[2],[46],[35,44],[88,46]))
console.log(_.tail([1,3,5,7,9,11,13,17,19,21]))
console.log(_.fromPairs([["horror","The shining"],["thiller","shutterisland"],["Fantasy","parisLabrynth"]]))
    res.send('Hello There')
});

module.exports = router;