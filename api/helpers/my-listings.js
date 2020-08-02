module.exports = {


  friendlyName: 'My listings',


  description: '',


  inputs: {
    id:{
      type: "string",
      required: true
    },
    name: {
      type: "string",
      required: true
    },
    type:{
      type: "string",
      required: true
    },
    address:{
      type: "string",
      required: true
    },
    rent:{
      type: "string",
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs, exits) {
    try {
      //First get the ID of the logged in user
    let userId = this.req.me.id;

    //Find the particular listing to be updated
    let listing = await Listing.findOne({id: inputs.id})

    //Now check if the listing found above has same lister value as the userId
    if(listing.lister != userId)
    return exits.notAuthorized({
      message: "You are not authorized to make this request",
    })
    } catch (error) {
      
    }
  }


};

