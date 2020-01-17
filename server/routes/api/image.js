const Image = require('../../models/Image');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

console.log(__dirname);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

module.exports = (app) => {
    app.post('/api/image/uploadMulter', upload.single('imageData'), (req, res, next) => {
        console.log(req.body);
        const newImage = new Image({
            imageName: req.body.imageName,
            imageData: req.file.path
        });

        newImage.save()
        .then((result) => {
            console.log(result);
            res.status(200).json({
                success: true,
                document: result
            });
        })
        .catch((err) => next(err));
    });

    app.post('/api/image/uploadProfilePhoto', upload.single('imageData'), (req, res, next) => {
        console.log(req.body);
        Image.findOneAndDelete({
            isProfile: true
        }, (err, doc) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Error: server error'
                });
            }
            try {
                fs.unlinkSync(doc.imageData);
                //file removed
            } catch(err) {
                console.error(err);
            }
            const newImage = new Image({
                imageName: req.body.imageName,
                imageData: req.file.path,
                isProfile: true
            });
            
            newImage.save()
            .then((result) => {
                console.log(result);
                res.status(200).json({
                    success: true,
                    document: result
                });
            })
            .catch((err) => next(err));
        })
    });

    app.post('/api/image/deleteImage', (req, res, next) => {
        
        const image = req.body.image;

        Image.findOneAndDelete({
            imageName: image.imageName
        }, (err, doc) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Error: Server error'
                });
            }
            try {
                fs.unlinkSync(image.imageData);
                //file removed
            } catch(err) {
                console.error(err);
            }
            return res.json({
                success: true,
                message: 'Good'
            });
        });
    });

    app.get('/api/image/getImages', (req, res, next) => {

        Image.find({
            isProfile: false
        }, (err, images) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Error: Server error'
                });
            }

            return res.json({
                images: images,
                success: true,
                message: 'Good'
            });
        });
    });

    app.get('/api/image/getProfilePhoto', (req, res, next) => {

        Image.findOne({
            isProfile: true
        }, (err, image) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Error: Server error'
                });
            }

            return res.json({
                photo: image,
                success: true,
                message: 'Good'
            });
        });
    });
};