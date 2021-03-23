// vidoshow 
const videoshow = require('videoshow')
// fs 
const fs = require('fs')
// gm 
const gm = require('gm').subClass({imageMagick: true});
// path 
const path = require('path')

// var ffmpeg = require('fluent-ffmpeg');

// multer 
const multer  = require('multer');
const { resolve } = require('path');

// multer multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets/imgs')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })

// multer filter
const fileFilter = (req, file, cb) => {
  
    if(file.mimetype === "image/png" || 
    file.mimetype === "image/jpg"|| 
    file.mimetype === "image/jpeg"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
 }

// multer upload
const upload = multer({storage:storage, fileFilter: fileFilter}).array('myImage')


// uploadController 
const uploadController =(req,res)=>{
    res.setHeader('Content-Type', 'video/mp4');
    var videoOptions = {
        fps: 25,
        loop: 5, // seconds
        transition: true,
        transitionDuration: 1, // seconds
        videoBitrate: 1024,
        videoCodec: 'libx264',
        size: '640x420',
        audioBitrate: '128k',
        audioChannels: 2,
        format: 'mp4',
        pixelFormat: 'yuv420p'
      }
    upload(req, res, async(err) =>{ 
    
        if (err) { 
            console.log(err)
        }
         else { 
            if(req.files[0]){
               let images = []
                    req.files.map(file=>{
                      
                        gm("./"+file.path)
                            .resize(1000,1000)
                            .filesize({ bufferStream: true }, function (error, filesize) {
                                // console.log(filesize)
                                // filesize = '256341'
                                return '788423B'
                              })
                            .quality(80)
                            .rawSize(1000, 1000, 1)
                            .filter('Cubic')
                            .crop(1000, 1000)
                            .bitdepth(8)
                            .setFormat("jpg")
                            .stream(function (err, stdout, stderr) {
                                stdout.pipe(fs.createWriteStream('./assets/resized/'+file.filename));
                                images.push(__dirname+'\\assets\\resized\\'+file.filename)
                              })
                            
                     })
                
               
                     
               if(images.length){
                   nameVideo = "myVideo"+Date.now()+".mp4"
                    setTimeout(()=>{
                        console.log(images)
                        videoshow(images, videoOptions)
                            .save('assets/'+nameVideo)
                            .on('start', function (command) {
                                console.log('ffmpeg process started:', command)
                            })
                            .on('error', function (err, stdout, stderr) {
                                console.log('Error:', err)
                                console.log('ffmpeg stderr:', stderr)
                            })
                            .on('end', function (output) {
                                console.log('Video created in:', output)
                                res.send({nameVideo}); 
                            })

                    }, 7000)
               }
            
            }
             
            } 
        })}
	module.exports = uploadController