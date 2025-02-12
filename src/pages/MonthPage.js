import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ExpenseChart from '../components/ExpenseChart';

function MonthPage() {
  const { monthName } = useParams();
  const navigate = useNavigate();
  const weeks = [1, 2, 3, 4, 5];

  const [monthlyData, setMonthlyData] = useState(() => {
    const savedData = localStorage.getItem(`monthlyData-${monthName}`);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      rent: '',
      income: '',
    };
  });

  useEffect(() => {
    localStorage.setItem(`monthlyData-${monthName}`, JSON.stringify(monthlyData));
  }, [monthlyData, monthName]);

  const calculateMonthTotal = () => {
    let total = 0;
    // Sum up all weeks
    weeks.forEach(week => {
      const weekData = localStorage.getItem(`expenses-${monthName}-${week}`);
      if (weekData) {
        const expenses = JSON.parse(weekData);
        Object.values(expenses).forEach(category => {
          Object.values(category).forEach(value => {
            total += Number(value) || 0;
          });
        });
      }
    });
    return total;
  };

  const handleInputChange = (field, value) => {
    setMonthlyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const monthTotal = calculateMonthTotal();

  const getCategoryTotals = () => {
    const categoryTotals = {};
    
    weeks.forEach(week => {
      const weekData = localStorage.getItem(`expenses-${monthName}-${week}`);
      if (weekData) {
        const expenses = JSON.parse(weekData);
        Object.entries(expenses).forEach(([category, dayValues]) => {
          const categoryTotal = Object.values(dayValues).reduce((sum, value) => 
            sum + (Number(value) || 0), 0);
          categoryTotals[category] = (categoryTotals[category] || 0) + categoryTotal;
        });
      }
    });

    // Add rent as a category if it exists
    if (Number(monthlyData.rent) > 0) {
      categoryTotals['Rent'] = Number(monthlyData.rent);
    }

    return categoryTotals;
  };

  return (
    <div className="App-header">
      <h1>{monthName.charAt(0).toUpperCase() + monthName.slice(1)} Expenses</h1>
      
      <div className="chart-section">
        <ExpenseChart 
          data={getCategoryTotals()} 
          title={`Monthly Expenses for ${monthName}`}
        />
      </div>

      <div className="monthly-summary">
        <div className="monthly-input-group">
          <label>
            Monthly Income:
            <input
              type="number"
              value={monthlyData.income}
              onChange={(e) => handleInputChange('income', e.target.value)}
              className="monthly-input"
            />
          </label>
        </div>
        <div className="monthly-input-group">
          <label>
            Rent:
            <input
              type="number"
              value={monthlyData.rent}
              onChange={(e) => handleInputChange('rent', e.target.value)}
              className="monthly-input"
            />
          </label>
        </div>
        <div className="monthly-totals">
          <p>Total Expenses: £{monthTotal.toFixed(2)}</p>
          <p>Rent: £{Number(monthlyData.rent || 0).toFixed(2)}</p>
          <p>Total Spending: £{(monthTotal + Number(monthlyData.rent || 0)).toFixed(2)}</p>
          <p>Income: £{Number(monthlyData.income || 0).toFixed(2)}</p>
          <p className="remaining-budget">
            Remaining Budget: £{(Number(monthlyData.income || 0) - (monthTotal + Number(monthlyData.rent || 0))).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="week-grid">
        {weeks.map((week) => (
          <button
            key={week}
            onClick={() => navigate(`/month/${monthName}/week/${week}`)}
            className="week-button"
          >
            Week {week}
          </button>
        ))}
      </div>
      <button onClick={() => navigate('/')} className="back-button">
        Back to Home
      </button>
      {/* We'll add expense list and form here later */}
    </div>
  );
}

export default MonthPage;