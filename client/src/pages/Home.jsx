import { useState } from 'react';
import axios from 'axios';
import './Home.css';

const HEALTH_OPTIONS = ['관절', '피부', '소화', '면역', '눈', '심장', '치아', '비만'];
const BREEDS = ['말티즈', '푸들', '포메라니안', '시츄', '비숑', '골든리트리버', '진돗개', '기타'];

export default function Home({ onResult }) {
  const [form, setForm] = useState({
    breed: '',
    age: '',
    weight: '',
    healthConcerns: [],
  });
  const [loading, setLoading] = useState(false);

  const toggleConcern = (concern) => {
    setForm(prev => ({
      ...prev,
      healthConcerns: prev.healthConcerns.includes(concern)
        ? prev.healthConcerns.filter(c => c !== concern)
        : [...prev.healthConcerns, concern]
    }));
  };

  const handleSubmit = async () => {
    if (!form.breed || !form.age || !form.weight || form.healthConcerns.length === 0) {
      alert('모든 항목을 입력해주세요!');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('https://pawcare-2026-04-10.onrender.com/api/recommend', form);
      onResult(res.data);
    } catch (err) {
      alert('분석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="hero">
        <span className="hero-emoji">🐾</span>
        <h1>PawCare AI</h1>
        <p>우리 아이에게 딱 맞는 영양제를 찾아드려요</p>
      </div>

      <div className="form-card">
        <div className="form-group">
          <label>견종 선택</label>
          <div className="chip-group">
            {BREEDS.map(b => (
              <button
                key={b}
                className={`chip ${form.breed === b ? 'active' : ''}`}
                onClick={() => setForm(prev => ({ ...prev, breed: b }))}
              >{b}</button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label>나이 (살)</label>
            <input
              type="number" min="0" max="20"
              placeholder="예: 3"
              value={form.age}
              onChange={e => setForm(prev => ({ ...prev, age: e.target.value }))}
            />
          </div>
          <div className="form-group half">
            <label>체중 (kg)</label>
            <input
              type="number" min="0" max="60"
              placeholder="예: 5.2"
              value={form.weight}
              onChange={e => setForm(prev => ({ ...prev, weight: e.target.value }))}
            />
          </div>
        </div>

        <div className="form-group">
          <label>건강 관심사 (복수 선택)</label>
          <div className="chip-group">
            {HEALTH_OPTIONS.map(h => (
              <button
                key={h}
                className={`chip ${form.healthConcerns.includes(h) ? 'active' : ''}`}
                onClick={() => toggleConcern(h)}
              >{h}</button>
            ))}
          </div>
        </div>

        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? '🔍 분석 중...' : '🐶 맞춤 영양제 찾기'}
        </button>
      </div>
    </div>
  );
}