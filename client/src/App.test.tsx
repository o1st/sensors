import { render, screen } from "@testing-library/react";
import { App } from "./App";
import { useWs } from "./hooks";
import { sensor } from "./mocks";

jest.mock("./hooks", () => ({
  useWs: jest.fn(),
}));

const mockedUseWs = useWs as jest.Mock;

describe("App", () => {
  test("should render loading", () => {
    mockedUseWs.mockReturnValue([[], true, jest.fn()]);
    render(<App />);

    expect(screen.getByTestId("app-loading")).toBeInTheDocument();
  });

  test("should render empty content", () => {
    mockedUseWs.mockReturnValue([[], false, jest.fn()]);
    render(<App />);

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  test("should render card list", () => {
    mockedUseWs.mockReturnValue([[sensor], false, jest.fn()]);
    render(<App />);

    expect(screen.getByTestId("app-cards")).toBeInTheDocument();
  });
});
