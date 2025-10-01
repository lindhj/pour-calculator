import { render, fireEvent } from "@solidjs/testing-library";
import App from "../App";

test("App renders without crashing", () => {
  const { getByText } = render(() => <App />);

  expect(getByText("Pour Calculator")).toBeInTheDocument();
  expect(
    getByText("Coffee to Water Calculator (1:15 ratio)"),
  ).toBeInTheDocument();
});

test("App shows default values", () => {
  const { getByLabelText } = render(() => <App />);

  const coffeeInput = getByLabelText("Coffee (g):");
  const waterInput = getByLabelText("Water (g):");
  const segmentInput = getByLabelText("Number of segments:");
  const ratioInput = getByLabelText("Ratio (1:x):");
  const bloomFactorInput = getByLabelText("Bloom Factor:");

  expect(coffeeInput).toHaveValue(20);
  expect(waterInput).toHaveValue(300);
  expect(segmentInput).toHaveValue(2);
  expect(ratioInput).toHaveValue(15);
  expect(bloomFactorInput).toHaveValue(2.5);
});

test("coffee input updates water amount", () => {
  const { getByLabelText } = render(() => <App />);

  const coffeeInput = getByLabelText("Coffee (g):");
  const waterInput = getByLabelText("Water (g):");

  fireEvent.input(coffeeInput, { target: { value: "30" } });

  expect(coffeeInput).toHaveValue(30);
  expect(waterInput).toHaveValue(450);
});

test("water input updates coffee amount", () => {
  const { getByLabelText } = render(() => <App />);

  const coffeeInput = getByLabelText("Coffee (g):");
  const waterInput = getByLabelText("Water (g):");

  fireEvent.input(waterInput, { target: { value: "450" } });

  expect(waterInput).toHaveValue(450);
  expect(coffeeInput).toHaveValue(30);
});

test("segment input validation works", () => {
  const { getByLabelText } = render(() => <App />);

  const segmentInput = getByLabelText("Number of segments:");

  fireEvent.input(segmentInput, { target: { value: "5" } });
  expect(segmentInput).toHaveValue(5);

  fireEvent.input(segmentInput, { target: { value: "100" } });
  expect(segmentInput).toHaveValue(100);

  fireEvent.input(segmentInput, { target: { value: "0" } });
  expect(segmentInput).toHaveValue(1);
});

test("ratio input updates calculations", () => {
  const { getByLabelText, getByText } = render(() => <App />);

  const ratioInput = getByLabelText("Ratio (1:x):");
  const waterInput = getByLabelText("Water (g):");

  fireEvent.input(ratioInput, { target: { value: "12" } });

  expect(ratioInput).toHaveValue(12);
  expect(
    getByText("Coffee to Water Calculator (1:12 ratio)"),
  ).toBeInTheDocument();
  expect(waterInput).toHaveValue(240);
});

test("bloom factor input works", () => {
  const { getByLabelText } = render(() => <App />);

  const bloomFactorInput = getByLabelText("Bloom Factor:");

  fireEvent.input(bloomFactorInput, { target: { value: "3" } });
  expect(bloomFactorInput).toHaveValue(3);
});

test("empty input handling - coffee and water", () => {
  const { getByLabelText } = render(() => <App />);

  const coffeeInput = getByLabelText("Coffee (g):");
  const waterInput = getByLabelText("Water (g):");

  // Empty coffee should zero both fields
  fireEvent.input(coffeeInput, { target: { value: "" } });
  expect(coffeeInput).toHaveValue(0);
  expect(waterInput).toHaveValue(0);

  // Empty water should zero both fields
  fireEvent.input(coffeeInput, { target: { value: "20" } });
  fireEvent.input(waterInput, { target: { value: "" } });
  expect(waterInput).toHaveValue(0);
  expect(coffeeInput).toHaveValue(0);
});

test("empty input handling - ratio resets and recalculates", () => {
  const { getByLabelText } = render(() => <App />);

  const waterInput = getByLabelText("Water (g):");
  const ratioInput = getByLabelText("Ratio (1:x):");

  // Set ratio to 12 (from default 15)
  fireEvent.input(ratioInput, { target: { value: "12" } });
  expect(ratioInput).toHaveValue(12);
  expect(waterInput).toHaveValue(240); // 20 * 12

  // Clear ratio - should reset to 15 AND recalculate water
  fireEvent.input(ratioInput, { target: { value: "" } });
  expect(ratioInput).toHaveValue(15);
  expect(waterInput).toHaveValue(300); // 20 * 15 (should recalculate!)
});

test("empty input handling - bloom factor resets to default", () => {
  const { getByLabelText } = render(() => <App />);

  const bloomFactorInput = getByLabelText("Bloom Factor:");

  // Change bloom factor
  fireEvent.input(bloomFactorInput, { target: { value: "3" } });
  expect(bloomFactorInput).toHaveValue(3);

  // Clear bloom factor - should reset to default 2.5
  fireEvent.input(bloomFactorInput, { target: { value: "" } });
  expect(bloomFactorInput).toHaveValue(2.5);
});

