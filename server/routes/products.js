const express = require('express');
const router = express.Router();
const crawlEqualpet = require('../crawler/crawlEqualpet');

let cachedProducts = [];

router.get('/', async (req, res) => {
  try {
    if (cachedProducts.length === 0) {
      cachedProducts = await crawlEqualpet();
    }
    res.json({ success: true, data: cachedProducts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;