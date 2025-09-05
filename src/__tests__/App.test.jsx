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

test("empty input handling", () => {
  const { getByLabelText } = render(() => <App />);

  const coffeeInput = getByLabelText("Coffee (g):");
  const waterInput = getByLabelText("Water (g):");

  fireEvent.input(coffeeInput, { target: { value: "" } });
  expect(coffeeInput).toHaveValue(0);
  expect(waterInput).toHaveValue(0);

  fireEvent.input(coffeeInput, { target: { value: "20" } });
  fireEvent.input(waterInput, { target: { value: "" } });
  expect(waterInput).toHaveValue(0);
  expect(coffeeInput).toHaveValue(0);
});

test("negative input handling", () => {
  const { getByLabelText } = render(() => <App />);

  const coffeeInput = getByLabelText("Coffee (g):");
  const waterInput = getByLabelText("Water (g):");

  fireEvent.input(coffeeInput, { target: { value: "-5" } });
  expect(coffeeInput).toHaveValue(-5);
  expect(waterInput).toHaveValue(300);
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
