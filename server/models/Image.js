const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.set('useFindAndModify', false);

const ImageSchema = new mongoose.Schema({
    imageName: {
        type: String,
        default: "none",
        required: true
    },
    imageData: {
        type: String,
        required: true
    },
    isProfile: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Image', ImageSchema);