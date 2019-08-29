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
      describe("ERRORS", () => {
        it("Status:404 - returns an error message when a non-existent request is made", () => {
          return request(app)
            .get("/api/tapioca")
            .expect(404)
            .then(response => {
              expect(response.body).to.eql({ msg: "Path not found" });
            });
        });
      });
    });
  });
  describe("/users", () => {
    describe("/:username", () => {
      describe("GET", () => {
        it("Status: 200 - Returns the requested user obejct with the correct properties", () => {
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
        describe("ERRORS", () => {
          it("Status: 404 - Returns an error message when a request for a non existent username is made", () => {
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
  describe("/articles", () => {
    describe("/:article_id", () => {
      describe("GET", () => {
        it("Status: 200 - Returns the requested article object with the correct properties", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(response => {
              expect(response.body).to.eql({
                article: [
                  {
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    body: "I find this existence challenging",
                    votes: 100,
                    topic: "mitch",
                    author: "butter_bridge",
                    created_at: "2018-11-15T12:21:54.171Z",
                    comment_count: "13"
                  }
                ]
              });
              expect(response.body.article[0]).to.have.all.keys([
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              ]);
            });
        });
        describe("ERRORS", () => {
          it("Status: 404 - Returns an error message when a request for a non existent article is made", () => {
            return request(app)
              .get("/api/articles/8767")
              .expect(404)
              .then(response => {
                expect(response.body).to.eql({ msg: "Path not found" });
              });
          });
          it("Status: 400 - Returns an error message when an invalid parameter is provided", () => {
            return request(app)
              .get("/api/articles/apples")
              .expect(400)
              .then(response => {
                expect(response.body).to.eql({
                  msg: "Bad Request"
                });
              });
          });
        });
      });
      describe("PATCH", () => {
        it("Status: 200 - Returns the newly updated article, with the vote incremented as requested ", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(response => {
              expect(response.body).to.eql({
                patchedArticle: [
                  {
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    body: "I find this existence challenging",
                    votes: 101,
                    topic: "mitch",
                    author: "butter_bridge",
                    created_at: "2018-11-15T12:21:54.171Z"
                  }
                ]
              });
            });
        });
        it("Status: 200 - Returns the newly updated article, with the vote decremented as requested ", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -100 })
            .expect(200)
            .then(response => {
              expect(response.body).to.eql({
                patchedArticle: [
                  {
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    body: "I find this existence challenging",
                    votes: 0,
                    topic: "mitch",
                    author: "butter_bridge",
                    created_at: "2018-11-15T12:21:54.171Z"
                  }
                ]
              });
            });
        });
        describe("ERRORS", () => {
          it("Status: 404 - Returns an error message when a patch request for a non existent article is made", () => {
            return request(app)
              .patch("/api/articles/10000")
              .send({ inc_votes: -100 })
              .expect(404)
              .then(response => {
                expect(response.body).to.eql({ msg: "Path not found" });
              });
          });
          it("Status: 400 - Returns an error message when an invalid parameter is provided", () => {
            return request(app)
              .patch("/api/articles/apples")
              .send({ inc_votes: -100 })
              .expect(400)
              .then(response => {
                expect(response.body).to.eql({
                  msg: "Bad Request"
                });
              });
          });
          it("Status: 400 - Returns an error message when an no input is provided", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({})
              .expect(400)
              .then(response => {
                expect(response.body).to.eql({
                  msg: "Bad Request"
                });
              });
          });
          it("Status: 400 - Returns an error message when an invalid typeof input is provided", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: "cat" })
              .expect(400)
              .then(response => {
                expect(response.body).to.eql({
                  msg: "Bad Request"
                });
              });
          });
          it("Status: 400 - Returns an error message when an additional property is added to the request body", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: "cat", name: "Smitch" })
              .expect(400)
              .then(response => {
                expect(response.body).to.eql({
                  msg: "Bad Request"
                });
              });
          });
        });
      });
    });
  });
});
