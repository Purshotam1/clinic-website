const Appointment = require('../../models/Appointment');
const DayTimeAppointment = require('../../models/DayTimeAppointment');
var nodemailer =  require('nodemailer');

var smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  tls: true,
  auth: {
    user: 'singhpurshotam1@gmail.com',
    pass: '7383146556'
  }
});
smtpTransport.verify((err, success) => {
  if (err) console.error(err);
  else 
  console.log('Your config is correct');
});

module.exports = (app) => {

    app.get('/api/appointment/getAllAppointment', (req, res, next) => {

        Appointment.find({
            isVerified: true
        }, (err, appointments) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: server error'
                });
            }
            
            return res.send({
                appointments,
                success: true,
                message: 'Good'
            });
        })

    });

    app.post('/api/appointment/addAppointment', (req, res, next) => {

        let {
            email,
            name,
            dateOfAppointment
        } = req.body;
        //console.log(req.body);
        if (!email) {
            return res.send({
                success: false,
                message: 'Error: Email can not be blank'
            });
        }

        if (!name) {
            return res.send({
                success: false,
                message: 'Error: Name can not be blank'
            });
        }

        if (!dateOfAppointment) {
            return res.send({
                success: false,
                message: 'Error: Date and time can not be blank'
            });
        }

        email = email.toLowerCase();
        email = email.trim();

        Appointment.find({
            email: email
        }, (err, appointments) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: server error'
                });
            }
            if (appointments.length>0) {
                return res.send({
                    success: false,
                    message: 'Error: Appointment with this email already exist'
                });
            }

            host=req.get('host');
            link="http://"+req.get('host')+"/verifyAppointment?id="+email;
            //sendVerificationEmail(email);
            mailOptions={
              from:"singhpurshotam1@gmail.com",
              to : email,
              subject : "Please confirm your Email account",
              text: 'Please confirm your email',
              html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
            }
            
            //console.log("mailoption:", mailOptions);
            
            smtpTransport.sendMail(mailOptions, function(error, response){
              if(error){
                    console.log(error);
                    res.end("error");
              }else{
                    console.log("Message sent: " + response.message);
                    res.end("sent");
              }
            });

            const newAppointment = new Appointment();
            newAppointment.email = email;
            newAppointment.name = name;
            newAppointment.dateOfAppointment = dateOfAppointment;

            newAppointment.save((err, appointment) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Server Error'
                    });
                }
                return res.send({
                    success: true,
                    message: 'Appointment is confirmed after you verify your email'
                });
            });
        });
    });

    app.get('/api/appointment/checkAppointment', (req, res, next) => {
        
        const { query } = req;
        const time = new Date(query.time);
        //console.log(time.getUTCMonth());
        Appointment.find({
            dateOfAppointment: new Date(time.getFullYear(), time.getUTCMonth(), time.getUTCDate(), time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds(), time.getUTCMilliseconds()),
            isVerified: true
        }, (err, appointments) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }
            if (appointments.length>0) {
                return res.send({
                    success: false,
                    message: 'Error: Appointment with this time already exist'
                });
            }
            //console.log(1);
            return res.send({
                success: true,
                message: 'Good'
            });
        });
    });

    app.post('/api/appointment/addTime', (req, res, next) => {

        const {
            day
        } = req.body;

        const newDayTimeAppointment = new DayTimeAppointment();
        newDayTimeAppointment.day = day;

        newDayTimeAppointment.save((err, time) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }
            return res.send({
                success: true,
                message: 'Good'
            });
        });
    });

    app.post('/api/appointment/updateTime', (req, res, next) => {
        
        const {
            day,
            isAvailable
        } = req.body;
        const start = new Date(req.body.start);
        const end = new Date(req.body.end);
        //console.log(start);
        if (!isAvailable) {
            DayTimeAppointment.findOneAndUpdate({
                day: day
            }, {
                $set: {
                    isAvailable
                }
            }, { new: true }, (err, doc) => {
                //console.log(doc);
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Server error'
                    });
                }

                return res.send({
                    success: true,
                    message: 'Good'
                });
            });
        } else {

        if (!start||!end) {
            return res.send({
                success: false,
                message: 'Error: start or end time can not be blank'
            });
        }

        DayTimeAppointment.findOneAndUpdate({
            day: day
        }, {
            $set: {
                startTime: start,
                endTime: end,
                isAvailable: isAvailable
            }
        }, { new: true }, (err, doc) => {
            
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }

            return res.send({
                success: true,
                message: 'Good'
            });
        });
        }
    });

    app.get('/api/appointment/getTime', (req, res, next) => {

        const { query } = req;
        const { day } = query;
        //console.log(day);
        DayTimeAppointment.find({
            day
        }, (err, doc) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }
            //console.log(doc);
            return res.send({
                success: true,
                message: 'Good',
                doc
            });
        });
    });

    app.post('/api/appointment/verify', (req, res, next) => {
        
        const {
            id
        } = req.body;
        

        Appointment.find({
            email: id
        }, (err, doc) => {

            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }
            let time = new Date(doc[0].dateOfAppointment);
            Appointment.find({
                dateOfAppointment: new Date(time.getFullYear(), time.getUTCMonth(), time.getUTCDate(), time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds(), time.getUTCMilliseconds()),
                isVerified: true
            }, (err, docs) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Server error'
                    });
                }

                if (docs.length > 0) {
                    return res.send({
                        success: false,
                        message: 'Error: Date and Time of appointment is not available'
                    });
                }
                Appointment.findOneAndUpdate({
                    email: id
                }, {
                    $set: {
                        isVerified: true
                    }
                }, { new: true }, (err, val) => {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Error: Server error'
                        });
                    }

                    return res.send({
                        success: true,
                        message: 'Appointment Verified'
                    });
                });
                
            });
        });

    });


};