const express = require('express');
const geoip = require('geoip-lite');

const app = express();
const PORT = process.env.PORT || 3000;

// Redirect rules
const TARGET_COUNTRY = 'ID';  // 'ID' = Indonesia
const URL_A = 'https://shop.aurevia.id/dermaglow-pro';       // For Indonesian visitors
const URL_B = 'https://google.com';   // For everyone else

// Toggle this to true when testing locally
const TEST_MODE = true;

app.get('/', (req, res) => {
    let country, ip;

    if (TEST_MODE) {
        // Simulate visitor from Indonesia
        ip = '114.124.123.1';  // Sample Indonesian IP
        console.log('🧪 TEST MODE ON');
    } else {
        // Use real visitor IP
        ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
    }

    const geo = geoip.lookup(ip);
    country = geo?.country || 'UNKNOWN';

    console.log(`🌍 Visitor IP: ${ip}, Country: ${country}`);

    if (country === TARGET_COUNTRY) {
        console.log('✅ Redirecting to URL A (Indonesia)');
        return res.redirect(URL_A);
    } else {
        console.log('🔁 Redirecting to URL B (Global)');
        return res.redirect(URL_B);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Smart Redirect App running on port ${PORT}`);
});
