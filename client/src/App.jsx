import { useState } from 'react';
import Home from './pages/Home';
import Result from './pages/Result';
import Review from './pages/Review';
import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [resultData, setResultData] = useState(null);
  const [formData, setFormData] = useState(null);

  return (
    <div className="app">
      {page === 'home' && (
        <Home
          onResult={(data, form) => {
            setResultData(data);
            setFormData(form);
            setPage('result');
          }}
        />
      )}
      {page === 'result' && (
        <Result
          data={resultData}
          breed={formData?.breed}
          onBack={() => setPage('home')}
          onReview={() => setPage('review')}
        />
      )}
      {page === 'review' && (
        <Review onBack={() => setPage('result')} resultData={resultData} />
      )}
    </div>
  );
}

export default App;