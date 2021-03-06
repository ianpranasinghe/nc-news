const { expect } = require("chai");
//chai.use(require("chai-datetime")); // Why can't i get chai-date time to work, it's installed locally and I've tried requiring it in different ways - https://github.com/mguterl/chai-datetime ?
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("Utils function: formatDates", () => {
  it("Returns an new array", () => {
    const insertion = [];
    const invocation = formatDates(insertion);
    expect(invocation).to.be.an("array");
    expect(invocation).to.not.equal(insertion);
  });
  it("Transforms the date format correctly when passed one object", () => {
    const insertion = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const invocation = formatDates(insertion);
    const testDateFormat = new Date(insertion[0].created_at);
    expect(invocation[0].created_at).to.eql(testDateFormat);
  });
  it("Transforms the date format correctly when passed numerous objects", () => {
    const insertion = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];
    const expectedResult = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: new Date(1416140514171)
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: new Date(1289996514171) // I need to change these but feel like its a crao way
      }
    ];
    const invocation = formatDates(insertion);

    const testDateFormat = new Date(insertion[0].created_at);
    expect(invocation).to.eql(expectedResult);
  });
});

describe("Utils function: makeRefObj", () => {
  it("Births a lil' baby object when an empty ol' array falls in love with a reduce method", () => {
    const invocation = makeRefObj([]);
    expect(invocation).to.eql({});
    expect(invocation).to.be.an("object");
  });
  it("Returns a lookup table with the correct key value pairs for a single object", () => {
    const articlesArray = [
      {
        article_id: 1,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171
      }
    ];

    const keyName = "title";
    const keyValue = "article_id";
    const invocation = makeRefObj(articlesArray, keyName, keyValue);
    const expected = { "They're not exactly dogs, are they?": 1 };
    expect(invocation).to.eql(expected);
  });

  it("Returns a lookup table with the correct key value pairs for numerous objects", () => {
    const articlesArray = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 2,
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171
      },
      {
        article_id: 3,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171
      }
    ];

    const keyName = "title";
    const keyValue = "article_id";
    const invocation = makeRefObj(articlesArray, keyName, keyValue);
    const expected = {
      "They're not exactly dogs, are they?": 3,
      "UNCOVERED: catspiracy to bring down democracy": 2,
      "Living in the shadow of a great man": 1
    };
    expect(invocation).to.eql(expected);
  });
});

describe("Utils Functions: formatComments", () => {
  it("Returns a new array", () => {
    const insertion = [];
    const invocation = formatComments(insertion);
    expect(invocation).to.be.an("array");
    expect(invocation).to.not.equal(insertion);
  });
  it("Changes the keyName for one set of key value pairs ", () => {
    const insertion = [{ name: "Smitch" }];
    const keyToChange = "name";
    const newKeyName = "newname";
    const invocation = formatComments(insertion, keyToChange, newKeyName);
    const expectedResult = [{ newname: "Smitch" }];
    expect(invocation).to.eql(expectedResult);
  });
  it("Changes the keyName for numerous key value pairs ", () => {
    const insertion = [
      {
        name: "OhNo",
        eyy: "NoNo",
        ayyyy: "Chomp"
      },
      {
        name: "Yoko",
        eyy: "NoNo",
        ayyyy: "Stomp"
      },
      {
        name: "Smitch",
        eyy: "NoNo",
        ayyyy: "Woah!No"
      }
    ];
    const keyToChange = "name";
    const newKeyName = "newName";
    const invocation = formatComments(insertion, keyToChange, newKeyName);
    const expectedResult = [
      {
        newName: "OhNo",
        eyy: "NoNo",
        ayyyy: "Chomp"
      },
      {
        newName: "Yoko",
        eyy: "NoNo",
        ayyyy: "Stomp"
      },
      {
        newName: "Smitch",
        eyy: "NoNo",
        ayyyy: "Woah!No"
      }
    ];
    expect(invocation).to.eql(expectedResult);
  });
  it("Changes the keyName and it's value as requested", () => {
    const lookUp = {
      "They're not exactly dogs, are they?": 3,
      "UNCOVERED: catspiracy to bring down democracy": 2,
      "Living in the shadow of a great man": 1
    };
    const insertion = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      }
    ];

    const keyToChange = "belongs_to";
    const newKeyName = "article_id";
    const invocation = formatComments(
      insertion,
      keyToChange,
      newKeyName,
      lookUp
    );
    const expectedResult = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 3,
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        article_id: 1,
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      }
    ];
    expect(invocation).to.eql(expectedResult);
  });
  it("Tests if the original inout has been mutated or not", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const lookUp = {
      "They're not exactly dogs, are they?": 3,
      "UNCOVERED: catspiracy to bring down democracy": 2,
      "Living in the shadow of a great man": 1
    };

    const keyToChange = "belongs_to";
    const newKeyName = "article_id";
    formatComments(input, keyToChange, newKeyName, lookUp);
    const expectedResult = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    expect(input).to.eql(expectedResult);
  });
});
