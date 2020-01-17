const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const DayTimeAppointmentSchema = mongoose.Schema({
    day: {
        type: Number,
        default: 0
    },
    startTime: {
        type: Date,
        default: new Date()
    },
    endTime: {
        type: Date,
        default: new Date()
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('DayTimeAppointment', DayTimeAppointmentSchema);