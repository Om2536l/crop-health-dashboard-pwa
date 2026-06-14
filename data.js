/**
 * NDVI Dataset
 * -------------
 * Replace or extend this data as you add more dates / fields / regions.
 * Values here are computed from Sentinel-2 B04 (Red) and B08 (NIR) bands
 * using NDVI = (NIR - Red) / (NIR + Red).
 *
 * To add a new date:
 *  1. Run timeseries_ndvi.py on the new data to get its mean NDVI and
 *     classification breakdown.
 *  2. Add a new entry to `ndviData.dates` below.
 *  3. Add the corresponding map image to images/ and reference it in `mapImage`.
 */

const ndviData = {
  region: "Maharashtra farmland (sample AOI)",
  dates: [
    {
      date: "2026-03-29",
      label: "Mar 29, 2026",
      meanNdvi: 0.345,
      healthyPct: null,      // fill in if computed for this date
      stressedPct: null,
      mapImage: "images/ndvi_2026-03-29.png"
    },
    {
      date: "2026-04-28",
      label: "Apr 28, 2026",
      meanNdvi: 0.287,
      healthyPct: 9.8,
      stressedPct: 36.1,
      mapImage: "images/ndvi_2026-04-28.png"
    },
    {
      date: "2026-06-02",
      label: "Jun 02, 2026",
      meanNdvi: 0.304,
      healthyPct: null,
      stressedPct: null,
      mapImage: "images/ndvi_2026-06-02.png"
    }
  ],
  // Change map between first and last date in `dates`
  changeMap: {
    image: "images/ndvi_difference.png",
    increasedPct: 19.8,
    decreasedPct: 45.8,
    stablePct: 34.4,
    fromDate: "2026-03-29",
    toDate: "2026-06-02"
  }
};
