const express = require ('express')
const router = express.Router()
const fs = require('fs')
const path = require('path');
const dataFilePath = path.join(__dirname, '..', 'data', 'videos.json');


router.use(express.json()) //Loads a middlewear function express.json() to parse JSON data from HTTP requests

//Sets GET endpoint to get list of videos
router.get('/', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if(err) {
            return res.status(500).send({message: "Server error"})
        }
        const videoList = JSON.parse(data)
        res.status(200).json(videoList)
    })
})

router.post('/', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if(err) {
            return res.status(500).send({message: "Server error"})
        }
        const videoList = JSON.parse(data)
        const newVideo = req.body
        if(!newVideo) 
            {res.status(404).send({message: 'Video is not found'})}
        videoList.push(newVideo)
        console.log(videoList)
        fs.writeFile(dataFilePath,  JSON.stringify(videoList, null, 2), 'utf8', (err, data) => {
            if (err) {
                console.log("Error writing file", err)
                return res.status(500).send({message: "Server error"})
            } else {"File written successfully"}
        })
        res.status(200).send(res.body)
    })
})

router.delete('/:id', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        //Catch error reading file
        if(err) return res.status(500).send({message: "Server error"})
        const videoList = JSON.parse(data)
        const updatedVideoList = videoList.filter(video => video.id !== req.params.id)

        //Catch if updatedVideoList is not truthy
        if(!updatedVideoList) return res.status(400).send({message: `Video with ${req.params.id} not found`})
        fs.writeFile(dataFilePath, JSON.stringify(updatedVideoList, null, 2), 'utf8', (err) => {
            if(err) return res.status(500).send({message: "Error writing file"})
            res.status(200).send({message: 'File written successfully' + updatedVideoList})
        })
    })

})

//sets GET endpoint to get a video with specific id
router.get('/:id', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if(err){
            return res.status(500).send({message: 'Server error'})
        }
        const videoList = JSON.parse(data)
        const currentVideo = videoList.find((video) => video.id === req.params.id)
        if(!currentVideo) {
            return res.status(400).send({ message: `Video with ${req.params.id} not found`})
        }
        res.json(currentVideo) //sends js object as JSON to the client
    })
})

//sets POST endpoint to post a comment to a specific video
router.post('/:id/comments', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {  //Reads file with video data
        if (err) { // error handling when reading file
            console.error(err)
            return res.status(500).send({message: 'Server error'});
        }
        
        const videoList = JSON.parse(data) //Parses JSON data from the file into an array
        const newComment = req.body; //Grabs data from post request 
        
        const video = videoList.find(video => (video && video.id === req.params.id)) //Finds video with id === to video id in post request
        if(video){ 
            video.comments.push(newComment) //Adds new comment to the video
            fs.writeFile(dataFilePath, JSON.stringify(videoList, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return res.status(500).send({message: "Server error"})
                } else {console.log('File written successfully')}
            })
        } else {res.status(404).send({message: 'Video is not found'})}
    res.status(201).send(res.body)
    })
})

//sets DELETE endpoint to delete a comment for a specific video
router.delete('/:id/comments/:commentId', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if(err){
            console.error('Error writing file:', err)
            return res.status(500).send({message: 'Server error'});
        } else {console.log('File written successfully')}

        const videoList = JSON.parse(data)
        const currentVideo = videoList.find((video) => video.id === req.params.id)
        if(currentVideo){
            commentIndex = currentVideo.comments.findIndex(comment => comment.id === req.params.commentId) //finds index of the comment in the array of comments
            if (commentIndex !== -1) {
                currentVideo.comments.splice(commentIndex, 1) //removes the comment from the array (comment list) by index. When currentVideo is updated, videoList is updated too
                fs.writeFile(dataFilePath, JSON.stringify(videoList, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                    } 
                    console.log('File written successfully')
                    res.status(204).send();
                })
            }
        } else {res.status(404).send({message: "Video is not found"})}
    })
})

//export this so it can be used in index.js
module.exports = router;





    

