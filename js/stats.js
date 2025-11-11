// Minimal Monkeytype-style stats page logic
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('minimal-wpm-chart')) return;

  const tracker = new PerformanceTracker();
  const sessions = tracker.sessionData;
  const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;

  // WPM and ACC
  document.getElementById('minimal-wpm').textContent = lastSession ? Math.round(lastSession.finalWpm) : '0';
  document.getElementById('minimal-acc').textContent = lastSession ? Math.round(lastSession.finalAccuracy) + '%' : '0%';

  // Test type
  let testType = '';
  if (lastSession) {
    testType = `time ${lastSession.testLength || 15}\n${lastSession.language || 'python'}\n${lastSession.punctuation ? 'punctuation' : ''}\n${lastSession.numbers ? 'numbers' : ''}`;
  }
  document.getElementById('minimal-testtype').textContent = testType.trim();

  // WPM graph (last 15 sessions)
  const chartCtx = document.getElementById('minimal-wpm-chart').getContext('2d');
  const wpmData = sessions.slice(-15);
  const chartData = {
    labels: wpmData.map((_, i) => (i + 1).toString()),
    datasets: [{
      label: 'WPM',
      data: wpmData.map(s => s.finalWpm),
      borderColor: '#e2b714',
      backgroundColor: 'rgba(226,183,20,0.08)',
      borderWidth: 3,
      fill: false,
      tension: 0.35,
      pointBackgroundColor: '#e2b714',
      pointBorderColor: '#232427',
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };
  const chartConfig = {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(100,102,105,0.18)' },
          ticks: { color: '#646669', font: { family: 'Fira Code', size: 14 } }
        },
        x: {
          grid: { color: 'rgba(100,102,105,0.12)' },
          ticks: { color: '#646669', font: { family: 'Fira Code', size: 14 } }
        }
      },
      elements: {
        point: {
          hoverBackgroundColor: '#e2b714',
          hoverBorderColor: '#d1d0c5'
        }
      }
    }
  };
  new Chart(chartCtx, chartConfig);

  // Bottom stats: raw, characters, time
  if (lastSession) {
    document.getElementById('minimal-raw').textContent = `raw ${Math.round(lastSession.rawWpm || lastSession.finalWpm || 0)}`;
    // characters: correct/incorrect/missed/extra
    const chars = lastSession.characters || { correct: 0, incorrect: 0, missed: 0, extra: 0 };
    document.getElementById('minimal-characters').textContent = `characters ${chars.correct || 0}/${chars.incorrect || 0}/${chars.missed || 0}/${chars.extra || 0}`;
    // time
    document.getElementById('minimal-time').textContent = `time ${lastSession.testLength || 15}s`;
  } else {
    document.getElementById('minimal-raw').textContent = 'raw 0';
    document.getElementById('minimal-characters').textContent = 'characters 0/0/0/0';
    document.getElementById('minimal-time').textContent = 'time 0s';
  }
});