const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
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

var mailOptions,link;

module.exports = (app) => {
  
    app.post('/api/account/signup', (req, res, next) => {
        console.log("123");
        const { body } = req;
        const {
            password
        } = body;
        let {
            email
        } = body;

        if (!email) {
            return res.send({
                success: false,
                message: 'Error: Email can not be blank'
            });
        }
        if (!password) {
            return res.send({
                success: false,
                message: 'Error: Password can not be blank'
            });
        }

        email = email.toLowerCase();
        email = email.trim();
        
        User.find({
            email: email
        }, (err, previousUser) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }
            if (previousUser.length > 0) {
                return res.send({
                    success: false,
                    message: 'Error: Account already exist'
                });
            }
            //console.log("email:", email);
            host=req.get('host');
            link="http://"+req.get('host')+"/verify?id="+email;
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

            const newUser = new User();

            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            newUser.save((err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Server Error'
                    });
                }
                return res.send({
                    success: true,
                    message: 'Verify Your Email'
                });
            });
        });
    });

    app.post('/api/account/signin', (req, res, next) => {
      const { body } = req;
      const {
        password
      } = body;
      let {
        email
      } = body;

      if (!email) {
        return res.send({
          success: false,
          message: 'Error: Email cannot be blank'
        });
      }
      if (!password) {
        return res.send({
          success: false,
          message: 'Error: Password cannot be blank'
        });
      }

      email = email.toLowerCase();
      email = email.trim();

      User.find({
        email
      }, (err, users) => {
        if (err) {
          //console.log("err 2:", err);
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
        if (users.length!=1) {
          return res.send({
            success: false,
            message: 'Error: Invalid'
          });
        }

        const user = users[0];
        if (!user.validPassword(password)) {
          return res.send({
            success: false,
            message: 'Error: Invalid Password'
          });
        }

        if (!user.checkUprooved()) {
          return res.send({
            success: false,
            message: 'Error: Not Uprooved'
          });
        }

        const userSession = new UserSession();
        userSession.userId = user._id;
        userSession.save((err, doc) => {
          if (err) {
            console.log(err);
            return res.send({
              success: false,
              message: 'Error: Server error'
            });
          }

          return res.send({
            success: true,
            message: 'Valid SignIn',
            token: doc._id
          });
        });
      });
    });

    app.get('/api/account/logout', (req, res, next) => {
      
      const { query } = req;
      const { token } = query;

      UserSession.findByIdAndDelete({
        _id: token
      }, (err, session) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.send({
          success: true,
          message: 'Good'
        });
      })
    })

    app.get('/api/account/verify', (req, res, next) => {

      const { query } = req;
      const { token } = query;

      UserSession.find({
        _id: token
      }, (err, sessions) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }

        if (sessions.length != 1) {
          return res.send({
            success: false,
            message: 'Error: Invalid'
          });
        } else {
          return res.send({
            success: true,
            message: 'Good'
          });
        }
      });
    });

    app.post('/api/account/verify', (req, res, next) => {
      const id = req.body.id;
      //console.log(id)
      User.update({
        email: id
      },{
        isVerified: true
      }, (err, user) => {
        
        if (err) {
          return res.send({
              success: false,
              message: 'Error: Server Error'
          });
        }
        
        return res.send({
            success: true,
            message: 'Email Verified'
        });
      });

    });

    app.get('/api/account/getAllAccount', (req, res, next) => {

      User.find({
        isVerified: true,
        isUprooved: false
      }, (err, users) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        } else {
          return res.send({
            accounts: users,
            success: true,
            message: 'Good'
          });
        }
      });
    });

    app.get('/api/account/approve', (req, res, next) => {

      const { query } = req;
      const { id } = query;

      User.findByIdAndUpdate({
        _id: id
      }, {
        $set:{
          isUprooved: true
        }
      }, null, (err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }

        host=req.get('host');
            link="http://"+req.get('host');
            //sendVerificationEmail(email);
            mailOptions={
              from:"singhpurshotam1@gmail.com",
              to : user.email,
              subject : "Please confirm your Email account",
              text: 'Please confirm your email',
              html : "Hello,<br> Your account is approved.<br><a href="+link+">Click here to Login</a>"
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

        return res.send({
          success: true,
          message: 'Good'
        });
      });
    });
};
