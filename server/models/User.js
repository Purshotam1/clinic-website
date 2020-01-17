const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.set('useFindAndModify', false);

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isUprooved: {
        type: Boolean,
        default: false
    },
    signUpDate: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.checkUprooved = function() {
    return this.isUprooved;
};

module.exports = mongoose.model('User', UserSchema);