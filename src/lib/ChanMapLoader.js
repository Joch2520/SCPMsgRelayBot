var cmap = {
    "CHAN_NAME": [],
    "DIS_GID": [],
    "DIS_CID": [],
    "QQ_GPID": [],
    "TEL_CID": []
}

const fs = require("fs");
const path = require('path');
let custom = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/channelMapping.json'), 'utf8'));

cmapvars = ["CHAN_NAME", "DIS_GID", "DIS_CID", "QQ_GPID", "TEL_CID"];
for (name of cmapvars) { if (custom[name] !== undefined && custom[name]) {cmap[name] = custom[name]} };

if (process.env.MRB_FORCE_ENV === undefined || process.env.MRB_FORCE_ENV.toLowerCase === "true") {
  if (process.env.MRB_CHAN_NAME!==undefined && process.env.MRB_CHAN_NAME) { config.CHAN_NAME = process.env.MRB_CHAN_NAME };
  if (process.env.MRB_DIS_GID !==undefined && process.env.MRB_DIS_GID ) { config.DIS_GID  = process.env.MRB_DIS_GID  };
  if (process.env.MRB_DIS_CID !==undefined && process.env.MRB_DIS_CID ) { config.DIS_CID  = process.env.MRB_DIS_CID  };
  if (process.env.MRB_QQ_GPID !==undefined && process.env.MRB_QQ_GPID ) { config.QQ_GPID  = process.env.MRB_QQ_GPID  };
  if (process.env.MRB_TEL_CID  !==undefined && process.env.MRB_TEL_CID  ) { config.TEL_CID   = process.env.MRB_TEL_CID   };
}


module.exports = cmap;
