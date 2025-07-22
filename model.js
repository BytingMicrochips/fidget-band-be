const { client } = require("./seed");
const { ENV } = require("./connection");

const getGigsData = () => {
  let searchQuery = {};
  const db = client.db(`master-folder-${ENV}`);
  const gigsCollection = db.collection("gigs-data");
    return gigsCollection
      .find(searchQuery)
      .sort({date : 1})
      .toArray()
      .then((gigsArray) => {
          return gigsArray;
      });
};

const getSingleGig = (gig_id) => {

  const db = client.db(`master-folder-${ENV}`);
  const gigsCollection = db.collection("gigs-data");
  
  let query = {_id : gig_id}
  
  return gigsCollection
    .find({ _id: gig_id })
    .toArray()
    .then((matchedGig) => {
      return matchedGig;
    // if (!matchedGig) throw { status: 404, msg: "Gig not found" };
    // else return { gig: matchedGig };
  });

}

const getVideosData = () => {
  let searchQuery = {};
  const db = client.db(`master-folder-${ENV}`);
  const videosCollection = db.collection("videos-data");
  return videosCollection
    .find(searchQuery)
    .sort({ date: -1 })
    .toArray()
    .then((videosArray) => {
      return videosArray;
    });
};

const getStoreData = () => {
  // let searchQuery = {};
  const db = client.db(`master-folder-${ENV}`);
  const storeCollection = db.collection("store-data");
  return storeCollection
    .find({})
    .sort({ dateAdded: -1 })
    .toArray()
    .then((storeArray) => {
      return storeArray;
    });
}

const handleStock = async (updateResquest) => {
  console.log("-------------------- INSIDE MODEL ----------------")
  const db = client.db(`master-folder-${ENV}`);
  const storeCollection = db.collection("store-data");

    let updateId = updateResquest.item;
    const fetchToUpdate = (await storeCollection.find({ _id: updateId }).toArray())
    let updatedStock
    if (fetchToUpdate[0].stockAmount - updateResquest.amountPurchased >= 0) {
      updatedStock = fetchToUpdate[0].stockAmount - updateResquest.amountPurchased
    } else {
      return Promise.reject({status : 400, msg: "Bad request, order made is greater than stock levels"})
    }
      return storeCollection
        .findOneAndUpdate(
          { _id: updateId },
          { $set: { stockAmount: 4 } }
        )
        .then((msg) => {
          return msg;
        })
        .catch((err) => {
          return err;
        });
}
module.exports = {
  getGigsData,
  getVideosData,
  getStoreData,
  handleStock,
  getSingleGig
};