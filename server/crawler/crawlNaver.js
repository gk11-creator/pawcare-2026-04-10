const axios = require('axios');

async function crawlNaver(keyword) {
  const query = encodeURIComponent(keyword);
  const products = [];

  try {
    const { data } = await axios.get(
      `https://openapi.naver.com/v1/search/shop.json?query=${query}&display=5&sort=sim`,
      {
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
        }
      }
    );

    data.items.forEach(item => {
      const cleanName = item.title.replace(/<[^>]*>/g, '');
      products.push({
        name: cleanName,
        price: Number(item.lprice).toLocaleString() + '원',
        mall: item.mallName,
        link: item.link,
        image: item.image,
        source: '네이버쇼핑'
      });
    });

    console.log(`✅ 네이버 API 완료: ${products.length}개`);
  } catch (err) {
    console.error('❌ 네이버 API 실패:', err.message);
  }

  return products;
}

module.exports = crawlNaver;