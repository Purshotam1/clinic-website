const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const AppointmentSchema = mongoose.Schema({
    email: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    dateOfAppointment: {
        type: Date,
        default: new Date()
    },
    isVerified:  {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);