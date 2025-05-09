import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '@/context/AuthProvider';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const YearlyPriceTrendChart = ({ data }) => {
  const { currency } = useAuth();
  const years = data.map(item => item.year);
  const prices = data.map(item => parseFloat(item.avg_price_per_sqft));

  const chartData = {
    labels: years,
    datasets: [
      {
        label: `Average Price  (${currency})`,
        data: prices,
        fill: false,
        borderColor: '#007bff',
        backgroundColor: '#007bff',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: {
        title: { display: true, text: `${currency}` },
        beginAtZero: false,
      },
      x: {
        title: { display: true, text: 'Year' },
      },
    },
  };

  console.log("currency", currency)
  return (
    <div className="container my-4">
      <div className="card shadow-sm" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Yearly Price Trend - {data[0]?.locality_name}</h5>
          <div style={{ height: '350px' }}>
            <Line data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyPriceTrendChart;
