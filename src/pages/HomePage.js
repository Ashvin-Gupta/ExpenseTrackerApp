import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  return (
    <div className="home-page">
      <header className="App-header">
        <h1>Expense Tracker</h1>
        <p>Select a month to view or add expenses</p>
        <div className="month-grid">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => navigate(`/month/${month.toLowerCase()}`)}
              className="month-button"
            >
              {month}
            </button>
          ))}
        </div>
      </header>
    </div>
  );
}

export default HomePage;