import http from "http";

const test = {
  track: "track",
  album: "album",
  playlist: "user:spotify:playlist",
};

const makeSonosApiRequest = (room, uri, type) => {
  const options = {
    hostname: process.env.SONOS_HTTP_API_HOSTNAME,
    port: process.env.SONOS_HTTP_API_PORT,
    path: `/${room}/spotify/now/spotify:${test[type]}:${uri}`,
    method: "GET",
  };

  const req = http.request(options, (res) => {
    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.end();

  return req;
};

export default makeSonosApiRequest;
