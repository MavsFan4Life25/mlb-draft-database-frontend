import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BonusChart({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse bonus amounts and categorize them
  const parseBonus = (bonusStr) => {
    if (!bonusStr || bonusStr === '-' || bonusStr === '(unsigned)' || bonusStr === '') {
      return 0;
    }
    // Remove $ and commas, convert to number
    const cleanStr = bonusStr.replace(/[$,]/g, '');
    return parseFloat(cleanStr) || 0;
  };

  // Categorize bonuses into ranges
  const categorizeBonus = (amount) => {
    if (amount === 0) return 'No Bonus';
    if (amount <= 10000) return '$0-10K';
    if (amount <= 50000) return '$10K-50K';
    if (amount <= 100000) return '$50K-100K';
    if (amount <= 300000) return '$100K-300K';
    return '$300K+';
  };

  // Process data to get bonus distribution
  const getBonusDistribution = () => {
    const categories = ['No Bonus', '$0-10K', '$10K-50K', '$50K-100K', '$100K-300K', '$300K+'];
    const distribution = categories.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {});

    data.forEach(player => {
      const bonusAmount = parseBonus(player.SignedBonus);
      const category = categorizeBonus(bonusAmount);
      distribution[category]++;
    });

    return {
      labels: categories,
      datasets: [{
        label: 'Number of Players',
        data: categories.map(cat => distribution[cat]),
        backgroundColor: [
          'rgba(128, 128, 128, 0.8)',  // No Bonus - gray
          'rgba(255, 99, 132, 0.8)',   // $0-10K - pink
          'rgba(54, 162, 235, 0.8)',   // $10K-50K - blue
          'rgba(255, 206, 86, 0.8)',   // $50K-100K - yellow
          'rgba(75, 192, 192, 0.8)',   // $100K-300K - teal
          'rgba(153, 102, 255, 0.8)',  // $300K+ - purple
        ],
        borderColor: [
          'rgba(128, 128, 128, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      }]
    };
  };

  const chartData = getBonusDistribution();
  const totalPlayers = data.length;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Signing Bonus Distribution (${totalPlayers} players)`,
        color: '#fff',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            const percentage = ((value / totalPlayers) * 100).toFixed(1);
            return `${value} players (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#fff',
          stepSize: 1
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: '#333',
          color: '#fff',
          border: '1px solid #555',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s ease'
        }}
      >
        {isExpanded ? '▼' : '▶'} 
        Bonus Distribution Chart
        {!isExpanded && ` (${totalPlayers} players)`}
      </button>
      
      {isExpanded && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1.5rem', 
          background: '#1a1a1a', 
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <div style={{ height: '400px', position: 'relative' }}>
            <Bar data={chartData} options={options} />
          </div>
          <div style={{ 
            marginTop: '1rem', 
            fontSize: '0.9rem', 
            color: '#ccc',
            textAlign: 'center'
          }}>
            Hover over bars to see exact counts and percentages
          </div>
        </div>
      )}
    </div>
  );
}

export default BonusChart; 