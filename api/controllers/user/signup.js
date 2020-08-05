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
      let newUser = await User.create({
        id: sails.helpers.getUuid(),
        fullName: inputs.fullName,
        emailAddress: newEmailAddress,
        password: inputs.password,
      }).fetch();

      // Generate JWT token
      const token = await sails.helpers.generateNewJwtToken(newEmailAddress);

      // If code gets here. Everything was fine.
      this.req.me = newUser;

      return exits.success({
        message: `An account has been created for ${newUser.emailAddress} successfully`,
        data: newUser,
        token,
      });
    } catch (error) {
      sails.log.error(error);
      if (error.code == "E_UNIQUE") {
        return exits.badRequest({
          error: "This email address already belongs to a postman demo service user",
        });
      }
      return exits.invalid({
        error: `${error.message}, problem creating a new postman demo service user`,
      });
    }
  },
};
