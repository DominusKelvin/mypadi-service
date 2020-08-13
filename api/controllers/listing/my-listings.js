module.exports = {


  friendlyName: 'My listings',


  description: 'Return all the listings of the logged in user',

  inputs: {},


  exits: {
    success: {
      description: "Successful"
    },
    badRequest: {
      description: "Something went wrong"
    },
    noListings: {
      statusCode: 404,
      description: "No listings yet for this user"
    }
  },


  fn: async function (_, exits) {
    try {
      // First get the ID of the current user
      const userId = this.req.me.id;

      //Find all the listings that belongs to this user
      const listings = await Listing.find({ lister: userId })

      //Check if the user has any listings
      if (!listings) {
        return exits.noListings({ message: "You currently have no listings" })
      }
      return exits.success({
        message: "There are all your listings",
        data: listings
      })
    } catch (error) {

    }

  }


};
