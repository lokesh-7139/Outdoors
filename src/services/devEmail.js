const nodemailer = require('nodemailer');

module.exports = class devEmail {
  constructor(user) {
    this.user = user;
    this.firstName = user.name.split(' ')[0];

    this.to = user.email;
    this.from = `Lokesh <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject, text) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    const subject = '';
    const text = '';

    await this.send(subject, text);
  }
};
