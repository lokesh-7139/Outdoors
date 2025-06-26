const sgMail = require('@sendgrid/mail');

module.exports = class prodEmail {
  constructor(user) {
    this.user = user;
    this.firstName = user.name.split(' ')[0];

    this.to = user.email;
    this.from = `Lokesh <${process.env.EMAIL_FROM}>`;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async send(templateId, dynamicData = {}) {
    const msg = {
      to: this.to,
      from: this.from,
      templateId,
      dynamic_template_data: {
        firstName: this.firstName,
        ...dynamicData,
      },
    };

    await sgMail.send(msg);
  }

  async sendWelcome(data) {
    await this.send(process.env.SENDGRID_WELCOME_TEMPLATE_ID, data);
  }

  async sendPasswordReset(data) {
    await this.send(process.env.SENDGRID_PASSWORD_RESET_TEMPLATE_ID, data);
  }

  async sendVerificationEmail(data) {
    await this.send(process.env.SENDGRID_EMAIL_VERIFICATION_TEMPLATE_ID, data);
  }

  async sendDeletionDueToAbuseNotice() {
    const mainContent = '';

    await this.send(process.env.SENDGRID_ACC_DELETION_TEMPLATE_ID, {
      mainContent,
    });
  }

  async sendDeletionDueToInactiveNotice() {
    const mainContent = '';

    await this.send(process.env.SENDGRID_ACC_DELETION_TEMPLATE_ID, {
      mainContent,
    });
  }
};
