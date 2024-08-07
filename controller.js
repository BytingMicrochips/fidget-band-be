const {
  getGigsData,
  getVideosData,
  getStoreData,
  handleStock,
} = require("./model");

const returnGigsData = (req, res) => {
  getGigsData()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(error.status).json(error.msg);
    });
};

const returnVideosData = (req, res) => {
  getVideosData()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(error.status).json(error.msg);
    });
};

const returnStoreData = (req, res) => {
  getStoreData()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(error.status).json(error.msg);
    });
}

const updateStockAmount = (req, res) => {
  handleStock(req.body)
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((error) => {
      res.status(error.status).json(error.msg);
  })
}

module.exports = {
  returnGigsData,
  returnVideosData,
  returnStoreData,
  updateStockAmount,
};
