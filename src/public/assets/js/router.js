const { Router } = require('express');
const nodemailer = require('nodemailer');
const router = Router();

router.post('/send-email', async (req, res) => {

    const {name, email, subject, message} = req.body;
    contentHTML = `
    <h1>User Information</h1>
    <ul>
        <li>Username: ${name}</li>
        <li>User Email: ${email}</li>
        <li>Asunto: ${subject}</li>
    </ul>
    <p>${message}</p>
`;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: 'hellovirtuos@gmail.com',
      pass: 'codingatthedisco'
  },
  tls: {
      rejectUnauthorized: false
  }
});
let info = await transporter.sendMail({
  from: 'hellovirtuos@gmail.com',
  to: 'hellovirtuos@gmail.com',
  subject: 'Website Contact Form',
  html: contentHTML
});
console.log('Message sent: %s', info.messageId);

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    res.redirect('/ContactUs.html');
});


module.exports = router;