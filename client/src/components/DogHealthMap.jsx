const BREED_WEAKNESSES = {
  '말티즈': {
    areas: ['heart', 'joint', 'kidney'],
    labels: { heart: '심장', joint: '관절/슬개골', kidney: '신장' },
    desc: '말티즈는 승모판 폐쇄부전증, 슬개골 탈구에 취약해요'
  },
  '푸들': {
    areas: ['joint', 'eye', 'skin'],
    labels: { joint: '관절', eye: '눈', skin: '피부/털' },
    desc: '푸들은 슬개골 탈구, 눈 질환, 피부 문제에 취약해요'
  },
  '포메라니안': {
    areas: ['heart', 'skin', 'trachea'],
    labels: { heart: '심장', skin: '피부/털', trachea: '기관지' },
    desc: '포메라니안은 심장병, 탈모, 기관지 협착에 취약해요'
  },
  '시츄': {
    areas: ['eye', 'skin', 'joint'],
    labels: { eye: '눈', skin: '피부', joint: '관절' },
    desc: '시츄는 눈 질환, 피부 문제, 관절에 취약해요'
  },
  '비숑': {
    areas: ['skin', 'eye', 'joint'],
    labels: { skin: '피부/알러지', eye: '눈물', joint: '관절' },
    desc: '비숑은 피부 알러지, 눈물 자국, 관절에 취약해요'
  },
  '골든리트리버': {
    areas: ['joint', 'heart', 'skin'],
    labels: { joint: '관절/고관절', heart: '심장', skin: '피부' },
    desc: '골든리트리버는 고관절 이형성증, 심장병에 취약해요'
  },
  '진돗개': {
    areas: ['joint', 'skin'],
    labels: { joint: '관절', skin: '피부' },
    desc: '진돗개는 관절, 피부 문제에 취약할 수 있어요'
  },
};

const AREA_POSITIONS = {
  heart:  { cx: 52, cy: 38, r: 10, label_x: 72, label_y: 38 },
  joint:  { cx: 35, cy: 68, r: 10, label_x: 15, label_y: 78 },
  kidney: { cx: 60, cy: 48, r: 8,  label_x: 72, label_y: 52 },
  eye:    { cx: 72, cy: 18, r: 7,  label_x: 82, label_y: 18 },
  skin:   { cx: 50, cy: 55, r: 9,  label_x: 62, label_y: 62 },
  trachea:{ cx: 58, cy: 28, r: 7,  label_x: 68, label_y: 24 },
};

export default function DogHealthMap({ breed }) {
  const info = BREED_WEAKNESSES[breed];
  if (!info) return null;

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)'
    }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '800',
        color: '#333',
        marginBottom: '6px',
        paddingLeft: '12px',
        borderLeft: '3px solid #d4627a'
      }}>
        🐕 {breed} 건강 취약 부위
      </h3>
      <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
        {info.desc}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        {/* SVG 강아지 */}
        <svg viewBox="0 0 100 100" width="180" height="180" style={{ flexShrink: 0 }}>
          {/* 몸통 */}
          <ellipse cx="50" cy="58" rx="28" ry="20" fill="#f5e6d3" stroke="#ddd" strokeWidth="1"/>
          {/* 머리 */}
          <circle cx="72" cy="28" r="16" fill="#f5e6d3" stroke="#ddd" strokeWidth="1"/>
          {/* 귀 왼쪽 */}
          <ellipse cx="62" cy="14" rx="6" ry="9" fill="#e8d5c0" stroke="#ddd" strokeWidth="1" transform="rotate(-15 62 14)"/>
          {/* 귀 오른쪽 */}
          <ellipse cx="83" cy="14" rx="6" ry="9" fill="#e8d5c0" stroke="#ddd" strokeWidth="1" transform="rotate(15 83 14)"/>
          {/* 눈 */}
          <circle cx="68" cy="26" r="2.5" fill="#555"/>
          <circle cx="77" cy="26" r="2.5" fill="#555"/>
          {/* 코 */}
          <ellipse cx="72" cy="33" rx="3" ry="2" fill="#888"/>
          {/* 앞다리 */}
          <rect x="30" y="72" width="8" height="18" rx="4" fill="#f5e6d3" stroke="#ddd" strokeWidth="1"/>
          <rect x="44" y="72" width="8" height="18" rx="4" fill="#f5e6d3" stroke="#ddd" strokeWidth="1"/>
          {/* 뒷다리 */}
          <rect x="58" y="72" width="8" height="18" rx="4" fill="#f5e6d3" stroke="#ddd" strokeWidth="1"/>
          <rect x="70" y="72" width="8" height="18" rx="4" fill="#f5e6d3" stroke="#ddd" strokeWidth="1"/>
          {/* 꼬리 */}
          <path d="M22 52 Q10 40 18 30" stroke="#e8d5c0" strokeWidth="5" fill="none" strokeLinecap="round"/>

          {/* 취약 부위 하이라이트 */}
          {info.areas.map(area => {
            const pos = AREA_POSITIONS[area];
            if (!pos) return null;
            return (
              <g key={area}>
                <circle
                  cx={pos.cx} cy={pos.cy} r={pos.r}
                  fill="rgba(212, 98, 122, 0.25)"
                  stroke="#d4627a"
                  strokeWidth="1.5"
                  strokeDasharray="3,2"
                />
                <circle cx={pos.cx} cy={pos.cy} r="3" fill="#d4627a"/>
              </g>
            );
          })}
        </svg>

        {/* 취약 부위 설명 */}
        <div style={{ flex: 1 }}>
          {info.areas.map(area => (
            <div key={area} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '12px', height: '12px',
                borderRadius: '50%',
                background: '#d4627a',
                flexShrink: 0
              }}/>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#333' }}>
                  {info.labels[area]}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  {area === 'heart' && '심장 건강을 위한 타우린, 코엔자임Q10 섭취 권장'}
                  {area === 'joint' && '관절 보호를 위한 글루코사민, 콘드로이틴 섭취 권장'}
                  {area === 'kidney' && '신장 건강을 위한 수분 섭취 및 저인산 식단 권장'}
                  {area === 'eye' && '눈 건강을 위한 루테인, 지아잔틴 섭취 권장'}
                  {area === 'skin' && '피부/털 건강을 위한 오메가3, 비오틴 섭취 권장'}
                  {area === 'trachea' && '기관지 건강을 위한 항산화 성분 섭취 권장'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}