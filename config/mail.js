import { SMTP_PASS, SMTP_USER } from '../config/env.js';
import nodemailer from 'nodemailer';


// send token for verification using nodemailer

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

// send the mail
export const sendOtpEmail = async (email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: SMTP_USER, // sender address
            to: email, // list of receivers
            subject: "OTP MESSAGE", // Subject line
            text: `Verify your account with this OTP:${otp}`,  // plain text body
            html: `<div style="font-family: Arial, sans-serif; color: #222; background: #f9f9f9; padding: 24px; border-radius: 8px;">
  <h2 style="color:rgb(209, 34, 43);">Your One-Time Password (OTP)</h2>
  <p style="font-size: 18px;">
    <b style="font-size: 28px; letter-spacing: 4px;">${otp}</b>
  </p>
  <p>
    Please use this OTP to complete your verification. <br>
    <span style="color:rgb(20, 19, 19);"><b>This code will expire in 6 minutes.</b></span>
  </p>
  <p style="font-size: 14px; color: #888;">
    If you did not request this, please ignore this email.
  </p>
</div>`, // html body
        });
        // log the mesage id in the console
        console.log("Message sent: %s", info.messageId);

        // preview the generated URL for the email
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail", err);
    }
}