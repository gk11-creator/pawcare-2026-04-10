import { useState } from 'react';
import axios from 'axios';
import './Review.css';

const API = 'http://localhost:4000';

export default function Review({ onBack, resultData }) {
  const [review, setReview] = useState({
    productName: '',
    rating: 0,
    effect: '',
    comment: '',
    wouldRecommend: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const productOptions = [
    ...(resultData?.data?.recommendations || []).map(r => r.productName),
    ...(resultData?.equalpetProducts || []).map(p => p.name),
    ...(resultData?.livepetProducts || []).map(p => p.name),
  ].filter(Boolean);

  const handleSubmit = async () => {
    if (!review.productName || !review.rating) {
      alert('제품명과 별점을 선택해주세요!');
      return;
    }
    try {
      await axios.post(`${API}/api/reviews`, review);
      setSubmitted(true);
    } catch (err) {
      alert('저장 중 오류가 발생했어요.');
    }
  };

  if (submitted) {
    return (
      <div className="review-container">
        <div className="review-success">
          <span>🎉</span>
          <h2>리뷰가 등록됐어요!</h2>
          <p>소중한 후기 감사합니다 🐾</p>
          <button className="back-btn-review" onClick={onBack}>← 추천 결과로 돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-container">
      <button className="back-btn-review" onClick={onBack}>← 추천 결과로 돌아가기</button>

      <div className="review-hero">
        <span>✏️</span>
        <h2>구매 후기 남기기</h2>
        <p>실제 사용 경험을 공유해주세요!</p>
      </div>

      <div className="review-card">
        <div className="review-group">
          <label>구매한 제품 선택</label>
          <select
            value={review.productName}
            onChange={e => setReview(prev => ({ ...prev, productName: e.target.value }))}
            className="review-select"
          >
            <option value="">제품을 선택해주세요</option>
            {productOptions.map((name, i) => (
              <option key={i} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="review-group">
          <label>만족도</label>
          <div className="star-group">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                className={`star ${review.rating >= star ? 'active' : ''}`}
                onClick={() => setReview(prev => ({ ...prev, rating: star }))}
              >★</button>
            ))}
            <span className="star-label">
              {review.rating === 1 && '별로예요'}
              {review.rating === 2 && '그저 그래요'}
              {review.rating === 3 && '보통이에요'}
              {review.rating === 4 && '좋아요'}
              {review.rating === 5 && '최고예요!'}
            </span>
          </div>
        </div>

        <div className="review-group">
          <label>효과가 있었나요?</label>
          <div className="effect-options">
            {['매우 효과 있음', '조금 효과 있음', '잘 모르겠음', '효과 없음'].map(opt => (
              <button
                key={opt}
                className={`effect-chip ${review.effect === opt ? 'active' : ''}`}
                onClick={() => setReview(prev => ({ ...prev, effect: opt }))}
              >{opt}</button>
            ))}
          </div>
        </div>

        <div className="review-group">
          <label>상세 후기</label>
          <textarea
            placeholder="우리 아이에게 어떤 변화가 있었나요? 자유롭게 적어주세요."
            value={review.comment}
            onChange={e => setReview(prev => ({ ...prev, comment: e.target.value }))}
            rows={4}
          />
        </div>

        <div className="review-group">
          <label>추천하시겠어요?</label>
          <div className="recommend-options">
            <button
              className={`recommend-btn ${review.wouldRecommend === true ? 'active-yes' : ''}`}
              onClick={() => setReview(prev => ({ ...prev, wouldRecommend: true }))}
            >👍 추천해요</button>
            <button
              className={`recommend-btn ${review.wouldRecommend === false ? 'active-no' : ''}`}
              onClick={() => setReview(prev => ({ ...prev, wouldRecommend: false }))}
            >👎 비추천해요</button>
          </div>
        </div>

        <button className="submit-review-btn" onClick={handleSubmit}>
          후기 등록하기 🐾
        </button>
      </div>
    </div>
  );
}