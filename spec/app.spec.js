process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const chai = require("chai"); //
const { expect } = chai;
const chaiSorted = require("chai-sorted");
const connection = require("../db/connection.js");

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after("after each test disconnect", () => {
    connection.destroy();
  });
  describe("/topics", () => {
    describe("GET", () => {
      it("Status:200 - Returns a successful status code", () => {
        return request(app)
          .get("/api/topics")
          .expect(200);
      });
      it("Returns an array of topic objects and it's properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(response => {
            expect(response.body).to.eql({
              topics: [
                {
                  slug: "mitch",
                  description: "The man, the Mitch, the legend"
                },
                { slug: "cats", description: "Not dogs" },
                { slug: "paper", description: "what books are made of" }
              ]
            });
          });
      });
      it("ERROR - status:404 - returns an error message when a non-existent request is made", () => {
        return request(app)
          .get("/api/tapioca")
          .expect(404)
          .then(response => {
            expect(response.body).to.eql({ msg: "Path not found" });
          });
      });
    });
  });
  describe("/users", () => {
    describe("/:username", () => {
      describe("GET", () => {
        it("Status 200 - Returns the requested user obejct with the correct properties", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(response => {
              expect(response.body).to.eql({
                user: [
                  {
                    username: "butter_bridge",
                    avatar_url:
                      "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                    name: "jonny"
                  }
                ]
              });
            });
        });
        it("ERROR - status: 404 - Returns an error message when a request for a non existent username is made", () => {
          return request(app)
            .get("/api/users/FALSE_name")
            .expect(404)
            .then(response => {
              expect(response.body).to.eql({ msg: "Path not found" });
            });
        });
      });
    });
  });
});
