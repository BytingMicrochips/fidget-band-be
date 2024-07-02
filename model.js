const { client } = require("./seed");
const { ENV } = require("./connection");

function getGigsData() {
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

function getVideosData() {
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

module.exports = { getGigsData, getVideosData };