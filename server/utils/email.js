const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    }
});

const sendVerification = async (email, token) => {
    try {
        const verificationLink = `http://localhost:3001/api/v1/auth/verify/${token}`;
    
        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'Email verification',
            text: `Click the following link to verify your email: ${verificationLink}`,
        };
    
        const info = await transporter.sendMail(mailOptions);
        console.log('Send mail successfully:', info);
    } catch (error) {
        console.error('Error sending email:', error);
    };
};

module.exports = { sendVerification };