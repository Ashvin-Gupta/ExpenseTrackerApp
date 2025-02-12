import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import MonthPage from './pages/MonthPage';
import WeekPage from './pages/WeekPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/month/:monthName" element={<MonthPage />} />
          <Route path="/month/:monthName/week/:weekNumber" element={<WeekPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
