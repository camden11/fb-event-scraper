const osmosis = require("osmosis");

module.exports = fbEventUrl => {
  const scrap = url =>
    new Promise(resolve => {
      osmosis
        .get(`${fbEventUrl}${url}`)
        .set([
          osmosis
            .find("#upcoming_events_card > div > div:not(:first-child)")
            .set({
              title: "td:nth-child(2) span",
              month: "td:nth-child(1) span > span:first-child",
              day: "td:nth-child(1) span > span:nth-child(2)"
            })
        ])
        .data(data => {
          resolve(data);
        })
        .done()
        .log(console.log)
        .error(console.error)
        .debug(console.debug);
    });

  return scrap;
};
