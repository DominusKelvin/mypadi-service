module.exports = {
  friendlyName: "Signin",

  description: "Signin user.",

  inputs: {
    emailAddress: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "New muna log in",
    },
    notAMypadiUser: {
      statusCode: 404,
      description: "User not found",
    },
    passwordMismatch: {
      statusCode: 401,
      description: "Password do not match",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const user = await User.findOne({ emailAddress: inputs.emailAddress });

      if (!user)
        return exits.notAMypadiUser({
          error: `User with this email(${inputs.emailAddress}) does not exist`,
        });

      await sails.helpers.passwords
        .checkPassword(inputs.password, user.password)
        .intercept("incorrect", (error) => {
          exits.passwordMismatch({ error: error.message });
        });

      const token = await sails.helpers.generateNewJwtToken(user.emailAddress);

      this.req.me = user;

      return exits.success({
        message: `${user.emailAddress} has been logged in to postman demo service`,
        data: user,
        token,
      });
    } catch (error) {
      sails.log.error(error);
    }
  },
};
