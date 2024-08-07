const nodemailer = require('nodemailer');

module.exports.sendEmail = (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'haiboss2005@gmail.com',  // demo, phải bổ sung thêm biến ENV user và password
      pass: '...'                     // link docs: https://miracleio.me/snippets/use-gmail-with-nodemailer
    }
  });
  
  const mailOptions = {
    from: 'haiboss2005@gmail.com',
    to: email,
    subject: subject,
    text: text
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
   console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      // do something useful
    }
  });
}