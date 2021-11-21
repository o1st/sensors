import { renderHook, act } from "@testing-library/react-hooks";
import { Server, WebSocket } from "mock-socket";
import { sensor } from "../mocks";
import { Command, Sensor } from "../types";
import { useWs } from "./useWs";

describe("useWs", () => {
  window.WebSocket = WebSocket;
  global.console.log = jest.fn();
  let mockServer: Server;

  const command: Command = { command: "disconnect", id: "1" };

  beforeAll((done) => {
    mockServer = new Server("ws://localhost:5000");
    mockServer.on("connection", (socket) => {
      socket.on("message", (data) => {
        expect(data).toBe(JSON.stringify(command));
        socket.send(JSON.stringify({ ...sensor, connected: false }));
      });
      socket.send(JSON.stringify(sensor));
    });
    done();
  });
  //   afterAll((done) => {
  //     mockServer.stop();
  //     setTimeout(() => done(), 2000);
  //   });

  test("should return loading true and empty array", () => {
    const { result } = renderHook(() => useWs<Sensor>());

    expect(result.current[0]).toStrictEqual([]);
    expect(result.current[1]).toBeTruthy();
  });

  test("should return loading false and array with 1 sensor", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useWs<Sensor>());

    await waitForNextUpdate();
    expect(result.current[0]).toStrictEqual([sensor]);
    expect(result.current[1]).toBeFalsy();
  });

  test("should return loading false and array with 1 sensor", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useWs<Sensor>());

    act(() => {
      result.current[2](command);
    });
    await waitForNextUpdate();
  });
});
