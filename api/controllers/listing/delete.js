module.exports = {


  friendlyName: 'Delete',


  description: 'Delete a listing.',


  inputs: {
    id:{
      type: "string"
    }
  },


  exits: {
    success:{
      description: "Successfully deleted"
    },
    invalidRequest:{
      description: "Invalid request"
    },
    unauthorized:{
      description: "Not authorized"
    }
  },


  fn: async function (inputs, exits) {
    try {
      // //First get the ID of the current login user
      // const userId = this.req.me.id;

      // //Find the property to be deleted
      // let listing = await Listing.findOne({id: inputs.id});
      
      // //Now check if this listing belongs to this user
      // if(listing.lister != userId){
      //   return exits.unauthorized({message: "You can\'t be serious. This is not your listing man. Joke intended"})
      // }

      //Else delete the listing
      const listingToBeDeleted = await Listing.destroy({id: inputs.id});
      return exits.success({
        message: "Listing successfully deleted"
      })
      
    } catch (error) {
      
    }
  }
};
