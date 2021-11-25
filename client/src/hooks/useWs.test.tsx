import { renderHook } from "@testing-library/react-hooks";
import { Server } from "mock-socket";
import { sensor } from "../mocks";
import { Sensor } from "../types";
import { useWs } from "./useWs";

const consoleErrorMock = jest.spyOn(console, "error").mockImplementation();
describe("useWs", () => {
  let mockServer: Server;

  beforeAll(() => {
    mockServer = new Server("ws://localhost:5000");
    mockServer.on("connection", (socket) => {
      socket.send(JSON.stringify(sensor));
    });
  });

  afterAll(() => {
    mockServer.stop();
  });

  test("should return loading true and empty array", () => {
    const { result } = renderHook(() => useWs<Sensor>());

    expect(result.current[0]).toStrictEqual([]);
    expect(result.current[1]).toBeTruthy();
  });

  test("should return loading false and array with 1 sensor", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useWs<Sensor>());

    mockServer.emit("message", { data: sensor });

    await waitForNextUpdate();
    expect(result.current[0]).toStrictEqual([sensor]);
    expect(result.current[1]).toBeFalsy();
  });

  test("should return go to error in parse response", async () => {
    const { waitForNextUpdate } = renderHook(() => useWs<Sensor>());

    mockServer.emit("message", sensor);

    await waitForNextUpdate();
    expect(consoleErrorMock).toBeCalled();
  });
});
