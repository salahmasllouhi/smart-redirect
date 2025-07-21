const express = require("express");
const requestIp = require("request-ip");
const geoip = require("geoip-lite");

const app = express();
const port = process.env.PORT || 3000;

// ✅ Define multiple redirect rules
const redirectRules = {
  "/DermaGlowPro": {
    targetCountry: "ID",
    urlA: "https://shop.aurevia.id/dermaglow-pro",
    urlB: "https://google.com/"
  },
  "/Salahox": {
    targetCountry: "ID",
    urlA: "https://www.youtube.com/",
    urlB: "https://google.com/"
  }
};

// ✅ Handle dynamic paths
app.get("*", (req, res) => {
  const path = req.path;
  const rule = redirectRules[path];

  if (!rule) {
    return res.status(404).send("Not Found");
  }

  const clientIp = requestIp.getClientIp(req);
  const geo = geoip.lookup(clientIp);
  const country = geo?.country || "Unknown";

  console.log(`Path: ${path}, IP: ${clientIp}, Country: ${country}`);

  if (country === rule.targetCountry) {
    return res.redirect(rule.urlA);
  } else {
    return res.redirect(rule.urlB);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
