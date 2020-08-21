module.exports = {
  friendlyName: 'Reset password',

  description:
    'Finish the password recovery flow by setting the new password and ' +
    'logging in the requesting user, based on the authenticity of their token.',

  inputs: {
    password: {
      description: 'The new, unencrypted password.',
      example: 'abc123v2',
      required: true,
    },

    token: {
      description:
        'The password token that was generated by the `sendPasswordRecoveryEmail` endpoint.',
      example: 'gwa8gs8hgw9h2g9hg29hgwh9asdgh9q34$$$$$asdgasdggds',
      required: true,
    },
  },

  exits: {
    success: {
      description:
        'Password successfully updated, and requesting user agent is now logged in.',
    },

    invalidToken: {
      statusCode: 401,
      description:
        'The provided password token is invalid, expired, or has already been used.',
    },
  },

  fn: async function (inputs, exits) {
    if (!inputs.token) {
      return exits.invalidToken({
        error: 'Your reset token is either invalid or expired',
      });
    }

    // Look up the user with this reset token.
    var user = await User.findOne({ passwordResetToken: inputs.token });

    // If no such user exists, or their token is expired, bail.
    if (!user || user.passwordResetTokenExpiresAt <= Date.now()) {
      return exits.invalidToken({
        error: 'Your reset token is either invalid or expired',
      });
    }

    const hashedPassword = await sails.helpers.passwords.hashPassword(
      inputs.password
    );
    // Store the user's new password and clear their reset token so it can't be used again.
    await User.updateOne({ id: user.id }).set({
      password: hashedPassword,
      passwordResetToken: '',
      passwordResetTokenExpiresAt: 0,
    });


    const token = await sails.helpers.generateNewJwtToken(user.emailAddress);

    this.req.user = user;

    return exits.success({
      message: `Password reset successful. ${user.emailAddress} has been logged in to myPadi`,
      data: user,
      token,
    });
  },
};