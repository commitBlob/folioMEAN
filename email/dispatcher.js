const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS
  }
});

exports.sendEmail = (mailHeaders) => {
  transporter.sendMail(mailHeaders, (error, info) => {
    if (error) {
      console.log('----------------  ERROR  ----------------');
      console.log(error);
      console.log('-----------------------------------------');
    } else {
      console.log('---------------  SUCCESS  ---------------');
      console.log('Email sent: ' + info.response);
      console.log('-----------------------------------------');
    }
  });
};
