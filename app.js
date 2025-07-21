const express = require("express");
const requestIp = require("request-ip");
const geoip = require("geoip-lite");
const { URL } = require("url");

const app = express();
const port = process.env.PORT || 3000;

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

// ✅ FIX: Use a regular expression for the catch-all route
app.get(/^\/.*/, (req, res) => {
  const path = req.path;
  const rule = redirectRules[path];

  console.log("Requested path:", path);
  if (!rule) {
    // It's good practice to ignore requests for favicon.ico
    if (path === '/favicon.ico') {
      return res.status(204).send();
    }
    return res.status(404).send("Not Found");
  }

  const clientIp = requestIp.getClientIp(req);
  const geo = geoip.lookup(clientIp);
  const country = geo?.country || "Unknown";

  console.log(`Path: ${path}, IP: ${clientIp}, Country: ${country}`);

  const baseRedirect = country === rule.targetCountry ? rule.urlA : rule.urlB;

  const finalUrl = new URL(baseRedirect);
  const queryString = req.originalUrl.split("?")[1];
  if (queryString) {
    finalUrl.search = queryString;
  }

  return res.redirect(302, finalUrl.toString());
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});