const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();

const port = 3000;

require('dotenv').config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });
try{
  const accessToken = await oauth2Client.getAccessToken();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken:accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    },
   
  });

  return transporter;
}catch(error){
  console.log(error)
  return error;
}
 
};

const sendEmail = async (emailOptions) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};


//Middle Word
app.use(express.static(__dirname + "/"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

router.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname + "/html/about.html"));
});
router.get("/contact", function (req, res) {
  res.sendFile(path.join(__dirname + "/html/contact.html"));
});
router.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname + "/html/login.html"));
});
router.get("/home", function (req, res) {
  res.sendFile(path.join(__dirname + "/html/landing.html"));
});
router.get("/home-page", function (req, res) {
  res.redirect('/html/landing.html');
});
router.post("/contact-page", function (req, res) {
  res.redirect('/html/contact.html');
});
router.post("/login-page", function (req, res) {
  res.redirect('/html/login.html');
});
router.post("/about-page", function (req, res) {
  res.redirect('/html/about.html');
});
router.post("/home-page", function (req, res) {
  res.redirect('/html/landing.html');
});
router.post("/send-mail", function (req, res) {
  let message = `Phone: ${req.body.telephone}\n Name: ${req.body.name}\n  Email: ${req.body.email}\n${req.body.message}`
  console.log(req.body.name);
  console.log(process.env.EMAIL);
  sendEmail({
    subject: req.body.subject,
    text: message,
    to: "rafael.e.salgado109@gmail.com",
    from: process.env.EMAIL
  });

  res.sendStatus(200)
});

app.use("/", router);
app.listen(port, () => {
  console.log("Servidor en el puerto", port);
});

