const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

const sendEmail = async (user) => {
  const emailUser = await user.email;
  const userId = await user._id.toString(); 
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
      
    });
    const token = jwt.sign({
    data: 'Token Data' }, 'ourSecretKey' ,{ expiresIn: '10m' }
    );  
    const mailConfigurations = {
  
      // It should be a string of sender/server email
      from: process.env.USER,
    
      to: emailUser,
    
      // Subject of Email
      subject: "Email Verification",
        
      // This would be the text of email body
      text: `Hi! There, You have recently visited 
             our website and entered your email.
             Please follow the given link to verify your email
             http://localhost:3000/verify/${userId}/${token} 
             Thanks`
        
  };
  transporter.sendMail(mailConfigurations, function(error, info){
    if (error) throw Error(error);
    console.log('Email Sent Successfully');

  });
  } catch (error) {
    console.log("email not sent");
    console.log(error);

  }
};

module.exports = sendEmail;