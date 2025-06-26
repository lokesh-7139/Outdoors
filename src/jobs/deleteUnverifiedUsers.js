const User = require('../models/userModel');

module.exports = (agenda) => {
  agenda.define('delete unverified users', async (job, done) => {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

    const users = await User.find({
      isEmailVerified: false,
      createdAt: { $lt: tenDaysAgo },
    });

    for (const user of users) {
      await user.deleteOne();
      // Send Email.
      console.log(`Deleted unverified user: ${user.email}`);
    }

    done();
  });
};
