const scraper = require("./api/scraper");
const fbEventLoader = require("./api/loadFbEvent");
const { URL } = require("url");

module.exports = async (app, { port }) => {
  const scrap = scraper(`http://localhost:${port}/loadFbEvent?fbEventUrl=`);
  const loadFbEvent = fbEventLoader();

  const parseQuery = queryString => {
    var query = {};
    var pairs = (queryString[0] === "?"
      ? queryString.substr(1)
      : queryString
    ).split("&");
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
    }
    return query;
  };

  app.use("/scrap", (req, res) => {
    const url = req.query.url;
    scrap(url).then(json => {
      if (json["venueLink"]) {
        const url = new URL(json["venueLink"]);
        json["venueLink"] = parseQuery(url.search)["u"];
      }

      res.json(json);
    });
  });

  app.use("/loadFbEvent", (req, res) => {
    const fbEventUrl = req.query.fbEventUrl;
    console.log(fbEventUrl);
    if (fbEventUrl) {
      loadFbEvent(fbEventUrl).then(html => {
        res.send(html);
      });
    } else {
      res.sendStatus(400);
    }
  });
};
