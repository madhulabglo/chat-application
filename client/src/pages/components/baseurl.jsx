
const mode = "dev";
// const mode = "prod";

const baseValues = {
  baseprotocal: {
    dev: "http://",
    prod: "http://",
  },
  basehost: {
    dev: "localhost:3001",
  },
};

const baseProtocal = baseValues.baseprotocal[mode];
const baseHost = baseValues.basehost[mode];
const baseURL = baseProtocal + baseHost;

export {baseURL}
