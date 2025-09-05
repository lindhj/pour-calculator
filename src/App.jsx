import { createSignal } from "solid-js";

function App() {
  const [segmentCount, setSegmentCount] = createSignal(2);
  const [coffeeAmount, setCoffeeAmount] = createSignal(20);
  const [waterAmount, setWaterAmount] = createSignal(300);
  const [bloomFactor, setBloomFactor] = createSignal(2.5);
  const [ratio, setRatio] = createSignal(15);
  const [lastChanged, setLastChanged] = createSignal("coffee");

  const handleSegmentInput = (e) => {
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
      setWaterAmount(value * ratio());
      setLastChanged("coffee");
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
      setCoffeeAmount(value / ratio());
      setLastChanged("water");
    }
  };

  const handleBloomFactorInput = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setBloomFactor(2.5);
      return;
    }
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value >= 0) {
      setBloomFactor(value);
    }
  };

  const handleRatioInput = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setRatio(15);
      return;
    }
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value > 0) {
      setRatio(value);
      if (lastChanged() === "coffee") {
        setWaterAmount(coffeeAmount() * value);
      } else {
        setCoffeeAmount(waterAmount() / value);
      }
    }
  };

  const createSegments = () => {
    const bloomAmount = coffeeAmount() * bloomFactor();
    const remainingWater = waterAmount() - bloomAmount;
    const remainingSegments = segmentCount() - 1;
    const waterPerRemainingSegment =
      remainingSegments > 0 ? remainingWater / remainingSegments : 0;
    const segments = [];

    for (let i = 0; i < segmentCount(); i++) {
      let cumulativeAmount;
      let segmentAmount;

      if (i === 0) {
        // First segment is the bloom
        cumulativeAmount = bloomAmount;
        segmentAmount = bloomAmount;
      } else {
        // Subsequent segments are bloom + remaining water divided equally
        cumulativeAmount = bloomAmount + i * waterPerRemainingSegment;
        segmentAmount = waterPerRemainingSegment;
      }

      // Calculate flex basis as proportion of total water
      const flexBasis =
        waterAmount() > 0 ? (segmentAmount / waterAmount()) * 100 : 0;

      segments.push(
        <div class="segment-wrapper" style={{ flex: `0 0 ${flexBasis}%` }}>
          <div class="segment" />
          <div class="segment-label">{Math.round(cumulativeAmount)}g</div>
        </div>,
      );
    }

    return segments;
  };

  return (
    <div class="app">
      <h1>Ratio Visualizer</h1>

      <div class="calculator-section">
        <h2>Coffee to Water Calculator (1:{ratio()} ratio)</h2>
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
          <div class="input-field">
            <label for="ratio-input">Ratio (1:x):</label>
            <input
              id="ratio-input"
              type="number"
              step="0.1"
              min="1"
              value={ratio()}
              onInput={handleRatioInput}
            />
          </div>
          <div class="input-field">
            <label for="bloom-factor-input">Bloom Factor:</label>
            <input
              id="bloom-factor-input"
              type="number"
              step="0.1"
              min="0"
              value={bloomFactor()}
              onInput={handleBloomFactorInput}
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
          onInput={handleSegmentInput}
        />
      </div>
      <div class="bar-container">{createSegments()}</div>
    </div>
  );
}

export default App;
