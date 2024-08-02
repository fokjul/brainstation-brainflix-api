const express = require('express')
const app = express()
const videoList = require("./data/videos.json");
const { v4: uuidv4 } = require("uuid")
const fs = require('fs')

uuidv4()

//const commentRoutes = require("./routes/comments")
//app.use("/comments", commentRoutes)

//middlewear that parses JSON 
app.use(express.json())
app.use(express.static("public"));

//app.use((req, res, next) =>{} console.log("..") next())

//sets GET endpoint to get list of videos
app.get("/api/videos", (req, res) => {
    res.json(videoList)
})

app.get("/api/videos/:id", (req, res) => {
    fs.readFile('./data/videos.json', 'utf8', (err, data) => {
        if(err){
            console.error(err)
            return res.status(500).send({message: 'Server error'})
        }
        const videoList = JSON.parse(data)
        const video = videoList.find((video) => video && video.id === req.params.id)
        res.json(video)
    })
})
    

app.post(`/api/videos/:id/comments`, (req, res) => {
    //Reads file with data
    fs.readFile('./data/videos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return res.status(500).send({message: 'Server error'});
        }
        const videoList = JSON.parse(data) //Parse JSON data from the file into an array
        const newComment = req.body; //Grabs data from post request 
        
        //Finds video that has the same id as post request
        const video = videoList.find(video => (video && video.id === req.params.id))
        if(video){ //checks if video is truthy
            video.comments.push(newComment) //adds new comment to the video
            fs.writeFile('./data/videos.json', JSON.stringify(videoList, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                } else {console.log('File written successfully')}
            })
        } else {res.status(404).send({message: 'Video is not found'})}

       
    res.status(201).send(res.body)
    })
    
})
//???
app.delete('/api/videos/:id/comments/:commentId', (req, res) => {
    fs.readFile('./data/videos.json', 'utf8', (err, data) => {
        if(err){
            console.error('Error writing file:', err)
            return res.status(500).send({message: 'Server error'});
        } 

        const videoList = JSON.parse(data)
        const currentVideo = videoList.find((video) => video.id === req.params.id)
        if(currentVideo){
            commentIndex = currentVideo.comments.findIndex(comment => comment.id === req.params.commentId)
            if (commentIndex) {
                currentVideo.comments.splice(commentIndex, 1) //removes comment from the comment list
                fs.writeFile('./data/videos.json', JSON.stringify(videoList, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                    } else {console.log('File written successfully')}
                })
            }
        } else {res.status(404).send({message: "Video is not found"})}
    })
    
    
    
    res.send(res.body)

})

app.listen(8080, () => {console.log("Server is running on port 8080")})


