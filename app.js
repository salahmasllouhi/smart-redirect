const express = require("express");
const requestIp = require("request-ip");
const geoip = require("geoip-lite");
const { URL } = require("url"); // Needed for query handling

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

// ✅ Handle dynamic paths with query parameter support
app.get("*", (req, res) => {
  const path = req.path;
  const rule = redirectRules[path];

  console.log("Requested path:", path);
  if (!rule) {
    return res.status(404).send("Not Found");
  }

  const clientIp = requestIp.getClientIp(req);
  const geo = geoip.lookup(clientIp);
  const country = geo?.country || "Unknown";

  console.log(`Path: ${path}, IP: ${clientIp}, Country: ${country}`);

  // Choose destination based on country
  const baseRedirect = country === rule.targetCountry ? rule.urlA : rule.urlB;

  // ✅ Preserve query string (e.g. utm_source=facebook)
  const finalUrl = new URL(baseRedirect);
  const queryString = req.originalUrl.split("?")[1];
  if (queryString) {
    finalUrl.search = queryString;
  }

  return res.redirect(finalUrl.toString());
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
