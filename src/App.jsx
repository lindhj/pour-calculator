import { createSignal } from "solid-js";

function App() {
  const [segmentCount, setSegmentCount] = createSignal(2);
  const [coffeeAmount, setCoffeeAmount] = createSignal(20);
  const [waterAmount, setWaterAmount] = createSignal(300);
  const [bloomFactor, setBloomFactor] = createSignal(2.5);
  const [ratio, setRatio] = createSignal(15);
  const [lastChanged, setLastChanged] = createSignal("coffee");
  const [userModified, setUserModified] = createSignal({
    coffee: false,
    water: false,
    ratio: false,
  });

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
    if (isNaN(value) || value < 0) {
      return; // Reject invalid or negative values
    }
    setCoffeeAmount(value);
    if (userModified().water && waterAmount() > 0 && value > 0) {
      // Both coffee and water are user-modified, calculate ratio
      // Guard: Only calculate ratio if coffee is non-zero
      setRatio(waterAmount() / value);
      setUserModified((prev) => ({ ...prev, ratio: false })); // ratio is now calculated
    } else {
      // Update water based on current ratio
      setWaterAmount(value * ratio());
      setUserModified((prev) => ({ ...prev, water: false })); // water is now calculated
    }
    setLastChanged("coffee");
  };

  const handleCoffeeBlur = () => {
    setUserModified((prev) => ({ ...prev, coffee: true }));
  };

  const handleWaterInput = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setWaterAmount(0);
      setCoffeeAmount(0);
      return;
    }
    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      return; // Reject invalid or negative values
    }
    setWaterAmount(value);
    if (userModified().coffee && coffeeAmount() > 0 && value > 0) {
      // Both coffee and water are user-modified, calculate ratio
      // Guard: coffeeAmount() > 0 already protects against division by zero
      setRatio(value / coffeeAmount());
      setUserModified((prev) => ({ ...prev, ratio: false })); // ratio is now calculated
    } else {
      // Update coffee based on current ratio
      // Guard: ratio validation ensures ratio > 0, but check defensively
      if (ratio() > 0) {
        setCoffeeAmount(value / ratio());
        setUserModified((prev) => ({ ...prev, coffee: false })); // coffee is now calculated
      }
    }
    setLastChanged("water");
  };

  const handleWaterBlur = () => {
    setUserModified((prev) => ({ ...prev, water: true }));
  };

  const handleBloomFactorInput = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setBloomFactor(2.5);
      return;
    }
    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      return; // Reject invalid or negative values
    }
    setBloomFactor(value);
  };

  const handleRatioInput = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setRatio(15);
      return;
    }
    const value = parseFloat(inputValue);
    if (isNaN(value) || value <= 0) {
      return; // Reject invalid, negative, or zero values (ratio must be positive)
    }
    setRatio(value);
    if (lastChanged() === "coffee") {
      setWaterAmount(coffeeAmount() * value);
      setUserModified((prev) => ({ ...prev, water: false })); // water is now calculated
    } else {
      setCoffeeAmount(waterAmount() / value);
      setUserModified((prev) => ({ ...prev, coffee: false })); // coffee is now calculated
    }
  };

  const handleRatioBlur = () => {
    setUserModified((prev) => ({ ...prev, ratio: true }));
  };

  const formatDisplayValue = (value) => {
    if (value === 0) return 0;
    return Math.round(value * 100) / 100;
  };

  const createSegments = () => {
    const calculatedBloomAmount = coffeeAmount() * bloomFactor();
    const bloomOverflows = calculatedBloomAmount >= waterAmount();

    // If bloom would overflow, treat as single segment regardless of segmentCount
    const effectiveSegmentCount =
      bloomOverflows && segmentCount() > 1 ? 1 : segmentCount();

    const bloomAmount = Math.min(calculatedBloomAmount, waterAmount());
    const remainingWater = waterAmount() - bloomAmount;
    const remainingSegments = effectiveSegmentCount - 1;
    const waterPerRemainingSegment =
      remainingSegments > 0 ? remainingWater / remainingSegments : 0;
    const segments = [];

    for (let i = 0; i < effectiveSegmentCount; i++) {
      let cumulativeAmount;
      let segmentAmount;

      if (i === 0 && effectiveSegmentCount > 1) {
        // First segment is the bloom (only when there are multiple segments)
        cumulativeAmount = bloomAmount;
        segmentAmount = bloomAmount;
      } else if (effectiveSegmentCount === 1) {
        // Single segment gets all the water
        cumulativeAmount = waterAmount();
        segmentAmount = waterAmount();
      } else {
        // Subsequent segments are bloom + remaining water divided equally
        cumulativeAmount = bloomAmount + i * waterPerRemainingSegment;
        segmentAmount = waterPerRemainingSegment;
      }

      // Calculate flex basis as proportion of total water
      const flexBasis =
        waterAmount() > 0 ? (segmentAmount / waterAmount()) * 100 : 0;

      const isBloom = i === 0 && effectiveSegmentCount > 1;
      segments.push(
        <div class="segment-wrapper" style={{ flex: `0 0 ${flexBasis}%` }}>
          <div class={`segment${isBloom ? " bloom" : ""}`} />
          <div class="segment-label">{Math.round(cumulativeAmount)}g</div>
        </div>,
      );
    }

    return segments;
  };

  return (
    <div class="app">
      <h1>Pour Calculator</h1>

      <div class="calculator-section">
        <h2>
          Coffee to Water Calculator (1:{formatDisplayValue(ratio())} ratio)
        </h2>
        <div class="input-group">
          <div class="input-field">
            <label for="coffee-input">Coffee (g):</label>
            <input
              id="coffee-input"
              type="number"
              step="0.1"
              min="0"
              value={formatDisplayValue(coffeeAmount())}
              onInput={handleCoffeeInput}
              onBlur={handleCoffeeBlur}
            />
          </div>
          <div class="input-field">
            <label for="water-input">Water (g):</label>
            <input
              id="water-input"
              type="number"
              step="0.1"
              min="0"
              value={formatDisplayValue(waterAmount())}
              onInput={handleWaterInput}
              onBlur={handleWaterBlur}
            />
          </div>
          <div class="input-field">
            <label for="ratio-input">Ratio (1:x):</label>
            <input
              id="ratio-input"
              type="number"
              step="0.1"
              min="1"
              value={formatDisplayValue(ratio())}
              onInput={handleRatioInput}
              onBlur={handleRatioBlur}
            />
          </div>
          <div class="input-field">
            <label for="bloom-factor-input">Bloom Factor:</label>
            <input
              id="bloom-factor-input"
              type="number"
              step="0.1"
              min="0"
              value={formatDisplayValue(bloomFactor())}
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
