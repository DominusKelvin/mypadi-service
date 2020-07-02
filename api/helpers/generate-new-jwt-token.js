module.exports = {
  friendlyName: "Generate new jwt token",

  description: "",

  inputs: {
    subject: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    const payload = {
      sub: inputs.subject,
      iss: "MyPadi Backend",
    };
    const token = sails.helpers.issueJwt.with({
      payload,
    });
    return token;
  },
};
