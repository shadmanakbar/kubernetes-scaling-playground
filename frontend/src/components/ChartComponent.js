import React from 'react';
import { Line } from 'react-chartjs-2';

const ChartComponent = ({ title, data, labels, color, yAxisMax = 100, isDarkMode }) => {
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: title,
        font: {
          size: 16
        },
        color: isDarkMode ? '#ffffff' : '#2c3e50'
      },
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: yAxisMax,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? '#ffffff' : '#666666'
        },
        title: {
          display: true,
          text: title.includes('Pod') ? 'Number of Pods' : 'Percentage (%)',
          color: isDarkMode ? '#ffffff' : '#666666'
        }
      },
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? '#ffffff' : '#666666'
        },
        title: {
          display: true,
          text: 'Time',
          color: isDarkMode ? '#ffffff' : '#666666'
        }
      }
    }
  };

  return (
    <div className="chart-wrapper">
      <Line data={{
        labels,
        datasets: [{
          label: title,
          data: data,
          borderColor: color,
          tension: 0.1,
          fill: false
        }]
      }} options={options} />
    </div>
  );
};

export default ChartComponent; 