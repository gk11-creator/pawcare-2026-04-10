const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const REVIEWS_FILE = path.join(__dirname, '../data/reviews.json');

if (!fs.existsSync(REVIEWS_FILE)) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify([]));
}

router.post('/', (req, res) => {
  try {
    const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
    const newReview = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    reviews.push(newReview);
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/ratings', (req, res) => {
  try {
    const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
    const ratings = {};
    reviews.forEach(r => {
      if (!ratings[r.productName]) {
        ratings[r.productName] = { total: 0, count: 0 };
      }
      ratings[r.productName].total += r.rating;
      ratings[r.productName].count += 1;
    });
    const avgRatings = {};
    Object.keys(ratings).forEach(name => {
      avgRatings[name] = ratings[name].total / ratings[name].count;
    });
    res.json({ success: true, data: avgRatings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;