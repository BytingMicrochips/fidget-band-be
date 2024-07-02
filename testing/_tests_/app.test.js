const { app } = require("../../app");
const { server } = require("../../listen");
const request = require("supertest");
const { testSeed, closeConnection } = require("../../seed");
const { gigsData } = require("../_data_/gigs-data");
const { videosData } = require("../_data_/videos-data");
const { storeData } = require("../_data_/store-data");

beforeEach(async () => {
  await testSeed({
    gigsData,
    videosData,
    storeData
  });
});

afterAll(() => {
  closeConnection();
  server.close();
});


xdescribe("GET /api/gigs", () => {
  test("200: should return status 200 on successful access", () => {
    return request(app).get("/api/gigs").expect(200);
  });
  test("200: should return every gig in the database collection", () => {
    return request(app)
      .get("/api/gigs")
      .then(({ body }) => {
        expect(body.length).toBe(gigsData.length)
      })
  });
  test("200: Should return an object with expected gigs data structure", () => {
    return request(app)
      .get("/api/gigs")
      .then(({ body }) => {
        body.forEach((gig) => {
          expect(Object.keys(gig)).toStrictEqual(["_id","location", "venue", "date", "time", "title", "description", "ticketLink", "flier"])
        })
      });
  });
  test("200: data is returned in order of which gig is soonest", () => {
    return request(app)
      .get("/api/gigs")
      .then(({ body }) => {
        expect(body).toBeSortedBy("date", { descending: false })
      })
  })
});

xdescribe("GET /api/videos", () => {
  test("200: should return status 200 on successful access", () => {
    return request(app).get("/api/videos").expect(200);
  });
  test("200: should return every video in the database collection", () => {
    return request(app)
      .get("/api/videos")
      .then(({ body }) => {
        expect(body.length).toBe(videosData.length);
      });
  });
  test("200: should return an object with expected videos data structure", () => {
    return request(app)
      .get("/api/videos")
      .then(({ body }) => {
        body.forEach((video) => {
          expect(Object.keys(video)).toStrictEqual(["_id", "source", "title", "date"]);
        })
      });
  });
  test("200: data is returned in order of which video is most recent", () => {
      return request(app)
        .get("/api/videos")
        .then(({ body }) => {
          expect(body).toBeSortedBy("date", { descending: true });
        });
  });
});

describe("GET /api/store", () => {
  test("200: should return status 200 on successful access", () => {
    return request(app).get("/api/store").expect(200);
  });
  test("200: should return every item in the store database collection", () => {
    return request(app)
      .get("/api/store")
      .then(({ body }) => {
        expect(body.length).toBe(storeData.length);
      });
  });
  test("200: should return an object with expected videos data structure", () => {
    return request(app)
      .get("/api/store")
      .then(({ body }) => {
        body.forEach((item) => {
          expect(Object.keys(item)).toStrictEqual([
            "_id", "img", "title", "tags", "price", "stockAmount", "dateAdded"
          ]); 
        });
      });
  });
  test("200: data is returned so newly listed items are first", () => {
    return request(app)
      .get("/api/store")
      .then(({ body }) => {
        expect(body).toBeSortedBy("dateAdded", { descending: true });
      });
  });
});