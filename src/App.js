import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

function App() {
  const [chartData, setChartData] = useState({ labels: [], data: [] });

  // Due this error :Canvas is already in use. Chart with ID '0' must be destroyed before the canvas with ID 'newsChart' can be reused.
  //Created chartInstance state to Destroy
  const [chartInstance, setChartInstance] = useState(null);


  useEffect(() => {
    const url = 'https://random-words5.p.rapidapi.com/getMultipleRandom?count=5';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '5e98f7eeeamsh1044ace0b97a9e2p1db966jsn544242e6611b',
        'x-rapidapi-host': 'random-words5.p.rapidapi.com'
      }
    };

    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log("result", result)

        const labels = result;
        const data = labels.map(() => Math.floor(Math.random() * 10) + 1);

        setChartData({ labels, data });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // refreshes data every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);



  useEffect(() => {
    if (chartData.labels.length > 0) {
      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = document.getElementById('newsChart').getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Random Data',
            data: chartData.data,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            fill: true,
            tension: 0.1
          }]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Random Words'
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Random Values'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Random Data Over Time'
            }
          }
        }
      });

      setChartInstance(chart);
    }
  }, [chartData]);

  return (
    <div>
      <canvas id="newsChart" width="800" height="400"></canvas>
    </div>
  );
}

export default App;