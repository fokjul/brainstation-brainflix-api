const express = require ('express')
const router = express.Router()

router.get("/", (req, res) =>{
    
    res.send("get all comments")
})

router.post("/", (req, res) =>{
    res.send("saving the comments")
})


//export this so it can be used in index.js
module.exports = router;