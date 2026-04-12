const axios = require('axios');
const cheerio = require('cheerio');

async function crawlEqualpet() {
  const url = 'https://equalpet.store/product/list.html?cate_no=43';
  const products = [];

  try {
    console.log('🔍 이퀄펫 크롤링 시작...');
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    const $ = cheerio.load(data);

    $('.prdList li').each((i, el) => {
      const name = $(el).find('.name').text().trim();
      const priceEl = $(el).find('.price').text().trim();
      const consumerPrice = $(el).find('.consumer').text().trim();
      const link = $(el).find('a').first().attr('href');
      const image = $(el).find('img').first().attr('src');
      const desc = $(el).find('.summary').text().trim() ||
                   $(el).find('.description').text().trim() ||
                   $(el).find('.txt').text().trim();

      const isSoldout = $(el).find('.cart').length === 0;

      if (name && name.length > 2) {
        products.push({
          name,
          price: priceEl || consumerPrice || null,
          description: desc || null,
          link: link ? `https://equalpet.store${link}` : 'https://equalpet.store',
          image,
          source: 'equalpet'
        });
      }
    });

    // 중복 제거
    const unique = products.filter((p, index, self) =>
      index === self.findIndex(t => t.name === p.name)
    );

    console.log(`✅ 이퀄펫 크롤링 완료: ${unique.length}개 (중복 제거 후)`);
    if (unique.length > 0) {
      console.log('샘플:', JSON.stringify(unique[0], null, 2));
    }

    return unique;

  } catch (err) {
    console.error('❌ 이퀄펫 크롤링 실패:', err.message);
    return [];
  }
}

module.exports = crawlEqualpet;