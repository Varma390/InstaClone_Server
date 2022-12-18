const postRoute = require('express').Router()
const PostModel = require('../models/postDataModal')
const bodyParser = require('body-parser')
// const cloudinary = require("../models/cloudinary")
// const fs = require('fs')
var cloudinary = require('cloudinary').v2;
postRoute.use(bodyParser.json())
const dotenv = require('dotenv');
dotenv.config();
cloudinary.config({ 
    cloud_name: process.env.CLOUD, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
  });
const cors = require("cors");
postRoute.use(cors());
const multer = require("multer")
// // for storing files

// const upload = multer({storage:multer.diskStorage({
// })})

const ownStorage = multer.diskStorage({
    // destination: (req,file,cb) => {
    //     cb(null,  "local_folder/files" );
    // },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage:ownStorage})

postRoute.get('/PostView', async (req,res) => {
    try{
let found = await PostModel.find().sort({order:-1});
        res.json(found)
    } catch(err) {
        res.json({
            result : "failure"
        })
    }
})
postRoute.post('/PostData',upload.single('imageData1'), async (req,res) => {
    console.log(req.body,req.file)
    try{
        console.log('before');
        const uploadedImage = await cloudinary.uploader.upload(req.file.path,{
            upload_preset: 'images'
        })
        // const uploadedImage = await cloudinary.uploader.upload(req.body.imagefile)
        // const upload = await cloudinary.v2.upload1.upload(req.file.path);
        // console.log(uploadedImage);
        
        let obj = {
            file: uploadedImage.secure_url,
            // file: uploadedImage.url,

            name : req.body.author1,
            description : req.body.description1,
            location : req.body.location1,
            order: Date.now()
        }
        console.log(obj)
        console.log('AFTER')

        await PostModel.create(obj)
        .then(res => console.log(res))
        .catch(err => console.log(err))

        res.status(200).json({
            result : "success",
            frontEndMessage : req.body,
            addedData : obj

        })
    } catch(err) {
        res.status(400).json({
            result : "failure",
            message: err.message
        })
    }
})
// postRoute.post('/PostData',upload.single("imageData1"), async (req,res) => {
//     try{

//         let obj = {
//             name : req.body.author1,
//             description : req.body.description1,
//             location : req.body.location1,
//             PostImage : {
//                 data: fs.readFileSync('local_folder/files/' + req.file.filename),
//                 contentType: 'image/png'
//             }
//         }

//         await PostModel.create(obj)
//         .then(res => console.log("successful"))
//         .catch(err => console.log(err))

//         res.status(200).json({
//             result : "success",
//             frontEndMessage : req.body,
//             addedData : obj
//         })
//     } catch(err) {
//         res.status(400).json({
//             result : "failure",
//             message: err.message
//         })
//     }
// })
module.exports = postRoute;
