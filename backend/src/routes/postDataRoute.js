const postRoute = require('express').Router()
const PostModel = require('../models/postDataModal')
const bodyParser = require('body-parser')
const fs = require('fs')
postRoute.use(bodyParser.json())
const cors = require("cors");
postRoute.use(cors());
const multer = require("multer")
// for storing files
const ownStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,  "local_folder/files" );
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage:ownStorage})

postRoute.get('/PostView', async (req,res) => {
    try{

        let found = await PostModel.find()
        res.json(found)
    } catch(err) {
        res.json({
            result : "failure"
        })
    }
})
postRoute.post('/PostData',upload.single("imageData1"), async (req,res) => {
    try{

        let obj = {
            name : req.body.author1,
            description : req.body.description1,
            location : req.body.location1,
            PostImage : {
                data: fs.readFileSync('local_folder/files/' + req.file.filename),
                contentType: 'image/png'
            } 
        }

        await PostModel.create(obj)
        .then(res => console.log("successful"))
        .catch(err => console.log(err))


        res.status(200).json({
            result : "success",
            frontEndMessage : req.body,
            backEndMessage : obj
        })
    } catch(err) {
        res.status(400).json({
            result : "failure",
            message: err.message
        })
    }
})
module.exports = postRoute;