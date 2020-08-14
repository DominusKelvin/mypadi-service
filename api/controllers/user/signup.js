module.exports = {
  friendlyName: "Signup",

  description: "Signup user.",

  // 1st step: declare values you are expecting from the client
  inputs: {
    fullName: {
      type: "string",
      required: true,
    },
    emailAddress: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
    },
    password: {
      type: "string",
      required: true,
      maxLength: 15,
      minLength: 6,
    },
  },

  exits: {
    success: {
      statusCode: 201,
      description: "New myPadi user created",
    },
    invalid: {
      // 500
      description: "Something went wrong",
    },
    badRequest: {
      statusCode: 400,
      description: "Email address already in use",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const newEmailAddress = inputs.emailAddress.toLowerCase(); // be always defensive
      const token = await sails.helpers.strings.random("url-friendly");

      let newUser = await User.create({
        id: sails.helpers.getUuid(),
        fullName: inputs.fullName,
        emailAddress: newEmailAddress,
        password: inputs.password,
        emailProofToken: token,
        emailProofTokenExpiresAt:
          Date.now() + sails.config.custom.emailProofTokenTTL,
      }).fetch();

      const confirmLink = `${sails.config.custom.baseUrl}/user/confirm?token=${token}`;

      const email = {
        to: newUser.emailAddress,
        subject: "Confirm Your myPadi account",
        template: "confirm",
        context: {
          name: newUser.fullName.split(" ")[0],
          confirmLink: confirmLink,
        },
      };

      await sails.helpers.sendMail(email);

      return exits.success({
        message: `An account has been created for ${newUser.emailAddress} successfully. Check your email to verify`,
      });
    } catch (error) {
      sails.log.error(error);
      if (error.code == "E_UNIQUE") {
        return exits.badRequest({
          error: "This email address already belongs to a myPadi user",
        });
      }
      return exits.invalid({
        error: `${error.message}, problem creating a new myPadi user`,
      });
    }
  },
};
