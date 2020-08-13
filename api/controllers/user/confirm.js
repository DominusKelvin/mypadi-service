module.exports = {


  friendlyName: 'Confirm',


  description: 'Confirm user.',


  inputs: {
    token: {
      description: "The confirmation token from the email.",
      example: "4-32fad81jdaf$329",
    },
  },


  exits: {
    success: {
      description: "Email address confirmed and requesting user logged in.",
    },

    invalidOrExpiredToken: {
      statusCode: 400,
      description:
        "The provided token is expired, invalid, or already used up.",
    },

    emailAddressNoLongerAvailable: {
      statusCode: 409,
      description: "The email address is no longer available.",
      extendedDescription:
        "This is an edge case that is not always anticipated by websites and APIs.  Since it is pretty rare, the 500 server error page is used as a simple catch-all.  If this becomes important in the future, this could easily be expanded into a custom error page or resolution flow.  But for context: this behavior of showing the 500 server error page mimics how popular apps like Slack behave under the same circumstances.",
    },
  },


  fn: async function (inputs, exits) {
    // If no token was provided, this is automatically invalid.
    if (!inputs.token) {
      return exits.invalidOrExpiredToken({
        error: "The provided token is expired, invalid, or already used up.",
      });
    }

    // Get the user with the matching email token.
    var user = await User.findOne({ emailProofToken: inputs.token });

    // If no such user exists, or their token is expired, bail.
    if (!user || user.emailProofTokenExpiresAt <= Date.now()) {
      return exits.invalidOrExpiredToken({
        error: "The provided token is expired, invalid, or already used up.",
      });
    }

    if (user.emailStatus === "unconfirmed") {
      // If this is a new user confirming their email for the first time,
      // then just update the state of their user record in the database,
      // store their user id in the session (just in case they aren't logged
      // in already), and then redirect them to the "email confirmed" page.
      await User.updateOne({ id: user.id }).set({
        emailStatus: "confirmed",
        emailProofToken: "",
        emailProofTokenExpiresAt: 0,
      });
      sails.log(user);
      return exits.success({
        message: "Great! your Mypadi account has been confirmed. You can now log in.",
      });
    } else if (user.emailStatus === "change-requested") {
      if (!user.emailChangeCandidate) {
        throw new Error(
          `Consistency violation: Could not update user email because this user record's emailChangeCandidate ("${user.emailChangeCandidate}") is missing.  (This should never happen.)`
        );
      }

      // Last line of defense: since email change candidates are not protected
      // by a uniqueness constraint in the database, it's important that we make
      // sure no one else managed to grab this email in the mean time since we
      // last checked its availability. (This is a relatively rare edge case--
      // see exit description.)
      if ((await User.count({ emailAddress: user.emailChangeCandidate })) > 0) {
        return exits.emailAlreadyInUse({
          error: "The email address is no longer available",
        });
      }

      // Finally update the user in the database, store their id in the session
      // (just in case they aren't logged in already), then redirect them to
      // their "my account" page so they can see their updated email address.
      await User.updateOne({ id: user.id }).set({
        emailStatus: "confirmed",
        emailProofToken: "",
        emailProofTokenExpiresAt: 0,
        emailAddress: user.emailChangeCandidate,
        emailChangeCandidate: "",
      });
      return exits.success({
        message: "Email updated successfully",
      });
    } else {
      throw new Error(
        `Consistency violation: User ${user.id} has an email proof token, but somehow also has an emailStatus of "${user.emailStatus}"!  (This should never happen.)`
      );
    }
  }


};
