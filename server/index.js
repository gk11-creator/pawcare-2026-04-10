const express = require('express');
const cors = require('cors');
require('dotenv').config();

const recommendRoute = require('./routes/recommend');
const productsRoute = require('./routes/products');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/recommend', recommendRoute);
app.use('/api/products', productsRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));