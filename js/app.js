/**
 * Crop Health Dashboard - app logic
 * -----------------------------------
 * Wires up:
 *  - Date selector -> updates stat cards + NDVI map image
 *  - NDVI trend chart (Chart.js)
 *  - Advisory button (placeholder - extend with real logic)
 */

let trendChart;

function formatNdvi(value) {
  return value === null || value === undefined ? "--" : value.toFixed(3);
}

function formatPct(value) {
  return value === null || value === undefined ? "--" : value.toFixed(1) + "%";
}

function getDateEntry(dateStr) {
  return ndviData.dates.find((d) => d.date === dateStr);
}

function updateStatsForDate(dateStr) {
  const entry = getDateEntry(dateStr);
  if (!entry) return;

  document.getElementById("statAvgNdvi").textContent = formatNdvi(entry.meanNdvi);
  document.getElementById("statHealthy").textContent = formatPct(entry.healthyPct);
  document.getElementById("statStressed").textContent = formatPct(entry.stressedPct);

  // Trend vs previous date
  const idx = ndviData.dates.findIndex((d) => d.date === dateStr);
  const trendEl = document.getElementById("statTrend");
  if (idx > 0) {
    const diff = entry.meanNdvi - ndviData.dates[idx - 1].meanNdvi;
    const sign = diff >= 0 ? "+" : "";
    trendEl.textContent = sign + diff.toFixed(3);
    trendEl.className = "stat-value " + (diff >= 0 ? "positive" : "negative");
  } else {
    trendEl.textContent = "--";
    trendEl.className = "stat-value";
  }

  // Update map image
  const mapImg = document.getElementById("ndviMap");
  mapImg.src = entry.mapImage;
  mapImg.alt = "NDVI map for " + entry.label;
}

function buildTrendChart() {
  const ctx = document.getElementById("trendChart");
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const textColor = isDark ? "#B4B2A9" : "#5F5E5A";

  const labels = ndviData.dates.map((d) => d.label);
  const values = ndviData.dates.map((d) => d.meanNdvi);

  trendChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Mean NDVI",
          data: values,
          borderColor: "#1D9E75",
          backgroundColor: "rgba(29,158,117,0.1)",
          fill: true,
          tension: 0.3,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          ticks: { color: textColor, font: { size: 11 } },
          grid: { color: gridColor }
        },
        x: {
          ticks: { color: textColor, font: { size: 11 } },
          grid: { display: false }
        }
      }
    }
  });
}

function setupChangeMapBadge() {
  const badge = document.querySelector(".badge");
  if (!badge) return;
  const cm = ndviData.changeMap;
  badge.textContent = `${cm.decreasedPct}% decreased, ${cm.increasedPct}% increased`;
}

function setupAdvisoryButton() {
  const btn = document.getElementById("advisoryBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    // Placeholder logic - replace with real advisory rules based on
    // NDVI thresholds + soil moisture data once available.
    const text = document.getElementById("advisoryText");
    text.textContent =
      "Advisory generation is not yet connected to live rules. " +
      "Next step: combine NDVI zones with soil moisture data " +
      "(e.g. Sentinel-1) to flag specific fields for irrigation.";
  });
}

function init() {
  const dateSelect = document.getElementById("dateSelect");

  buildTrendChart();
  updateStatsForDate(dateSelect.value);
  setupChangeMapBadge();
  setupAdvisoryButton();

  dateSelect.addEventListener("change", (e) => {
    updateStatsForDate(e.target.value);
  });

  // Register service worker for PWA offline support
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch((err) => {
        console.log("Service worker registration failed:", err);
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
