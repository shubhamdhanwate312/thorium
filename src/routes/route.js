const express = require('express');
const router = express.Router();

let arr =
   [
       {
           "name": "manish",
           "dob": "1/1/1995",
           "gender": "male",
           "city": "jalandhar",
           "sports": [
               "swimming"
           ],
           "bookings": [
               {
                   "bookingNumber": 1,
                   "sportId": "",
                   "centerId": "",
                   "type": "private",
                   "slot": '16286598000000',
                   "bookedOn": '31/08/2021',
                   "bookedFor": '01/09/2021'
               },
               {
                   "bookingNumber": 2,
                   "sportId": "",
                   "centerId": "",
                   "type": "private",
                   "slot": '16286518000000',
                   "bookedOn": '31/08/2001',
                   "bookedFor": '01/09/2001'
               },
           ]
       },
       {
           "name": "gopal",
           "dob": "1/09/1995",
           "gender": "male",
           "city": "delhi",
           "sports": [
               "soccer"
           ],
           "bookings": []
       },
       {
           "name": "lokesh",
           "dob": "1/1/1990",
           "gender": "male",
           "city": "mumbai",
           "sports": [
               "soccer"
           ],
           "bookings": []
       },
   ]
   router.post('/player', function (req, res) {
    let details = req.body.name1.name
    let inputDetails = req.body.name1
    for (let i = 0; i < arr.length; i++) {
    if (details === arr[i].name) {
    console.log("Data already exist")
    res.send("Data already exist")
    }
    else if (i === arr.length - 1) {
    arr.push( inputDetails )
    res.send({arr})
    }
    }  
    res.send(  { data: players , status: true }  )
})
router.post('/players/:playerName/bookings/:bookingId', function(req, res) {
    let name = req.params.playerName
    let isPlayerPresent = false

    for (let i = 0; i < players.length; i++) {
        if (players[i].name == name) {
            isPlayerPresent = true
        }
    }
    if (!isPlayerPresent) {
        return res.send('Player not present')
    }

    let booking = req.body
    let bookingId = req.params.bookingId
    for (let i = 0; i < players.length; i++) {
        if (players[i].name == name) {
            for (let j = 0; j < players[i].bookings.length; j++) {
                if (players[i].bookings[j].bookingNumber == bookingId) {
                    return res.send('Booking with this id is already present')
                }
            }
            players[i].bookings.push(booking)
        }
    }
    res.send(players)
})
module.exports = router;