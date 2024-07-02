const express = require("express");
const app = express();
const cors = require("cors");
const { returnGigsData, returnVideosData, returnStoreData } = require("./controller");

app.use(cors());
app.use(express.json());

app.get("/api/gigs", returnGigsData);
app.get("/api/videos", returnVideosData);
app.get("/api/store", returnStoreData);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: err });
});

module.exports = { app };
