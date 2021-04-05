import React from "react";
import { render } from "@testing-library/react";
import App from ".";

it("App renders without crashing", () => {
  render(<App />);
});
