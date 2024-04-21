import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password'
    }
});

function sendErrorNotification(message: any) {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'team-email@example.com',
        subject: 'Frontend Error Notification',
        text: `Message from ActivityLogger: ${JSON.stringify(message)}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Error sending email', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}