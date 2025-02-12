import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const getCurrentMonth = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="App-header">
      <div className="dashboard-header">
        <div className="dashboard-title">
          Expense Tracker Dashboard
        </div>
      </div>

      <div className="overview-card">
        <h2>Current Month: {getCurrentMonth()}</h2>
        <button 
          onClick={() => navigate(`/month/${getCurrentMonth().toLowerCase()}`)}
          className="current-month-button"
        >
          View Current Month
        </button>
      </div>

      <div className="months-grid-container">
        <h2>Select Month</h2>
        <div className="months-grid">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => navigate(`/month/${month.toLowerCase()}`)}
              className="month-card"
            >
              <span className="month-name">{month}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;