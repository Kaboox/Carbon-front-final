import { useEffect, useState } from "react"
import { DailyMixChart } from "./components/DailyMixChart"
import { fetchDailyMix, fetchOptimalCharging } from "./api";
import type { ChargingWindow, DailyCarbonProfile } from "./types";
import { format } from "date-fns";

function App() {

  // Data for charts
  const [dailyData, setDailyData] = useState<DailyCarbonProfile[]>([]);

  // User's input
  const [hours, setHours] = useState<number>(3);

  // Result of calculating optimal charging window
  const [chargingResult, setChargingResult] = useState<ChargingWindow | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  // Fetch daily carbon profile data from backend api
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDailyMix();
        setDailyData(data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [])

  const handleCalculate = async () => {
    if (hours < 1 || hours > 6) {
      alert("Choose between 1 and 6 hours");
      return;
    }
    try {
      const result = await fetchOptimalCharging(hours);
      setChargingResult(result);
    } catch (error) {
      console.log("Calculating error: ", error)
      alert("Failed to calculate charging window.")
    }
  }

  const dayLabels = ["Today", "Tomorrow", "Day after tomorrow"];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#2c3e50' }}>Energy Dashboard</h1>
        <p style={{ color: '#7f8c8d' }}>Analizing energy mix and optimal EV charging window</p>
      </header>

      <section>
        <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Energy mix ( 3days )</h2>

        {loading ? (
          <p>Fetching data...</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
            {dailyData.map((day, index) => (
              <DailyMixChart
                key={day.date}
                data={day}
                label={dayLabels[index] || day.date}
              />
            ))}
          </div>
        )}
      </section>

      {/* Optimal charging */}
      <section>
        <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Optimal Charging</h2>
        <p>Find the most optimal charging window for your car in the oncoming 2 days.</p>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '20px' }}>
          <label style={{ fontWeight: 'bold' }}>Charging duration (h):</label>
          <input 
            type="number" 
            min="1" 
            max="6" 
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '60px' }}
          />
          <button 
            onClick={handleCalculate}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#27ae60', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            Calculate
          </button>
        </div>

        {/* Optimal charging results */}
        {chargingResult && (
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#dcfce7', borderRadius: '8px', border: '1px solid #86efac' }}>
            <h3 style={{ color: '#166534', marginTop: 0 }}>Most optimal window found!</h3>
            <div style={{ fontSize: '1.1rem', color: '#14532d' }}>
              <p>
                <strong>Start:</strong> {format(new Date(chargingResult.startTime), 'dd.MM.yyyy, HH:mm')}
              </p>
              <p>
                <strong>Finish:</strong> {format(new Date(chargingResult.endTime), 'dd.MM.yyyy, HH:mm')}
              </p>
              <p>
                <strong>Average clean energy:</strong> {chargingResult.cleanEnergyPercent.toFixed(1)}%
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default App