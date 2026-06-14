# Crop Health Monitor (PWA)

A Progressive Web App dashboard for visualizing crop/vegetation health using
NDVI (Normalized Difference Vegetation Index) derived from Sentinel-2 satellite
data. Built as a starting point for an irrigation advisory system
(ISRO Bharatiya Antariksh Hackathon 2026, Theme 6).

---

## What's included

- **`index.html`** - main dashboard page (stat cards, NDVI maps, trend chart, advisory section)
- **`css/style.css`** - all styling, including dark mode support
- **`js/data.js`** - NDVI dataset (mean NDVI per date, classification %s, image paths) - **edit this to add more dates/regions**
- **`js/app.js`** - dashboard logic: date selector, chart rendering, advisory button
- **`images/`** - NDVI map PNGs generated from `ndvi_project` (per-date maps + change map)
- **`manifest.json`** - PWA manifest (installable app metadata)
- **`service-worker.js`** - basic offline caching
- **`icons/`** - placeholder app icons (replace with your own branding)

---

## How to run locally

Because this uses a service worker, it needs to be served over HTTP (not opened
as a `file://` path). From this folder, run:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

---

## How to customize

### Add a new date's NDVI data
1. Run your `timeseries_ndvi.py` script on new satellite data to get the mean
   NDVI and classification percentages.
2. Add the new map image to `images/`.
3. Add a new entry to the `dates` array in `js/data.js`:
   ```js
   {
     date: "2026-07-15",
     label: "Jul 15, 2026",
     meanNdvi: 0.41,
     healthyPct: 22.5,
     stressedPct: 18.0,
     mapImage: "images/ndvi_2026-07-15.png"
   }
   ```
4. Add the date as an `<option>` in the `#dateSelect` dropdown in `index.html`.

### Add irrigation advisory logic
The "Generate irrigation advisory" button (`#advisoryBtn` in `index.html`,
handled in `js/app.js`) currently shows a placeholder message. Replace
`setupAdvisoryButton()` in `js/app.js` with real rules, for example:

```js
if (meanNdvi < 0.2 && soilMoisture < threshold) {
  advisory = "Irrigation recommended for this zone.";
}
```

### Connect to Firebase / live data
Replace the static `ndviData` object in `js/data.js` with a fetch from your
Firebase backend (e.g. Firestore) once you have live data pipelines. The rest
of the dashboard (`app.js`) reads from `ndviData`, so as long as the shape of
the data stays the same, the UI will keep working.

### Branding
Replace `icons/icon-192.png` and `icons/icon-512.png` with your own logo
(e.g. Evronix branding), and update `manifest.json` name/colors as needed.

---

## Deploying

This is a static site - works as-is on:
- **Firebase Hosting** (`firebase deploy`)
- **GitHub Pages**
- Any static file host

---

## Data source

NDVI computed from Sentinel-2 L2A imagery (Bands B04/B08), downloaded via
Copernicus Browser (https://browser.dataspace.copernicus.eu). See the
`ndvi_project` repo for the processing scripts.
