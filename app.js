const express = require('express');
const geoip = require('geoip-lite');

const app = express();
const PORT = process.env.PORT || 3000;

// Toggle test mode to simulate location
const TEST_MODE = false;
const TEST_IP = '114.124.123.1'; // Example: Indonesia IP

// Define multiple redirect rules
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

app.get('*', (req, res) => {
    const path = req.path;
    const rule = redirectRules[path];

    if (!rule) {
        return res.status(404).send("No redirect rule for this path.");
    }

    let ip;
    if (TEST_MODE) {
        ip = TEST_IP;
        console.log("🧪 TEST MODE ON");
    } else {
        ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
    }

    const geo = geoip.lookup(ip);
    const country = geo?.country || 'UNKNOWN';

    console.log(`🌍 Visitor to ${path} | IP: ${ip} | Country: ${country}`);

    if (country === rule.targetCountry) {
        console.log("✅ Redirecting to URL A");
        return res.redirect(rule.urlA);
    } else {
        console.log("🔁 Redirecting to URL B");
        return res.redirect(rule.urlB);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Smart Redirect App running on port ${PORT}`);
});
