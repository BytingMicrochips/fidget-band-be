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

module.exports = { getGigsData, getVideosData, getStoreData };