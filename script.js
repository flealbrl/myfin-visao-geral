const cashFlowData = {
  labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  entradas: [12400, 13800, 15200, 14100, 16800, 18250, 17400, 19500, 21300, 22400, 24100, 26580],
  saidas: [8200, 9100, 9700, 10500, 11200, 10880, 11800, 12100, 12700, 13100, 13900, 14250]
};

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebarClose = document.getElementById("sidebar-close");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");

  if (sidebar && sidebarToggle && sidebarClose && sidebarBackdrop) {
    const openSidebar = () => {
      sidebar.classList.remove("-translate-x-full");
      sidebarBackdrop.classList.remove("hidden");
    };

    const closeSidebar = () => {
      sidebar.classList.add("-translate-x-full");
      sidebarBackdrop.classList.add("hidden");
    };

    sidebarToggle.addEventListener("click", openSidebar);
    sidebarClose.addEventListener("click", closeSidebar);
    sidebarBackdrop.addEventListener("click", closeSidebar);

    const sidebarLinks = sidebar.querySelectorAll("nav a");
    sidebarLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 1024) {
          closeSidebar();
        }
      });
    });
  }

  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      navItems.forEach(nav => nav.classList.remove("bg-sidebar-accent", "text-white"));
      navItems.forEach(nav => {
        if (nav !== item) {
          nav.classList.add("text-sidebar-foreground/75", "hover:bg-sidebar-accent/60", "hover:text-white");
        }
      });
      item.classList.remove("text-sidebar-foreground/75", "hover:bg-sidebar-accent/60", "hover:text-white");
      item.classList.add("bg-sidebar-accent", "text-white");
      
      const indicator = document.querySelector(".nav-indicator");
      if (indicator) {
        item.appendChild(indicator);
      }
    });
  });

  const rangeButtons = document.querySelectorAll(".range-btn");
  rangeButtons.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      rangeButtons.forEach(b => {
        b.className = "range-btn rounded-lg px-3 py-1.5 text-xs font-semibold transition-smooth border border-border bg-card text-muted-foreground hover:text-foreground";
      });
      btn.className = "range-btn rounded-lg px-3 py-1.5 text-xs font-semibold transition-smooth bg-foreground text-background shadow-soft";
    });
  });

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      updateChartsTheme();
    });
  }

  const cashFlowCtx = document.getElementById("cashFlowChart").getContext("2d");
  
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#165EA1';
  const tealColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-teal').trim() || '#1FB8A5';

  let gIn = cashFlowCtx.createLinearGradient(0, 0, 0, 300);
  gIn.addColorStop(0, 'rgba(22, 94, 161, 0.35)');
  gIn.addColorStop(1, 'rgba(22, 94, 161, 0)');

  let gOut = cashFlowCtx.createLinearGradient(0, 0, 0, 300);
  gOut.addColorStop(0, 'rgba(31, 184, 165, 0.3)');
  gOut.addColorStop(1, 'rgba(31, 184, 165, 0)');

  const isDark = () => document.documentElement.classList.contains("dark");

  const getGridColor = () => isDark() ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)';
  const getTextColor = () => isDark() ? '#94A3B8' : '#64748B';

  let flowChart = new Chart(cashFlowCtx, {
    type: 'line',
    data: {
      labels: cashFlowData.labels,
      datasets: [
        {
          label: 'Entradas',
          data: cashFlowData.entradas,
          borderColor: '#165EA1',
          borderWidth: 2.5,
          backgroundColor: gIn,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#165EA1',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        },
        {
          label: 'Saídas',
          data: cashFlowData.saidas,
          borderColor: '#1FB8A5',
          borderWidth: 2.5,
          backgroundColor: gOut,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#1FB8A5',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          padding: 12,
          backgroundColor: isDark() ? '#1E293B' : '#ffffff',
          titleColor: isDark() ? '#f8fafc' : '#0f172a',
          bodyColor: isDark() ? '#cbd5e1' : '#334155',
          borderColor: isDark() ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 1)',
          borderWidth: 1,
          borderRadius: 12,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: getTextColor(),
            font: {
              family: 'Inter',
              size: 11
            }
          }
        },
        y: {
          grid: {
            color: getGridColor(),
            drawBorder: false
          },
          ticks: {
            color: getTextColor(),
            font: {
              family: 'Inter',
              size: 11
            },
            callback: function(value) {
              return value >= 1000 ? `R$ ${(value / 1000).toFixed(1)}k` : `R$ ${value}`;
            }
          }
        }
      }
    }
  });

  const categoryCtx = document.getElementById("categoryChart").getContext("2d");
  let categoryChart = new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
      labels: ["Moradia", "Alimentação", "Transporte", "Lazer", "Outros"],
      datasets: [{
        data: [3850, 1920, 980, 720, 1430],
        backgroundColor: [
          '#165EA1',
          '#1FB8A5',
          '#1aa2ec',
          'rgba(236, 72, 153, 0.85)',
          '#f59e0b'
        ],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          padding: 10,
          backgroundColor: isDark() ? '#1E293B' : '#ffffff',
          titleColor: isDark() ? '#f8fafc' : '#0f172a',
          bodyColor: isDark() ? '#cbd5e1' : '#334155',
          borderColor: isDark() ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 1)',
          borderWidth: 1,
          borderRadius: 8,
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: R$ ${value.toLocaleString('pt-BR')} (${percentage}%)`;
            }
          }
        }
      }
    }
  });

  function updateChartsTheme() {
    const textCol = getTextColor();
    const gridCol = getGridColor();
    const tooltipBg = isDark() ? '#1E293B' : '#ffffff';
    const tooltipBorder = isDark() ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 1)';
    const tooltipTitle = isDark() ? '#f8fafc' : '#0f172a';
    const tooltipBody = isDark() ? '#cbd5e1' : '#334155';

    flowChart.options.scales.x.ticks.color = textCol;
    flowChart.options.scales.y.ticks.color = textCol;
    flowChart.options.scales.y.grid.color = gridCol;
    flowChart.options.plugins.tooltip.backgroundColor = tooltipBg;
    flowChart.options.plugins.tooltip.borderColor = tooltipBorder;
    flowChart.options.plugins.tooltip.titleColor = tooltipTitle;
    flowChart.options.plugins.tooltip.bodyColor = tooltipBody;
    flowChart.update();

    categoryChart.options.plugins.tooltip.backgroundColor = tooltipBg;
    categoryChart.options.plugins.tooltip.borderColor = tooltipBorder;
    categoryChart.options.plugins.tooltip.titleColor = tooltipTitle;
    categoryChart.options.plugins.tooltip.bodyColor = tooltipBody;
    categoryChart.update();
  }
});
