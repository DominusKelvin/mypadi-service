module.exports = {
  friendlyName: "Signup",

  description: "Signup user.",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    // All done.
    return this.res.json({ message: "Sign up a user" });
  },
};
