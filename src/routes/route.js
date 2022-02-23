const express = require('express');
const router = express.Router();

router.get('/test-me',function(req,res){
    res.send('My first ever Api')
});
// 1.
router.get('/students/:name',function(req,res){
    let studentName = req.params.name
    console.log(studentName)
    res.send(studentName)
});
// 2.
router.get('/movies',function(req,res){
    const movies = ['Luca','Cars3','Ice age','up','Hulk']
    res.send(movies)

});
// 3.
router.get('/movies/:index',function(req,res){
    const index = req.params.index
    const movies = ['Luca','Cars3','Ice age','Up','Hulk']
    if (movies.index>movies.length){
        res.send("use a valid index")

    } else {
        res.send(movies[index - 1])

    }

});
// 4.
router.get('/moviez',function(req,res){
    res.send([{id:1,name:'Luca'},{id:2,name:'Cars3'},{id:3,name:'Ice age'},{id:4,name:'Up'},{id:5,name:'Hulk'}])
                                        
});
// 5.
router.get('/films/:filmid',function(req,res){
   let movi=[{id:1,name:'Luca'},{id:2,name:'Cars3'},{id:3,name:'Ice age'},{id:4,name:'Up'},{id:5,name:'Hulk'}]
// let value = req.params.filmid;
// let found=false;
// for(i=0;i<movi.length;i++){

//         res.send("No movie exists with this id")
//     } else{
//         res.send(film[filmId-1])
       
// }
// });
let value = req.params.filmId;
let found = false;
for (let i = 0; i<movi.length; i++) {
  if (movi[i].id == value) {
    found = true;
    res.send(movi[i]);
    break;
  }
}
 if (found == false) {
   res.send("No movie with given index exists!")}
});

module.exports = router;
