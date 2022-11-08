const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this._transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.POJ_GMAIL_ID,
                pass: process.env.POJ_GMAIL_PASS
            }
        });
        this._sender = process.env.POJ_GMAIL_ID;
    }

    async sendEmail(recipient, subject, message) {
        const mailOptions = {
            from: this._sender,
            to: recipient,
            subject: subject,
            text: message
        };
        await this.send(mailOptions);
    }

    async sendVerificationCode(recipient, code) {
        const mailOptions = {
            from: this._sender,
            to: recipient,
            subject: "Verification Code",
            html: `<p>For Your Email Verification Use Code : <b>${code.toString()}</b></p>`,
        };
        await this.send(mailOptions);
    }

    async send(mailOptions) {
        await this._transporter.sendMail(mailOptions, (err, message) => {
            if (err) console.error(err)
            else console.log(`(Success) Message Sent to ${message.envelope.to}`)
        });
    }
}

const mailServiceObject = new MailService();

module.exports = mailServiceObject;