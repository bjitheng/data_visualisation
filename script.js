document.addEventListener('DOMContentLoaded', () => {
  const currentPage = document.body.dataset.page;
  const yearTarget = document.getElementById('year');

  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  const chartData = [
    { label: 'LED', value: 95, color: '#f6a33d' },
    { label: 'QLED', value: 160, color: '#d9821f' },
    { label: 'OLED', value: 125, color: '#b9822b' },
    { label: 'Eco', value: 72, color: '#3a2413' }
  ];

  const chartTarget = document.getElementById('energyChart');
  if (chartTarget) {
    const svgWidth = 640;
    const svgHeight = 360;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;
    const maxValue = 180;
    const barWidth = (chartWidth / chartData.length) * 0.58;
    const gap = (chartWidth / chartData.length) * 0.42;

    let svgMarkup = `
      <title>Estimated yearly energy use by display type</title>
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f6a33d" />
          <stop offset="100%" stop-color="#d9821f" />
        </linearGradient>
      </defs>
      <text x="320" y="18" text-anchor="middle" font-size="16" font-weight="700" fill="#3a2413">Estimated yearly energy use (kWh)</text>
    `;

    for (let tick = 0; tick <= 180; tick += 45) {
      const y = margin.top + chartHeight - (tick / maxValue) * chartHeight;
      svgMarkup += `
        <line class="grid-line" x1="${margin.left}" y1="${y}" x2="${svgWidth - margin.right}" y2="${y}" />
        <text class="axis-label" x="${margin.left - 12}" y="${y + 4}" text-anchor="end">${tick}</text>
      `;
    }

    svgMarkup += `<line class="axis-line" x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${svgHeight - margin.bottom}" />`;
    svgMarkup += `<line class="axis-line" x1="${margin.left}" y1="${svgHeight - margin.bottom}" x2="${svgWidth - margin.right}" y2="${svgHeight - margin.bottom}" />`;

    chartData.forEach((item, index) => {
      const x = margin.left + index * (barWidth + gap) + gap / 2;
      const barHeight = (item.value / maxValue) * chartHeight;
      const y = margin.top + chartHeight - barHeight;

      svgMarkup += `
        <rect class="bar" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="10" fill="${item.color}" />
        <text class="value-label" x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle">${item.value} kWh</text>
        <text class="bar-label" x="${x + barWidth / 2}" y="${svgHeight - margin.bottom + 24}" text-anchor="middle">${item.label}</text>
      `;
    });

    chartTarget.innerHTML = svgMarkup;
  }

  const pieTarget = document.getElementById('energyPieChart');
  if (pieTarget) {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    const svgWidth = 500;
    const svgHeight = 360;
    const cx = 150;
    const cy = 180;
    const radius = 110;
    let startAngle = 0;
    let pieMarkup = '<title>Share of annual energy use by display type</title><text x="250" y="28" text-anchor="middle" font-size="16" font-weight="700" fill="#3a2413">Share of annual energy use</text>';

    chartData.forEach((item) => {
      const angleSize = (item.value / total) * 360;
      const endAngle = startAngle + angleSize;
      const startRadians = (Math.PI / 180) * (startAngle - 90);
      const endRadians = (Math.PI / 180) * (endAngle - 90);
      const x1 = cx + radius * Math.cos(startRadians);
      const y1 = cy + radius * Math.sin(startRadians);
      const x2 = cx + radius * Math.cos(endRadians);
      const y2 = cy + radius * Math.sin(endRadians);
      const largeArcFlag = angleSize > 180 ? 1 : 0;

      const pathData = [
        `M ${cx} ${cy}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      pieMarkup += `<path d="${pathData}" fill="${item.color}" stroke="#fffaf0" stroke-width="2" />`;
      startAngle = endAngle;
    });

    pieMarkup += `<circle cx="${cx}" cy="${cy}" r="55" fill="#fffaf0" />`;
    pieMarkup += `<text x="${cx}" y="${cy - 8}" text-anchor="middle" font-size="28" font-weight="700" fill="#3a2413">${total}</text>`;
    pieMarkup += `<text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12" fill="#5a3820">kWh</text>`;

    const legendItems = chartData.map((item, index) => {
      const percent = Math.round((item.value / total) * 100);
      return `
        <g transform="translate(0 ${index * 22})">
          <rect x="0" y="0" width="12" height="12" rx="3" fill="${item.color}" />
          <text x="20" y="11" font-size="11" fill="#3a2413">${item.label} (${percent}%)</text>
        </g>
      `;
    }).join('');

    pieMarkup += `<g transform="translate(285 110)">${legendItems}</g>`;
    pieTarget.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    pieTarget.innerHTML = pieMarkup;
  }

  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    const isCurrent = link.dataset.page === currentPage;
    if (isCurrent) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  const actionButtons = document.querySelectorAll('[data-target]');
  actionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      if (target) {
        window.location.href = target;
      }
    });
  });
});
