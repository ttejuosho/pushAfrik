require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();
const PORT = process.env.PORT || 3000;

// Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/sendEmail", (req, res) => {
  const output = `
    <h3>Message Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.aol.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "ttejuosho@aol.com", // user
      pass: process.env.EMAIL_PASSWORD, // password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Push Afrik" <ttejuosho@aol.com>', // sender address
    to: "ttejuosho@aol.com", // list of receivers
    subject: "PushAfrik Contact Form Message", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("error : " + JSON.stringify(error));
    }
    console.log("Message ID: %s", info.messageId);
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // console.log("info : " + JSON.stringify(info));
    console.log("From : " + info.envelope.from);
    console.log("To : " + info.envelope.to);
    console.log("Accepted : " + info.accepted);
    console.log("Response : " + info.response);
    console.log("Message Time : " + info.messageTime);
    console.log("Message Size : " + info.messageSize);

    setTimeout(function () {
      res.sendFile(path.join(__dirname, "index.html"));
    }, 3000);
  });
});

app.listen(PORT, () => console.log("Server started..."));
