import { createSignal } from "solid-js";

function App() {
  const [segmentCount, setSegmentCount] = createSignal(2);
  const [coffeeAmount, setCoffeeAmount] = createSignal(20);
  const [waterAmount, setWaterAmount] = createSignal(300);

  const RATIO = 15;

  const handleInput = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= 99) {
      setSegmentCount(value);
    }
  };

  const handleCoffeeInput = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setCoffeeAmount(0);
      setWaterAmount(0);
      return;
    }
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value >= 0) {
      setCoffeeAmount(value);
      setWaterAmount(value * RATIO);
    }
  };

  const handleWaterInput = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setWaterAmount(0);
      setCoffeeAmount(0);
      return;
    }
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value >= 0) {
      setWaterAmount(value);
      setCoffeeAmount(value / RATIO);
    }
  };

  const createSegments = () => {
    return Array.from({ length: segmentCount() }, () => (
      <div class="segment" />
    ));
  };

  return (
    <div class="app">
      <h1>Ratio Visualizer</h1>

      <div class="calculator-section">
        <h2>Coffee to Water Calculator (1:15 ratio)</h2>
        <div class="input-group">
          <div class="input-field">
            <label for="coffee-input">Coffee (g):</label>
            <input
              id="coffee-input"
              type="number"
              step="0.1"
              min="0"
              value={coffeeAmount()}
              onInput={handleCoffeeInput}
            />
          </div>
          <div class="input-field">
            <label for="water-input">Water (g):</label>
            <input
              id="water-input"
              type="number"
              step="0.1"
              min="0"
              value={waterAmount()}
              onInput={handleWaterInput}
            />
          </div>
        </div>
      </div>

      <div class="input-section">
        <label for="segment-input">Number of segments:</label>
        <input
          id="segment-input"
          type="number"
          min="1"
          max="99"
          value={segmentCount()}
          onInput={handleInput}
        />
      </div>
      <div class="bar-container">{createSegments()}</div>
    </div>
  );
}

export default App;
