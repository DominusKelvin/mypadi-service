module.exports = {
  friendlyName: 'Send password recovery email',

  description:
    'Send a password recovery notification to the user with the specified email address.',

  inputs: {
    emailAddress: {
      description:
        'The email address of the alleged user who wants to recover their password.',
      example: 'rydahl@example.com',
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      description:
        'The email address might have matched a user in the database.  (If so, a recovery email was sent.)',
    },
  },

  fn: async function (inputs, exits) {
    // All done.

    // Find the record for this user.
    // (Even if no such user exists, pretend it worked to discourage sniffing.)
    var user = await User.findOne({ emailAddress: inputs.emailAddress });
    if (!user) {
      return;
    }

    // Come up with a pseudorandom, probabilistically-unique token for use
    // in our password recovery email.
    const token = await sails.helpers.strings.random('url-friendly');

    // Store the token on the user record
    // (This allows us to look up the user when the link from the email is clicked.)
    await User.update({ id: user.id }).set({
      passwordResetToken: token,
      passwordResetTokenExpiresAt:
        Date.now() + sails.config.custom.passwordResetTokenTTL,
    });
    const recoveryLink = `${sails.config.custom.baseUrl}/reset-password?token=${token}`;
    const email = {
      to: user.emailAddress,
      subject: 'Let\'s help you get back into myPadi',
      template: 'forgot-password',
      context: {
        name: user.fullName.split(' ')[0],
        recoverLink: recoveryLink,
      },
    };
    sails.log({
      recoveryLink,
    });
    try {
      await sails.helpers.sendMail(email);
    } catch (error) {
      sails.log(error);
    }
    sails.log(user);
    return exits.success({
      message: `A reset password email has been sent to ${user.emailAddress}.`,
    });
  },
};
