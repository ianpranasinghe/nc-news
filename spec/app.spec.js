process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const chai = require("chai"); //
const { expect } = chai;
chai.use(require("chai-sorted"));
const connection = require("../db/connection.js");

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after("after each test disconnect", () => {
    connection.destroy();
  });
  describe("ERRORS", () => {
    it("Status: 405 - Returns an error when an incorrect method is attempted", () => {
      const invalidMethods = ["get", "patch", "put", "post", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api")
          .expect(405)
          .then(response => {
            expect(response.body).to.eql({ msg: "method not allowed" });
          });
      });
      return Promise.all(methodPromises);
    });
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
              expect(response.body).to.eql({ msg: "Not Found" });
            });
        });
      });
    });
    describe("ERRORS", () => {
      it("Status: 405 - Returns an error when an incorrect method is attempted", () => {
        const invalidMethods = ["patch", "put", "post", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then(response => {
              expect(response.body).to.eql({ msg: "method not allowed" });
            });
        });
        return Promise.all(methodPromises);
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
                user: {
                  username: "butter_bridge",
                  avatar_url:
                    "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                  name: "jonny"
                }
              });
            });
        });
        describe("ERRORS", () => {
          it("Status: 404 - Returns an error message when a request for a non existent username is made", () => {
            return request(app)
              .get("/api/users/FALSE_name")
              .expect(404)
              .then(response => {
                expect(response.body).to.eql({ msg: "Not Found" });
              });
          });
        });
      });
      describe("ERRORS", () => {
        it("Status: 405 - Returns an error when an incorrect method is attempted", () => {
          const invalidMethods = ["patch", "put", "post", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/users/butter_bridge")
              .expect(405)
              .then(response => {
                expect(response.body).to.eql({ msg: "method not allowed" });
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
    describe.only("/users", () => {
      describe("Get", () => {
        it("Status: 200 - Returns the requested user obejct with the correct properties", () => {
          return request(app)
            .get("/api/users")
            .expect(200)
            .then(response => {
              expect(response.body).to.eql({
                users: [
                  {
                    username: "butter_bridge",
                    avatar_url:
                      "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                    name: "jonny"
                  },
                  {
                    username: "icellusedkars",
                    avatar_url:
                      "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
                    name: "sam"
                  },
                  {
                    username: "rogersop",
                    avatar_url:
                      "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
                    name: "paul"
                  },
                  {
                    username: "lurker",
                    avatar_url:
                      "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                    name: "do_nothing"
                  }
                ]
              });
            });
        });
      });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      it("Status: 200 - Returns the requested articles with the correct properties, sorted by default - 'created_at' & ordered by default DESCENDING", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(response => {
            expect(response.body.articles[0]).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z",
              comment_count: "13"
            });
            expect(response.body.articles[0]).to.have.all.keys([
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            ]);
          });
      });
      it("Status:200 - Returns the requested articles with the correct properties, sorted by - 'votes' & ordered by default DESCENDING", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(response => {
            expect(response.body.articles[0]).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z",
              comment_count: "13"
            });
            expect(response.body.articles).to.be.sortedBy("votes", {
              descending: true
            });
            expect(response.body.articles[0]).to.have.all.keys([
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            ]);
          });
      });
      it("Status:200 - Returns the requested articles with the correct properties, ordered by ASCENDING", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(response => {
            expect(response.body.articles[0]).to.eql({
              article_id: 12,
              title: "Moustache",
              body: "Have you seen the size of that thing?",
              votes: 0,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "1974-11-26T12:21:54.171Z",
              comment_count: "0"
            });
            expect(response.body.articles).to.be.sortedBy("created_at");
            expect(response.body.articles[0]).to.have.all.keys([
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            ]);
          });
      });
      it("Status:200 - Returns the requested articles with the correct properties, sorted by - 'votes' & ordered by ASCENDING", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=asc")
          .expect(200)
          .then(response => {
            expect(response.body.articles[0]).to.eql({
              article_id: 11,
              title: "Am I a cat?",
              body:
                "Having run out of ideas for articles, I am staring at " +
                "the wall blankly, like a cat. Does this make me a cat?",
              votes: 0,
              topic: "mitch",
              author: "icellusedkars",
              created_at: "1978-11-25T12:21:54.171Z",
              comment_count: "0"
            });
            expect(response.body.articles).to.be.sortedBy("votes");
            expect(response.body.articles[0]).to.have.all.keys([
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            ]);
          });
      });
      it("Status:200 - Returns the requested articles with the correct properties, filtered by requested 'author'", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(response => {
            response.body.articles.map(article => {
              expect(article.author).to.equal("butter_bridge");
            });
            expect(response.body.articles[0]).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z",
              comment_count: "13"
            });
            expect(response.body.articles).to.be.descending;
            expect(response.body.articles[0]).to.have.all.keys([
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            ]);
          });
      });
      it("Status:200 - Returns an empty array when we request an article for a user that exists but has no article", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(response => {
            expect(response.body).to.eql({ articles: [] });
          });
      });
      it("Status:200 - Returns an empty array when we request an article for a topic that exists but has no article", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(response => {
            expect(response.body).to.eql({ articles: [] });
          });
      });
      it("Status:200 - Returns the requested articles with the correct properties, filtered by requested 'topic'", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(response => {
            response.body.articles.map(article => {
              expect(article.topic).to.equal("mitch");
            });

            expect(response.body.articles[0]).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z",
              comment_count: "13"
            });
            expect(response.body.articles).to.be.descending;
            expect(response.body.articles[0]).to.have.all.keys([
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            ]);
          });
      });
      describe("ERRORS", () => {
        it("STATUS:400 - Returns an error when we try to add a column that doesn't exist to our sort query", () => {
          return request(app)
            .get("/api/articles?sort_by=apples")
            .expect(400)
            .then(response => {
              expect(response.body).to.eql({ msg: "Bad Request" });
            });
        });
        it("STATUS:404 - Returns an error when we try search for an author that does not exist", () => {
          return request(app)
            .get("/api/articles?author=apples")
            .expect(404)
            .then(response => {
              expect(response.body).to.eql({
                msg: "Not Found"
              });
            });
        });

        it("STATUS:400 - Returns an error when we try to order our response with an invalid query", () => {
          return request(app)
            .get("/api/articles?order=apples")
            .expect(400)
            .then(response => {
              expect(response.body).to.eql({ msg: "Bad Request" });
            });
        });
        it("STATUS:404 - Returns an error we search for a topic that has no articles associated with it", () => {
          return request(app)
            .get("/api/articles?author=cats")
            .expect(404)
            .then(response => {
              expect(response.body).to.eql({ msg: "Not Found" });
            });
        });
      });
    });
    describe("ERRORS", () => {
      it("Status: 405 - Returns an error when an incorrect method is attempted", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/articles")
            .expect(405)
            .then(response => {
              expect(response.body).to.eql({ msg: "method not allowed" });
            });
        });
        return Promise.all(methodPromises);
      });
    });

    describe("/:article_id", () => {
      describe("GET", () => {
        it("Status: 200 - Returns the article object, dependant on ID with the correct properties", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(response => {
              expect(response.body).to.eql({
                article: {
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  body: "I find this existence challenging",
                  votes: 100,
                  topic: "mitch",
                  author: "butter_bridge",
                  created_at: "2018-11-15T12:21:54.171Z",
                  comment_count: "13"
                }
              });

              expect(response.body.article).to.have.all.keys([
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
        it("Status: 200 - Returns the article object, dependant on a different ID Specified by Ant's testing, with the correct properties", () => {
          return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then(response => {
              expect(response.body).to.eql({
                article: {
                  article_id: 2,
                  title: "Sony Vaio; or, The Laptop",
                  body:
                    "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                  votes: 0,
                  topic: "mitch",
                  author: "icellusedkars",
                  created_at: "2014-11-16T12:21:54.171Z",
                  comment_count: "0"
                }
              });

              expect(response.body.article).to.have.all.keys([
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
                expect(response.body).to.eql({ msg: "Not Found" });
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
                article: {
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  body: "I find this existence challenging",
                  votes: 101,
                  topic: "mitch",
                  author: "butter_bridge",
                  created_at: "2018-11-15T12:21:54.171Z"
                }
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
                article: {
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  body: "I find this existence challenging",
                  votes: 0,
                  topic: "mitch",
                  author: "butter_bridge",
                  created_at: "2018-11-15T12:21:54.171Z"
                }
              });
            });
        });
        it("Status: 200 - Returns an unchaged article when sent a patch request with no information", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({})
            .expect(200)
            .then(response => {
              expect(response.body).to.eql({
                article: {
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  body: "I find this existence challenging",
                  votes: 100,
                  topic: "mitch",
                  author: "butter_bridge",
                  created_at: "2018-11-15T12:21:54.171Z"
                }
              });
            });
        });
        describe("ERRORS", () => {
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
      describe("/comments", () => {
        describe("POST", () => {
          it("Status: 201 - Returns the new posted comment as requested with the correct keys in the response", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "butter_bridge",
                body:
                  "The aircon has water now, but it is I who comments on this post"
              })
              .expect(201)
              .then(response => {
                expect(response.body.comment).to.have.keys([
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body"
                ]);
              });
          });

          describe("ERRORS", () => {
            it("Status:400 - Returns an error when we try to add a user that doesn't exist", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({
                  username: "Dillon",
                  body:
                    "The aircon has water now, but it is I who comments on this post"
                })
                .expect(404)
                .then(response => {
                  expect(response.body).to.eql({ msg: "User does not exist" });
                });
            });
            it("Status:400 - Returns an error when we try to add a comment without a body", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({
                  username: "Dillon"
                })
                .expect(400)
                .then(response => {
                  expect(response.body).to.eql({ msg: "Bad Request" });
                });
            });
            it("Status:400 - Returns an error when an empty object is posted", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({})
                .expect(400)
                .then(response => {
                  expect(response.body).to.eql({ msg: "Bad Request" });
                });
            });
            it("Status:400 - Returns an error when an invalid post object is sent", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({ rating_out_of_five: 6 })
                .expect(400)
                .then(response => {
                  expect(response.body).to.eql({ msg: "Bad Request" });
                });
            });
          });
        });
        describe("GET", () => {
          it("STATUS: 200 - Gets an array of comments for a given article ID, with the expected properties, sorted by default - 'created_at' & ordered by default - DESCENDING", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(response => {
                response.body.comments.map(comment => {
                  expect(response.body.comments[0]).to.have.keys([
                    "comment_id",
                    "author",
                    "article_id",
                    "votes",
                    "created_at",
                    "body"
                  ]);

                  expect(response.body.comments).to.be.sortedBy("created_at", {
                    descending: true
                  });
                });
              });
          });
          it("STATUS: 200 - Gets an empty array of comments for a given article ID, where no comments exist ", () => {
            return request(app)
              .get("/api/articles/2/comments")
              .expect(200)
              .then(response => {
                expect(response.body).to.eql({ comments: [] });
              });
          });

          it("STATUS: 200 - Gets an array of comments for a given article ID, with the expected properties, sorted by - 'author', ordered by default 'DESCENDING'", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=author")
              .expect(200)
              .then(response => {
                response.body.comments.map(comment => {
                  expect(response.body.comments[0]).to.have.keys([
                    "comment_id",
                    "author",
                    "article_id",
                    "votes",
                    "created_at",
                    "body"
                  ]);

                  expect(response.body.comments).to.be.sortedBy("author", {
                    descending: true
                  });
                });
              });
          });

          it("STATUS: 200 - Gets an array of comments for a given article ID, with the expected properties ordered by 'ASCENDING'", () => {
            return request(app)
              .get("/api/articles/1/comments?order=asc")
              .expect(200)
              .then(response => {
                response.body.comments.map(comment => {
                  expect(response.body.comments[0]).to.have.keys([
                    "comment_id",
                    "author",
                    "article_id",
                    "votes",
                    "created_at",
                    "body"
                  ]);

                  expect(response.body.comments).to.be.sortedBy("created_at");
                });
              });
          });

          it("STATUS: 200 - Gets an array of comments for a given article ID, with the expected properties, sorted by - 'author' in 'ASCENDING'` order", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=author&order=asc")
              .expect(200)
              .then(response => {
                response.body.comments.map(comment => {
                  expect(response.body.comments[0]).to.have.keys([
                    "comment_id",
                    "author",
                    "article_id",
                    "votes",
                    "created_at",
                    "body"
                  ]);

                  expect(response.body.comments).to.be.sortedBy("author");
                });
              });
          });
          describe("ERRORS", () => {
            it("STATUS:400 - Returns an error when we try to add a column that doesn't exist to our sort query", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=apple")
                .expect(400)
                .then(response => {
                  expect(response.body).to.eql({ msg: "Bad Request" });
                });
            });
            it("STATUS:400 - Returns an error when we try to add an invalid query", () => {
              return request(app)
                .get("/api/articles/1/comments?sortwrongby=apple")
                .expect(400)
                .then(response => {
                  expect(response.body).to.eql({ msg: "Bad Request" });
                });
            });
          });
        });
        describe("ERRORS", () => {
          it("Status: 405 - Returns an error when an incorrect method is attempted", () => {
            const invalidMethods = ["patch", "put", "delete"];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]("/api/articles/1/comments")
                .expect(405)
                .then(response => {
                  expect(response.body).to.eql({ msg: "method not allowed" });
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
      describe("ERRORS", () => {
        it("Status: 405 - Returns an error when an incorrect method is attempted", () => {
          const invalidMethods = ["put", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles/1")
              .expect(405)
              .then(response => {
                expect(response.body).to.eql({ msg: "method not allowed" });
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
  describe("/comments", () => {
    describe("/:comment_id", () => {
      describe("PATCH", () => {
        it("Status: 200 - Returns the newly updated comment, with the vote incremented as requested ", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(response => {
              expect(response.body).to.eql({
                comment: {
                  comment_id: 1,
                  author: "butter_bridge",
                  article_id: 9,
                  votes: 17,
                  created_at: "2017-11-22T12:36:03.389Z",
                  body:
                    "Oh, I've got compassion running out of my " +
                    "nose, pal! I'm the Sultan of Sentiment!"
                }
              });
            });
        });
        it("Status: 200 - Returns the newly updated comment, with the vote decremented as requested ", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -100 })
            .expect(200)
            .then(response => {
              expect(response.body).to.eql({
                comment: {
                  comment_id: 1,
                  author: "butter_bridge",
                  article_id: 9,
                  votes: -84,
                  created_at: "2017-11-22T12:36:03.389Z",
                  body:
                    "Oh, I've got compassion running out of my " +
                    "nose, pal! I'm the Sultan of Sentiment!"
                }
              });
            });
        });
        describe("ERRORS", () => {
          it("Status: 404 - Returns an error message when a patch request for a non existent comment is made", () => {
            return request(app)
              .patch("/api/comments/10000")
              .send({ inc_votes: -100 })
              .expect(404)
              .then(response => {
                expect(response.body).to.eql({ msg: "Not Found" });
              });
          });
          it("Status: 400 - Returns an error message when an invalid parameter is provided", () => {
            return request(app)
              .patch("/api/comments/apples")
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
              .patch("/api/comments/1")
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
              .patch("/api/comments/1")
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
              .patch("/api/comments/1")
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
      describe("DELETE", () => {
        it("STATUS:204 - Returns empty object after deleting the requested comment", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then(response => {
              expect(response.body).to.eql({});
            });
        });
        describe("ERRORS", () => {
          it("STATUS: 404 - Returns error message when a valid comment_id is passed but does not exist", () => {
            return request(app)
              .delete("/api/comments/100000")
              .expect(404)
              .then(response => {
                expect(response.body).to.eql({ msg: "Comment does not exist" });
              });
          });
          it("STATUS: 400 - Returns error message when a invalid comment_id is passed", () => {
            return request(app)
              .delete("/api/comments/apples")
              .expect(400)
              .then(response => {
                expect(response.body).to.eql({ msg: "Bad Request" });
              });
          });
        });
      });
      describe("ERRORS", () => {
        it("Status: 404 - Returns an error message when a request for a non existent article is made", () => {
          return request(app)
            .get("/api/articles/1000")
            .expect(404)
            .then(response => {
              expect(response.body).to.eql({ msg: "Not Found" });
            });
        });
        it("Status: 405 - Returns an error when an incorrect method is attempted", () => {
          const invalidMethods = ["get", "put", "post"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/comments/1")
              .expect(405)
              .then(response => {
                expect(response.body).to.eql({ msg: "method not allowed" });
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
});
