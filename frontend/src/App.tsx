import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';

import LoginPage from './pages/Login';
import SignupPage from './pages/Register';
import HomePage from './pages/Home';
import UserUrlsPage from './pages/UserUrlsList';

const App = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={accessToken ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!accessToken ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!accessToken ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/my-urls" element={accessToken ? <UserUrlsPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<h2>404 | Page Not Found</h2>} />
      </Routes>
    </Router>
  );
};

export default App;
