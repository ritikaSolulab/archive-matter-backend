import nodemailer from 'nodemailer';
import config from "../config/config";

class mailHelper {
    transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            // host: 'smtp.gmail.com',
            // port: 465,
            // secure: true,
            // auth: {
            //     user: config.gmail.user,
            //     pass: config.gmail.pass
            // },
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'makenna35@ethereal.email',
                pass: 'EDZ5zsUagU5ArQmQgT'
            }
        });
    }
    mail = async (html: string, sendTo: any, subject: string) => {
        const mailData = {

            from: config.gmail.from,
            to: sendTo,
            subject: subject,
            html: html,

        }
        try {
            const result = await this.transporter.sendMail(mailData);
            console.log('result------------------------------->>>', result)
            return result;
        } catch (error) {
            console.log('err', error)
            return error;

        }
    }
    sendMail = async (notificationType: string, data: any) => {

        switch (notificationType) {
            case 'signup':
                await this.mail(`<html>${data.name} Thank you for signup  </html>`, data.sendTo, 'feedDelivery');
            case 'forgotPasswordOtp':
                await this.mail(`<html>Your Forgotpassword OTP :- ${data.otp}</html>`, data.sendTo, 'feedDelivery');
                break;
            case 'verifyEmail':
                await this.mail(`<html>Your Verify email OTP :- ${data.otp}</html>`, data.sendTo, 'feedDelivery');

        }
    }
}

export default new mailHelper();
