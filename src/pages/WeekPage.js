import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ExpenseChart from '../components/ExpenseChart';

function WeekPage() {
  const { monthName, weekNumber } = useParams();
  const navigate = useNavigate();

  const categories = [
    'Travel', 'Groceries', 'Dining out', 'Phone', 'Sport',
    'Going out/pub', 'Vacations', 'Hair', 'Credit',
    'Subscriptions', 'Contacts', 'Personal'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Initialize expenses state with empty values
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem(`expenses-${monthName}-${weekNumber}`);
    if (savedExpenses) {
      return JSON.parse(savedExpenses);
    }
    return categories.reduce((acc, category) => {
      acc[category] = days.reduce((dayAcc, day) => {
        dayAcc[day] = '';
        return dayAcc;
      }, {});
      return acc;
    }, {});
  });

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`expenses-${monthName}-${weekNumber}`, JSON.stringify(expenses));
  }, [expenses, monthName, weekNumber]);

  const handleExpenseChange = (category, day, value) => {
    setExpenses(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [day]: value
      }
    }));
  };

  const calculateRowTotal = (category) => {
    return days.reduce((total, day) => {
      const value = Number(expenses[category][day]) || 0;
      return total + value;
    }, 0);
  };

  const calculateWeekTotal = () => {
    return categories.reduce((total, category) => {
      return total + calculateRowTotal(category);
    }, 0);
  };

  const getChartData = () => {
    const chartData = {};
    categories.forEach(category => {
      const total = calculateRowTotal(category);
      if (total > 0) { // Only include categories with expenses
        chartData[category] = total;
      }
    });
    return chartData;
  };

  return (
    <div className="App-header">
      <div className="dashboard-header">
        <div className="dashboard-title">
          {monthName.charAt(0).toUpperCase() + monthName.slice(1)} - Week {weekNumber}
        </div>
        <button onClick={() => navigate(`/month/${monthName}`)} className="back-button">
          Back to Month View
        </button>
      </div>

      <div className="chart-section">
        <ExpenseChart 
          data={getChartData()} 
          title={`Expenses for Week ${weekNumber}`}
        />
      </div>

      <div className="expense-table-container">
        <div className="expense-table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th className="category-column">Category</th>
                {days.map(day => (
                  <th key={day}>{day}</th>
                ))}
                <th className="total-column">Total</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category}>
                  <td className="category-column">{category}</td>
                  {days.map(day => (
                    <td key={day}>
                      <input
                        type="number"
                        value={expenses[category][day]}
                        onChange={(e) => handleExpenseChange(category, day, e.target.value)}
                        className="expense-input"
                        placeholder="0.00"
                      />
                    </td>
                  ))}
                  <td className="total-column">
                    £{calculateRowTotal(category).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="week-total-row">
                <td className="category-column">Week Total</td>
                <td colSpan={days.length} className="week-total-spacer"></td>
                <td className="total-column">£{calculateWeekTotal().toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default WeekPage;