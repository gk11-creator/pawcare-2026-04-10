import { useState } from 'react';
import Home from './pages/Home';
import Result from './pages/Result';
import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [resultData, setResultData] = useState(null);

  return (
    <div className="app">
      {page === 'home' ? (
        <Home onResult={(data) => { setResultData(data); setPage('result'); }} />
      ) : (
        <Result data={resultData} onBack={() => setPage('home')} />
      )}
    </div>
  );
}

export default App;