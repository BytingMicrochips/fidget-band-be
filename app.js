const express = require("express");
const app = express();
const cors = require("cors");
const {
  returnGigsData,
  returnVideosData,
  returnStoreData, 
  updateStockAmount,
  returnSingleGig,
} = require("./controller");

app.use(cors());
app.use(express.json());

app.get("/api/gigs", returnGigsData);
app.get("/api/gigs/:gig_id", returnSingleGig);
app.get("/api/videos", returnVideosData);
app.get("/api/store", returnStoreData);
app.patch("/api/store/", updateStockAmount);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: err });
});

module.exports = { app };