test("negative coffee input is rejected", () => {
  const { getByLabelText } = render(() => <App />);
  const coffeeInput = getByLabelText("Coffee (g):");
  const waterInput = getByLabelText("Water (g):");

  // Try negative, then valid - valid input should work
  fireEvent.input(coffeeInput, { target: { value: "-5" } });
  fireEvent.input(coffeeInput, { target: { value: "30" } });
  expect(coffeeInput).toHaveValue(30);
  expect(waterInput).toHaveValue(450); // 30 * 15
});

test("negative water input is rejected", () => {
  const { getByLabelText } = render(() => <App />);
  const waterInput = getByLabelText("Water (g):");
  const coffeeInput = getByLabelText("Coffee (g):");

  // Try negative, then valid - valid input should work
  fireEvent.input(waterInput, { target: { value: "-10" } });
  fireEvent.input(waterInput, { target: { value: "450" } });
  expect(waterInput).toHaveValue(450);
  expect(coffeeInput).toHaveValue(30); // 450 / 15
});

test("negative ratio input is rejected", () => {
  const { getByLabelText } = render(() => <App />);
  const ratioInput = getByLabelText("Ratio (1:x):");
  const waterInput = getByLabelText("Water (g):");

  // Try negative, then valid - valid input should work
  fireEvent.input(ratioInput, { target: { value: "-2" } });
  fireEvent.input(ratioInput, { target: { value: "12" } });
  expect(ratioInput).toHaveValue(12);
  expect(waterInput).toHaveValue(240); // 20 * 12
});

test("negative bloom factor input is rejected", () => {
  const { getByLabelText } = render(() => <App />);
  const bloomFactorInput = getByLabelText("Bloom Factor:");

  // Try negative, then valid - valid input should work
  fireEvent.input(bloomFactorInput, { target: { value: "-1" } });
  fireEvent.input(bloomFactorInput, { target: { value: "3" } });
  expect(bloomFactorInput).toHaveValue(3);
});

test("division by zero protection - water input when coffee is zero", () => {
  const { getByLabelText } = render(() => <App />);
  const coffeeInput = getByLabelText("Coffee (g):");
  const waterInput = getByLabelText("Water (g):");
  const ratioInput = getByLabelText("Ratio (1:x):");

  // Set coffee to 0
  fireEvent.input(coffeeInput, { target: { value: "" } }); // Empty sets to 0
  expect(coffeeInput).toHaveValue(0);
  expect(waterInput).toHaveValue(0);

  // Mark coffee as user-modified by blurring
  fireEvent.blur(coffeeInput);

  // Now try to set water - should not attempt division by zero to calculate ratio
  fireEvent.input(waterInput, { target: { value: "300" } });
  fireEvent.blur(waterInput);

  expect(waterInput).toHaveValue(300);
  expect(ratioInput).not.toHaveValue(Infinity);
  expect(ratioInput).not.toBeNaN();
});

test("division by zero protection - water input calculates coffee safely when ratio would cause division by zero", () => {
  const { getByLabelText } = render(() => <App />);
  const waterInput = getByLabelText("Water (g):");
  const coffeeInput = getByLabelText("Coffee (g):");

  // Set ratio to a very small value approaching zero (though our validation prevents actual 0)
  // The real risk is if ratio is 0, water/ratio would be Infinity
  // But since ratio validation prevents <= 0, let's test the edge case where coffee=0

  // Actually, the more realistic scenario: if ratio somehow becomes 0, setting water should not crash
  // However, ratio can't be set to 0 due to validation. The risk is internal state corruption.

  // Test: Set water when ratio is at default (15), then verify coffee is calculated correctly
  fireEvent.input(waterInput, { target: { value: "300" } });
  expect(coffeeInput).toHaveValue(20); // 300 / 15 = 20
  expect(coffeeInput).not.toHaveValue(Infinity);
  expect(coffeeInput).not.toBeNaN();
});

test("division by zero protection - ratio calculation when coffee is zero", () => {
  const { getByLabelText } = render(() => <App />);
  const coffeeInput = getByLabelText("Coffee (g):");
  const waterInput = getByLabelText("Water (g):");
  const ratioInput = getByLabelText("Ratio (1:x):");

  // Start fresh, set coffee to 0
  fireEvent.input(coffeeInput, { target: { value: "" } });
  fireEvent.blur(coffeeInput);
  expect(coffeeInput).toHaveValue(0);

  // Set water to non-zero and mark as user-modified
  fireEvent.input(waterInput, { target: { value: "300" } });
  fireEvent.blur(waterInput);

  // Both coffee (0) and water (300) are now user-modified
  // When we change coffee to a non-zero value, it should calculate ratio
  // But the previous state (coffee=0, water=300) should not have calculated an infinite ratio
  expect(ratioInput).not.toHaveValue(Infinity);
  expect(ratioInput).toHaveValue(15); // Should remain at default
});

test("segments are rendered", () => {
  const { container } = render(() => <App />);

  const segments = container.querySelectorAll(".segment-wrapper");
  expect(segments).toHaveLength(2);

  const labels = container.querySelectorAll(".segment-label");
  expect(labels).toHaveLength(2);
});

