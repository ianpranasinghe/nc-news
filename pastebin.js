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


  const { errorHandler405 } = require("../errors/index.js");

  .all(errorHandler405);