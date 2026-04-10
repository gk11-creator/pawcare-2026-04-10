const axios = require('axios');
const cheerio = require('cheerio');

async function crawlLivepet() {
  const url = 'https://livepet.co.kr/product/list.html?cate_no=24';
  const products = [];

  try {
    console.log('🔍 리브펫 크롤링 시작...');
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    const $ = cheerio.load(data);

    $('.prdList li').each((i, el) => {
      const name = $(el).find('.name').text().trim();

      // 가격 중복 제거 — 숫자+원 패턴에서 첫 번째만 추출
      const priceRaw = $(el).find('.price').text().trim();
      const priceMatch = priceRaw.match(/([\d,]+원)/);
      const price = priceMatch ? priceMatch[1] : null;

      // 상품 링크 — prdImg 안의 a 태그
      const rawLink = $(el).find('.prdImg a').attr('href') ||
                      $(el).find('a[href*="/product/"]').attr('href');
      const link = rawLink
        ? (rawLink.startsWith('http') ? rawLink : `https://livepet.co.kr${rawLink}`)
        : null;

      const image = $(el).find('.prdImg img').attr('src');
      const summary = $(el).find('.summary').text().trim();

      if (name && name.length > 2) {
        products.push({
          name,
          price,
          summary: summary || null,
          link,
          image,
          source: 'livepet'
        });
      }
    });

    const unique = products.filter((p, index, self) =>
      index === self.findIndex(t => t.name === p.name)
    );

    console.log(`✅ 리브펫 크롤링 완료: ${unique.length}개`);
    if (unique.length > 0) {
      console.log('샘플:', JSON.stringify(unique[0], null, 2));
    }
    return unique;

  } catch (err) {
    console.error('❌ 리브펫 크롤링 실패:', err.message);
    return [];
  }
}

module.exports = crawlLivepet;