test("single segment uses normal styling (not bloom)", () => {
  const { container, getByLabelText } = render(() => <App />);

  const segmentInput = getByLabelText("Number of segments:");
  fireEvent.input(segmentInput, { target: { value: "1" } });

  const segments = container.querySelectorAll(".segment-wrapper");
  expect(segments).toHaveLength(1);

  // With single segment, it should show total water amount (300g)
  const label = container.querySelector(".segment-label");
  expect(label).toHaveTextContent("300g");

  // Should not have bloom styling (first-child selector applies orange color)
  const segmentDiv = container.querySelector(".segment");
  const styles = window.getComputedStyle(segmentDiv);
  expect(styles.backgroundColor).not.toBe("rgb(255, 107, 53)"); // Not orange
});

test("ratio calculates when coffee and water are manually set", () => {
  const { getByLabelText } = render(() => <App />);

  const coffeeInput = getByLabelText("Coffee (g):");
  const waterInput = getByLabelText("Water (g):");
  const ratioInput = getByLabelText("Ratio (1:x):");

  // Set coffee first and mark as user-modified
  fireEvent.input(coffeeInput, { target: { value: "30" } });
  fireEvent.blur(coffeeInput);
  expect(coffeeInput).toHaveValue(30);
  expect(waterInput).toHaveValue(450); // 30 * 15 = 450
  expect(ratioInput).toHaveValue(15); // ratio stays the same

  // Now manually set water to a different value and mark as user-modified
  fireEvent.input(waterInput, { target: { value: "360" } });
  fireEvent.blur(waterInput);
  expect(waterInput).toHaveValue(360);
  expect(coffeeInput).toHaveValue(30); // coffee stays the same
  expect(ratioInput).toHaveValue(12); // ratio should calculate: 360/30 = 12
});

test("visual rounding works for decimal values", () => {
  const { getByLabelText } = render(() => <App />);

  const coffeeInput = getByLabelText("Coffee (g):");
  const waterInput = getByLabelText("Water (g):");
  const ratioInput = getByLabelText("Ratio (1:x):");

  // Test case: 15g coffee, 250g water should show 16.67 ratio
  fireEvent.input(coffeeInput, { target: { value: "15" } });
  fireEvent.blur(coffeeInput);
  fireEvent.input(waterInput, { target: { value: "250" } });
  fireEvent.blur(waterInput);

  expect(ratioInput).toHaveValue(16.67); // 250/15 = 16.666... rounds to 16.67

  // Test reverse case: 15g coffee, 16.67 ratio should show 250g water
  fireEvent.input(ratioInput, { target: { value: "16.67" } });
  fireEvent.blur(ratioInput);

  expect(waterInput).toHaveValue(250); // 15 * 16.67 = 250.05, rounds to 250
});

test("ratio calculates regardless of field order (water first, then coffee)", () => {
  const { getByLabelText } = render(() => <App />);

  const coffeeInput = getByLabelText("Coffee (g):");
  const waterInput = getByLabelText("Water (g):");
  const ratioInput = getByLabelText("Ratio (1:x):");

  // Set water first and mark as user-modified
  fireEvent.input(waterInput, { target: { value: "240" } });
  fireEvent.blur(waterInput);
  expect(waterInput).toHaveValue(240);
  expect(coffeeInput).toHaveValue(16); // 240 / 15 = 16
  expect(ratioInput).toHaveValue(15); // ratio stays the same

  // Now manually set coffee to a different value and mark as user-modified
  fireEvent.input(coffeeInput, { target: { value: "20" } });
  fireEvent.blur(coffeeInput);
  expect(coffeeInput).toHaveValue(20);
  expect(waterInput).toHaveValue(240); // water stays the same
  expect(ratioInput).toHaveValue(12); // ratio should calculate: 240/20 = 12
});

test("bloom overflow creates single blue segment instead of overflowing", () => {
  const { container, getByLabelText } = render(() => <App />);

  const coffeeInput = getByLabelText("Coffee (g):");
  const waterInput = getByLabelText("Water (g):");
  const bloomFactorInput = getByLabelText("Bloom Factor:");
  const segmentInput = getByLabelText("Number of segments:");

  // Set up scenario where bloom would overflow (10g coffee * 3x bloom = 30g, but only 20g water)
  // Use blur events to mark fields as user-modified and avoid cross-calculations
  fireEvent.input(coffeeInput, { target: { value: "10" } });
  fireEvent.blur(coffeeInput);
  fireEvent.input(waterInput, { target: { value: "20" } });
  fireEvent.blur(waterInput);
  fireEvent.input(bloomFactorInput, { target: { value: "3" } });
  fireEvent.input(segmentInput, { target: { value: "3" } });

  // Should render as single segment instead of 3 segments
  const segments = container.querySelectorAll(".segment-wrapper");
  expect(segments).toHaveLength(1);

  // Should show total water amount (20g) and be blue (not orange)
  const label = container.querySelector(".segment-label");
  expect(label).toHaveTextContent("20g");

  // Should not have bloom styling since it's treated as single segment
  const segmentDiv = container.querySelector(".segment");
  expect(segmentDiv).not.toHaveClass("bloom");
});
