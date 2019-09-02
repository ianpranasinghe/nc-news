describe("ERRORS", () => {
    it("Status: 405 - Returns an error when an incorrect method is attempted", () => {
      const invalidMethods = ['get', 'patch', 'put', 'post', "delete"];
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


  const { errorHandler405 } = require("../errors/index.js");

  .all(errorHandler405);


  {
    article: [
      {
        article_id: 2,
        title: 'Sony Vaio; or, The Laptop',
        body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        votes: 0,
        topic: 'mitch',
        author: 'icellusedkars',
        created_at: '2014-11-16T12:21:54.171Z',
        comment_count: '0'
      }
    ]
  }