import { createSignal } from "solid-js";

function App() {
  const [segmentCount, setSegmentCount] = createSignal(2);

  const handleInput = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= 99) {
      setSegmentCount(value);
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
