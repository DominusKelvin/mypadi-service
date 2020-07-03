// import jsonwebtokens
const jwt = require("jsonwebtoken");

module.exports = {
  friendlyName: "Verify jwt",

  description: "Verify a JWT token.",

  inputs: {
    req: {
      type: "ref",
      friendlyName: "Request",
      description: "A reference to the request object (req)",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
    invalid: {
      description: "Invalid token or no authentication present.",
    },
    invalidAuthFormat: {
      description: "Invalid Authorization format for Bearer",
    },
    noAuthHeaderFound: {},
  },

  fn: async function (inputs, exits) {
    var req = inputs.req;
    var token;
    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length == 2) {
        var scheme = parts[0],
          credentials = parts[1];

        if (/^Bearer$/.test(scheme)) {
          token = credentials;
        }
      } else {
        return exits.invalidAuthFormat({
          error: "Format is supposed to be: Bearer [token]",
        });
      }
    } else if (req.param("token")) {
      token = req.param("token");

      delete req.query.token;
    } else {
      return exits.noAuthHeaderFound({
        error: "No Authorization header found",
      });
    }
    await jwt.verify(token, "mypadi", async (error, payload) => {
      if (error || !payload.sub) return exits.invalid();
      const user = await User.findOne({
        emailAddress: payload.sub,
      });

      if (!user) return exits.invalid();

      // it's a valid JWT
      req.me = user;

      return exits.success(user);
    });
  },
};
