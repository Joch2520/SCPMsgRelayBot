var config = {
  "CMD_PREFIX": "-/",
  "DIS_TOKEN": "",
  "TEL_TOKEN": "",
  "cqconfig": {
    "httpapi":{
      "apiRoot": "http://0.0.0.0:7501"
    }
  },
  "SCP_SITE": "cn"
}
const fs = require("fs");
const path = require('path');
let custom = JSON.parse(fs.readFileSync(path.join(__dirname,'../../data/config.json'), 'utf8'));

confignames = ["CMD_PREFIX", "DIS_TOKEN", "TEL_TOKEN", "SCP_SITE"];
for (name of confignames) { if (custom[name] !== undefined && custom[name]) {config[name] = custom[name]} };

if (process.env.MRB_FORCE_ENV === undefined || process.env.MRB_FORCE_ENV.toLowerCase === "true") {
  if (process.env.MRB_CMD_PREFIX) { config.CMD_PREFIX = process.env.MRB_CMD_PREFIX };
  if (process.env.MRB_DIS_TOKEN) { config.DIS_TOKEN = process.env.MRB_DIS_TOKEN };
  if (process.env.MRB_TEL_TOKEN) { config.TEL_TOKEN = process.env.MRB_TEL_TOKEN };
  if (process.env.MRB_SCP_SITE) { config.SCP_SITE = process.env.MRB_SCP_SITE };
}


module.exports = config;
