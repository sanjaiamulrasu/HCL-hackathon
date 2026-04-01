import { Routes, Route } from 'react-router-dom';
import LandingPage from './routes/LandingPage';
import LoginPage from './routes/LoginPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
