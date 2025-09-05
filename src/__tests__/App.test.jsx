import { render } from "@solidjs/testing-library";
import App from "../App";

test("App renders without crashing", () => {
  const { getByText } = render(() => <App />);

  expect(getByText("Ratio Visualizer")).toBeInTheDocument();
  expect(
    getByText("Coffee to Water Calculator (1:15 ratio)"),
  ).toBeInTheDocument();
});

test("App shows default values", () => {
  const { getByLabelText } = render(() => <App />);

  const coffeeInput = getByLabelText("Coffee (g):");
  const waterInput = getByLabelText("Water (g):");
  const segmentInput = getByLabelText("Number of segments:");

  expect(coffeeInput).toHaveValue(20);
  expect(waterInput).toHaveValue(300);
  expect(segmentInput).toHaveValue(2);
});
