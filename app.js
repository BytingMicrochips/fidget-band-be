const express = require("express");
const app = express();
const cors = require("cors");
const { returnGigsData, returnVideosData } = require("./controller");

app.use(cors());
app.use(express.json());

app.get("/api/gigs", returnGigsData);
app.get("/api/videos", returnVideosData);
// app.get("/api/store", returnStoreData);

module.exports = { app };
