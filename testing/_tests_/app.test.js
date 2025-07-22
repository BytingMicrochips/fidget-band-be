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


describe("GET /api/gigs", () => {
  test("200: should return status 200 on successful access", () => {
    return request(app).get("/api/gigs").expect(200);
  });
  test("200: should return every gig in the database collection", () => {
    return request(app)
      .get("/api/gigs")
      .then(({ body }) => {
        console.log(body)
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

describe("GET /api/videos", () => {
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

describe("PATCH: /api/store", () => {
  test("200: should return 200 on successful access", () => {
    return request(app)
      .patch("/api/store")
      .send({ item: "66847b7e37b60869867b1918", amountPurchased: 1 })
      .expect(200);
  });
  test("200: correct item should have stock level decreased when purchased", async () => {
    await request(app)
      .patch("/api/store")
      .send({ item: "66847b7e37b60869867b1918", amountPurchased: 1 })
      .expect(200);
    return request(app)
      .get("/api/store")
      .then(({ body }) => {
        const result = body.find(
          ({ _id }) => _id === "66847b7e37b60869867b1918"
        );
        expect(result.stockAmount).toBe(4);
      });
  });
  test("200: correct item should have stock level decreased when purchasing multiples", async () => {
    await request(app)
      .patch("/api/store")
      .send({ item: "66847b7e37b60869867b191a", amountPurchased: 4 })
      .expect(200);
    return request(app)
      .get("/api/store")
      .then(({ body }) => {
        const result = body.find(
          ({ _id }) => _id === "66847b7e37b60869867b191a"
        );
        expect(result.stockAmount).toBe(4);
      });
  });
  test("400: user can not order more than the stockAmount", async () => {
    await request(app)
      .patch("/api/store")
      .send({ item: "66847b7e37b60869867b1918", amountPurchased: 99 })
      .expect(400);
    return request(app)
      .get("/api/store")
      .then(({ body }) => {
        const result = body.find(
          ({ _id }) => _id === "66847b7e37b60869867b1918"
        );
        expect(result.stockAmount).toBe(5);
      });
  });
});

describe.only("GET /api/gigs/:gig_id", () => {
  test("200: Should return status 200 on succesful retrieval by gig_id", () => {
    return request(app)
      .get("/api/gigs/668435b72b9b6cbf8433e2yz")
      .expect(200);
  });
  test("200: Should return gig matching correct gig_id paramater", () => {
    return request(app)
      .get("/api/gigs/668435b72b9b6cbf8433e2yz")
      .then(({ body }) => {
        expect(body.gig[0]._id).toBe("668435b72b9b6cbf8433e2yz")
      });
  });
  test("400: Should return status 400 if gig_id is not 24 characters long", () => {
    return request(app)
      .get("/api/gigs/banana")
      .expect(400)
      .then((msg) => {
        expect(JSON.parse(msg.text)).toBe("Bad request, gig id parameter is invalid");
      });
  })
});