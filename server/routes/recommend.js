const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');
const crawlNaver = require('../crawler/crawlNaver');
const crawlEqualpet = require('../crawler/crawlEqualpet');
const crawlLivepet = require('../crawler/crawlLivepet');

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

router.post('/', async (req, res) => {
  const { breed, age, weight, healthConcerns } = req.body;

  try {
    const keyword = `강아지 ${healthConcerns[0]} 영양제`;

    const [naverProducts, equalpetProducts, livepetProducts] = await Promise.all([
      crawlNaver(keyword),
      crawlEqualpet(),
      crawlLivepet()
    ]);

    const productContext = naverProducts
      .map(p => `- ${p.name} / ${p.price} / ${p.mall}`)
      .join('\n');

    const prompt = `
당신은 반려견 영양제 전문 AI 어드바이저입니다.
아래 반려견 정보를 바탕으로 맞춤 영양 분석과 제품 추천을 해주세요.

[반려견 정보]
- 견종: ${breed}
- 나이: ${age}살
- 체중: ${weight}kg
- 건강 관심사: ${healthConcerns.join(', ')}

[네이버쇼핑 제품 정보]
${productContext}

다음 형식으로 JSON만 반환해주세요 (다른 텍스트 없이, recommendations는 반드시 3개):
{
  "nutritionAnalysis": "현재 이 강아지에게 필요한 영양소 분석 (2-3문장)",
  "recommendations": [
    {
      "productName": "제품명",
      "reason": "이 제품이 이 강아지에게 적합한 이유 (성분 기반으로)",
      "expectedEffect": "기대 효과",
      "price": "가격",
      "source": "출처"
    }
  ],
  "comparison": [
    "네이버쇼핑 추천 제품들과 이퀄펫 제품의 차이점 1 (성분, 형태, 특징 등 구체적으로)",
    "차이점 2",
    "차이점 3"
  ],
  "risks": ["주의사항1", "주의사항2"],
  "summary": "한 줄 요약"
}
`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const raw = response.data.choices[0].message.content;
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);

    // 네이버 제품 링크 직접 매핑
    result.recommendations = result.recommendations.map((rec, i) => ({
      ...rec,
      link: naverProducts[i]?.link ||
        `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(rec.productName)}`
    }));

    // 1순위: 견종 이름 매칭
    const breedFiltered = equalpetProducts.filter(p => p.name.includes(breed));
    // 2순위: 강아지용 제품 (고양이 제품 제외)
    const dogFiltered = equalpetProducts.filter(p =>
      !p.name.includes('고양이') && !p.name.includes('코리안숏헤어')
    );
    const equalpetFiltered = breedFiltered.length > 0 ? breedFiltered : dogFiltered;
    const equalpetNote = breedFiltered.length > 0
      ? null
      : `현재 이퀄펫에 ${breed} 전용 제품이 없어, 강아지용 제품 중 적합한 제품을 보여드립니다.`;

    // 가격 파싱
    const parsePrice = (product) => {
      if (product.price) return product.price;
      if (product.description) {
        const match = product.description.match(/판매가\s*([\d,]+원)/);
        if (match) return match[1];
        const match2 = product.description.match(/소비자가\s*([\d,]+원)/);
        if (match2) return match2[1];
      }
      return null;
    };

    // 건강 관심사 기반 리브펫 제품 필터링
    const healthKeywords = {
      '관절': ['관절', '조인트'],
      '피부': ['피부', '스킨', '피모'],
      '소화': ['유산균', '장'],
      '면역': ['유산균', '면역'],
      '눈': ['눈', '아이즈'],
      '심장': ['심장', '브레스'],
      '치아': ['덴탈', '치아'],
      '비만': ['다이어트', '체중']
    };

    const keywords = healthConcerns.flatMap(h => healthKeywords[h] || [h]);
    const livepetFiltered = livepetProducts.filter(p =>
      keywords.some(k => p.name.includes(k))
    ).slice(0, 3);
    const livepetNote = livepetFiltered.length > 0 && !livepetFiltered.every(p =>
      healthConcerns.some(h => p.name.includes(h))
    ) ? `${breed}의 건강 관심사(${healthConcerns.join(', ')})에 맞는 리브펫 전문 영양제를 보여드립니다.` : null;

    if (equalpetFiltered.length === 0) {
      return res.json({
        success: true,
        data: result,
        products: naverProducts,
        equalpetProducts: [],
        equalpetNote: null,
        livepetProducts: livepetFiltered
      });
    }

    // 이퀄펫 제품별 GPT 설명 생성
    const equalpetPrompt = `
다음 반려견 영양제 제품들에 대해 소비자가 이해하기 쉬운 짧은 설명을 만들어주세요.
반려견 정보: 견종 ${breed}, ${age}살, 건강 관심사 ${healthConcerns.join(', ')}

제품 목록:
${equalpetFiltered.slice(0, 3).map((p, i) => `${i + 1}. ${p.name}`).join('\n')}

JSON만 반환 (다른 텍스트 없이):
{
  "products": [
    {
      "description": "이 강아지에게 왜 좋은지 성분 기반으로 1-2문장",
      "effect": "구체적인 기대 효과"
    },
    {
      "description": "제품2 설명",
      "effect": "제품2 기대 효과"
    },
    {
      "description": "제품3 설명",
      "effect": "제품3 기대 효과"
    }
  ]
}
`;

    const equalpetResponse = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: equalpetPrompt }],
      temperature: 0.7,
    });

    const equalpetRaw = equalpetResponse.data.choices[0].message.content;
    const equalpetCleaned = equalpetRaw.replace(/```json|```/g, '').trim();
    const equalpetResult = JSON.parse(equalpetCleaned);

    const equalpetWithDesc = equalpetFiltered.slice(0, 3).map((p, i) => ({
      ...p,
      price: parsePrice(p),
      description: equalpetResult.products[i]?.description || '견종 맞춤 영양제로 필요한 성분을 균형있게 제공합니다.',
      effect: equalpetResult.products[i]?.effect || null
    }));

    res.json({
      success: true,
      data: result,
      products: naverProducts,
      equalpetProducts: equalpetWithDesc,
      equalpetNote: equalpetNote,
      livepetProducts: livepetFiltered,
      livepetNote: livepetNote
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;