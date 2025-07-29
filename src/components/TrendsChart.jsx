import React, { useState } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function TrendsChart({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('positions');

  // Get unique years sorted
  const years = [...new Set(data.map(player => player.Year))].sort((a, b) => a - b);

  // Position Trends Data
  const getPositionTrends = () => {
    const positions = ['P', 'SS', 'OF', 'C', '3B', '2B', '1B'];
    const datasets = positions.map((pos, index) => {
      const color = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(199, 199, 199, 0.8)',
      ][index];

      const data = years.map(year => {
        return data.filter(player => 
          player.Year === year && 
          (player.Position === pos || 
           (pos === 'OF' && ['OF', 'CF', 'RF', 'LF'].includes(player.Position)) ||
           (pos === 'P' && ['P', 'SP', 'RP'].includes(player.Position)))
        ).length;
      });

      return {
        label: pos,
        data: data,
        backgroundColor: color,
        borderColor: color.replace('0.8', '1'),
        borderWidth: 2,
      };
    });

    return {
      labels: years,
      datasets: datasets
    };
  };

  // School Type Trends Data
  const getSchoolTypeTrends = () => {
    const collegeData = years.map(year => {
      return data.filter(player => 
        player.Year === year && 
        player.School && 
        !player.School.includes('HS')
      ).length;
    });

    const hsData = years.map(year => {
      return data.filter(player => 
        player.Year === year && 
        player.School && 
        player.School.includes('HS')
      ).length;
    });

    return {
      labels: years,
      datasets: [
        {
          label: 'College',
          data: collegeData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.4,
        },
        {
          label: 'High School',
          data: hsData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4,
        }
      ]
    };
  };

  // Bonus Trends Data
  const getBonusTrends = () => {
    const parseBonus = (bonusStr) => {
      if (!bonusStr || bonusStr === '-' || bonusStr === '(unsigned)' || bonusStr === '') {
        return 0;
      }
      const cleanStr = bonusStr.replace(/[$,]/g, '');
      return parseFloat(cleanStr) || 0;
    };

    const avgBonusByYear = years.map(year => {
      const yearData = data.filter(player => player.Year === year);
      const bonuses = yearData.map(player => parseBonus(player.SignedBonus)).filter(b => b > 0);
      return bonuses.length > 0 ? bonuses.reduce((a, b) => a + b, 0) / bonuses.length : 0;
    });

    return {
      labels: years,
      datasets: [{
        label: 'Average Signing Bonus ($)',
        data: avgBonusByYear,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        yAxisID: 'y',
      }]
    };
  };

  // Top Schools Data
  const getTopSchools = () => {
    const schoolCounts = {};
    
    data.forEach(player => {
      if (player.School && !player.School.includes('HS')) {
        const school = player.School.split('\n')[0].trim(); // Get first line of school name
        schoolCounts[school] = (schoolCounts[school] || 0) + 1;
      }
    });

    const topSchools = Object.entries(schoolCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    return {
      labels: topSchools.map(([school]) => school),
      datasets: [{
        label: 'Number of Draftees',
        data: topSchools.map(([, count]) => count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
        ],
        borderWidth: 1,
      }]
    };
  };

  const chartData = {
    positions: getPositionTrends(),
    schoolType: getSchoolTypeTrends(),
    bonus: getBonusTrends(),
    schools: getTopSchools(),
  };

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  const bonusOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        ticks: {
          ...commonOptions.scales.y.ticks,
          callback: function(value) {
            return '$' + (value / 1000000).toFixed(1) + 'M';
          }
        }
      }
    }
  };

  const renderChart = () => {
    switch (activeTab) {
      case 'positions':
        return <Bar data={chartData.positions} options={commonOptions} />;
      case 'schoolType':
        return <Line data={chartData.schoolType} options={commonOptions} />;
      case 'bonus':
        return <Line data={chartData.bonus} options={bonusOptions} />;
      case 'schools':
        return <Bar data={chartData.schools} options={commonOptions} />;
      default:
        return <Bar data={chartData.positions} options={commonOptions} />;
    }
  };

  const tabs = [
    { id: 'positions', label: 'Position Trends', icon: '📊' },
    { id: 'schoolType', label: 'School Type', icon: '🎓' },
    { id: 'bonus', label: 'Bonus Trends', icon: '💰' },
    { id: 'schools', label: 'Top Schools', icon: '🏫' },
  ];

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
        Draft Trends Dashboard
        {!isExpanded && ` (${data.length} players)`}
      </button>
      
      {isExpanded && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1.5rem', 
          background: '#1a1a1a', 
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          {/* Tab Navigation */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? '#555' : '#333',
                  color: '#fff',
                  border: '1px solid #555',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Chart Container */}
          <div style={{ height: '400px', position: 'relative' }}>
            {renderChart()}
          </div>

          {/* Chart Description */}
          <div style={{ 
            marginTop: '1rem', 
            fontSize: '0.9rem', 
            color: '#ccc',
            textAlign: 'center'
          }}>
            {activeTab === 'positions' && 'Shows position breakdown by year'}
            {activeTab === 'schoolType' && 'Shows HS vs College trends over time'}
            {activeTab === 'bonus' && 'Shows average signing bonus trends'}
            {activeTab === 'schools' && 'Shows top schools by number of draftees'}
          </div>
        </div>
      )}
    </div>
  );
}

export default TrendsChart; 