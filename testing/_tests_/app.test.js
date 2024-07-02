const { app } = require("../../app");
const { server } = require("../../listen");
const db = require("../../connection");
const request = require("supertest");
const { testSeed, closeConnection } = require("../../seed");
const { gigsData } = require("../_data_/gigs-data");
const { videosData } = require("../_data_/videos-data");

beforeEach(async () => {
  await testSeed({ gigsData, videosData });
});

afterAll(() => {
  closeConnection();
  server.close();
});


describe("GET /api/gigs", () => {
  test("200: Should return status 200 on successful access", () => {
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
  test("200: Data is returned in order of which gig is soonest", () => {
    return request(app)
      .get("/api/gigs")
      .then(({ body }) => {
        expect(body).toBeSortedBy("date", { descending: false })
      })
  })
});

describe("GET /api/videos", () => {
  test("200: Should return status 200 on successful access", () => {
    return request(app).get("/api/videos").expect(200);
  });
  test("200: should return every video in the database collection", () => {
    return request(app)
      .get("/api/videos")
      .then(({ body }) => {
        expect(body.length).toBe(videosData.length);
      });
  });
  test("200: Should return an object with expected videos data structure", () => {
    return request(app)
      .get("/api/videos")
      .then(({ body }) => {
        body.forEach((video) => {
          expect(Object.keys(video)).toStrictEqual(["_id", "source", "title", "date"]);
        })
      });
  });
    test("200: Data is returned in order of which video is most recent", () => {
      return request(app)
        .get("/api/videos")
        .then(({ body }) => {
          expect(body).toBeSortedBy("date", { descending: true });
        });
    });
});