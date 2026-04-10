import './Result.css';

export default function Result({ data, onBack }) {
  if (!data?.data) return null;
  const { nutritionAnalysis, recommendations, risks, summary } = data.data;
  const equalpetProducts = data.equalpetProducts || [];
  const comparison = data.data.comparison || [];
  const equalpetNote = data.equalpetNote || null;
  const livepetProducts = data.livepetProducts || [];
  const livepetNote = data.livepetNote || null;

  return (
    <div className="result-container">
      <button className="back-btn" onClick={onBack}>← 다시 분석하기</button>

      <div className="result-hero">
        <span>🔬</span>
        <h2>맞춤 영양 분석 결과</h2>
        <p className="summary-text">{summary}</p>
      </div>

      <div className="section-card">
        <h3>📊 영양 분석</h3>
        <p>{nutritionAnalysis}</p>
      </div>

      <div className="two-col-section">
        <div className="section-card col-card">
          <h3>🛍️ 네이버 쇼핑몰 권장제품</h3>
          {recommendations.slice(0, 3).map((rec, i) => (
            <div className="product-card" key={i}>
              <div className="product-rank">#{i + 1}</div>
              <div className="product-info">
                <h4>{rec.productName}</h4>
                <p className="reason">💡 {rec.reason}</p>
                <p className="effect">✨ {rec.expectedEffect}</p>
                <div className="product-meta">
                  <span className="price">💰 {rec.price}</span>
                  <span className="source">{rec.source}</span>
                  {rec.link && rec.link.startsWith('http') && (
                    <a href={rec.link} target="_blank" rel="noreferrer" className="buy-link">
                      구매하기 →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {equalpetProducts.length > 0 && (
          <div className="section-card col-card">
            <h3>🐾 이퀄펫 권장제품</h3>
            {equalpetNote && (
              <p className="equalpet-note">ℹ️ {equalpetNote}</p>
            )}
            {equalpetProducts.slice(0, 3).map((product, i) => (
              <div className="product-card" key={i}>
                <div className="product-rank">#{i + 1}</div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="reason">💡 {product.description || '견종 맞춤 영양제로 필요한 성분을 균형있게 제공합니다.'}</p>
                  {product.effect && <p className="effect">✨ {product.effect}</p>}
                  <div className="product-meta">
                    <span className="price">💰 {product.price || '가격문의'}</span>
                    <span className="source">이퀄펫</span>
                    {product.link && (
                      <a href={product.link} target="_blank" rel="noreferrer" className="buy-link">
                        구매하기 →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {livepetProducts.length > 0 && (
          <div className="section-card col-card">
            <h3>🌿 리브펫 권장제품</h3>
            {livepetNote && <p className="equalpet-note">ℹ️ {livepetNote}</p>}
            {livepetProducts.map((product, i) => (
              <div className="product-card" key={i}>
                <div className="product-rank">#{i + 1}</div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  {product.summary && <p className="reason">💡 {product.summary}</p>}
                  <div className="product-meta">
                    <span className="price">💰 {product.price}</span>
                    <span className="source">리브펫</span>
                    {product.link && (
                      <a href={product.link} target="_blank" rel="noreferrer" className="buy-link">
                        구매하기 →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {comparison.length > 0 && (
        <div className="comparison-card">
          <h3>🔍 추천 제품 비교</h3>
          <ul>
            {comparison.map((point, i) => (
              <li key={i}>
                <span className="comparison-bullet">※</span> {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="section-card risk-card">
        <h3>⚠️ 주의사항</h3>
        <ul>
          {risks.map((risk, i) => (
            <li key={i}>{risk}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}