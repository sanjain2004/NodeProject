var mailer = require("nodemailer");

var EmailService = {}

// Use Smtp Protocol to send Email

 var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL, 
                  // you can try with TLS, but port is then 587
    auth: {
      user: '', // Your email id
      pass: '' // Your password
    }
};

var transporter = mailer.createTransport(smtpConfig); 
// var smtpTransport = mailer.createTransport("SMTP",{
//     service: "Gmail",
//     auth: {
//         user: "sanjain2004@gmail.com",
//         pass: "S@myak0922"
//     }
// });


EmailService.sendMail = function(from, fromEmail, to, toEmail, subject, text) {

    var mail = {}
    mail.from = from + " <" + fromEmail + ">";
    mail.to = to + " <" + toEmail + ">";
    mail.subject = subject;
    mail.text = text;
    mail.html = "<b>" + text + "</b>";

    transporter.sendMail(mail, function(error, response) {
        if(error) {
            console.log(error);
        }
        else {
            console.log("Message sent: " + response.message);
        }
    
        transporter.close();        
    });
}

module.exports = EmailService;
