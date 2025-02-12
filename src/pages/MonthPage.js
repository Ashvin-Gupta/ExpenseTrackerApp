import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ExpenseChart from '../components/ExpenseChart';

function MonthPage() {
  const { monthName } = useParams();
  const navigate = useNavigate();

  // Function to get weeks for the given month
  const getWeeksInMonth = () => {
    const currentYear = new Date().getFullYear();
    const monthIndex = new Date(`${monthName} 1`).getMonth();
    
    // Create a date for the first day of the month
    const firstDay = new Date(currentYear, monthIndex, 1);
    // Create a date for the last day of the month
    const lastDay = new Date(currentYear, monthIndex + 1, 0);
    
    // Get the week numbers
    const weeks = [];
    let currentDate = firstDay;

    while (currentDate <= lastDay) {
      // Get ISO week number (1-53)
      const weekNumber = getWeekNumber(currentDate);
      if (!weeks.includes(weekNumber)) {
        weeks.push(weekNumber);
      }
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return weeks;
  };

  // Function to get ISO week number
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  // Get the weeks for this month
  const weeks = getWeeksInMonth();

  const [monthlyData, setMonthlyData] = useState(() => {
    const savedData = localStorage.getItem(`monthlyData-${monthName}`);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      wages: '',
      miscIncome: '',
      rent: '',
      utilities: '',
      debts: '',
    };
  });

  useEffect(() => {
    localStorage.setItem(`monthlyData-${monthName}`, JSON.stringify(monthlyData));
  }, [monthlyData, monthName]);

  const calculateMonthTotal = () => {
    let total = 0;
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

  const calculateTotalIncome = () => {
    return Number(monthlyData.wages || 0) + Number(monthlyData.miscIncome || 0);
  };

  const calculateFixedCosts = () => {
    return Number(monthlyData.rent || 0) + 
           Number(monthlyData.utilities || 0) + 
           Number(monthlyData.debts || 0);
  };

  const monthTotal = calculateMonthTotal();
  const totalIncome = calculateTotalIncome();
  const fixedCosts = calculateFixedCosts();

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

    // Add fixed costs as categories if they exist
    if (Number(monthlyData.rent) > 0) categoryTotals['Rent'] = Number(monthlyData.rent);
    if (Number(monthlyData.utilities) > 0) categoryTotals['Utilities'] = Number(monthlyData.utilities);
    if (Number(monthlyData.debts) > 0) categoryTotals['Debts'] = Number(monthlyData.debts);

    return categoryTotals;
  };

  // Function to get the date range for a week
  const getWeekDateRange = (weekNumber) => {
    const currentYear = new Date().getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const firstWeekDay = firstDayOfYear.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate the first day of the given week
    const firstDayOfWeek = new Date(currentYear, 0, 1 + (weekNumber - 1) * 7 - firstWeekDay + 1);
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

    return `${firstDayOfWeek.getDate()}/${firstDayOfWeek.getMonth() + 1} - ${lastDayOfWeek.getDate()}/${lastDayOfWeek.getMonth() + 1}`;
  };

  return (
    <div className="App-header">
      <div className="dashboard-header">
        <div className="dashboard-title">
          {monthName.charAt(0).toUpperCase() + monthName.slice(1)} Overview
        </div>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
      
      <div className="monthly-summary">
        <div className="monthly-sections-container">
          <div className="monthly-section">
            <h2>Monthly Income</h2>
            <div className="monthly-input-group">
              <label>
                Wages
                <input
                  type="number"
                  value={monthlyData.wages}
                  onChange={(e) => handleInputChange('wages', e.target.value)}
                  className="monthly-input"
                  placeholder="0.00"
                />
              </label>
            </div>
            <div className="monthly-input-group">
              <label>
                Miscellaneous
                <input
                  type="number"
                  value={monthlyData.miscIncome}
                  onChange={(e) => handleInputChange('miscIncome', e.target.value)}
                  className="monthly-input"
                  placeholder="0.00"
                />
              </label>
            </div>
          </div>

          <div className="monthly-section">
            <h2>Fixed Costs</h2>
            <div className="monthly-input-group">
              <label>
                Rent
                <input
                  type="number"
                  value={monthlyData.rent}
                  onChange={(e) => handleInputChange('rent', e.target.value)}
                  className="monthly-input"
                  placeholder="0.00"
                />
              </label>
            </div>
            <div className="monthly-input-group">
              <label>
                Utilities
                <input
                  type="number"
                  value={monthlyData.utilities}
                  onChange={(e) => handleInputChange('utilities', e.target.value)}
                  className="monthly-input"
                  placeholder="0.00"
                />
              </label>
            </div>
            <div className="monthly-input-group">
              <label>
                Debts
                <input
                  type="number"
                  value={monthlyData.debts}
                  onChange={(e) => handleInputChange('debts', e.target.value)}
                  className="monthly-input"
                  placeholder="0.00"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="monthly-totals">
          <p>Total Income <span>£{totalIncome.toFixed(2)}</span></p>
          <p>Fixed Costs <span>£{fixedCosts.toFixed(2)}</span></p>
          <p>Variable Expenses <span>£{monthTotal.toFixed(2)}</span></p>
          <p>Total Spending <span>£{(monthTotal + fixedCosts).toFixed(2)}</span></p>
          <p className="remaining-budget">
            Remaining Budget <span>£{(totalIncome - (monthTotal + fixedCosts)).toFixed(2)}</span>
          </p>
        </div>
      </div>

      <div className="chart-section">
        <ExpenseChart 
          data={getCategoryTotals()} 
          title={`Monthly Expenses for ${monthName}`}
        />
      </div>

      <div className="week-grid">
        {weeks.map((week) => (
          <button
            key={week}
            onClick={() => navigate(`/month/${monthName}/week/${week}`)}
            className="week-button"
          >
            Week {week}
            <div className="week-dates">{getWeekDateRange(week)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MonthPage;