import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ExpenseChart({ data, title }) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Expenses',
        data: Object.values(data),
        backgroundColor: 'rgba(97, 218, 251, 0.5)',
        borderColor: 'rgba(97, 218, 251, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        color: 'white',
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'white',
          callback: (value) => `£${value}`
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default ExpenseChart;