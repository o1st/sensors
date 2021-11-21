import { useState, useRef, useCallback, useEffect } from "react";
import { Command, Nullable } from "../types";

const url = "ws://localhost:5000";

type TSendFunction = (data: Command) => void;
type TFunction = <T extends { id: string }>() => [
  data: T[],
  isLoading: boolean,
  send: TSendFunction
];

export const useWs: TFunction = <T extends { id: string }>() => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<T[]>([]);
  const ws = useRef<WebSocket>();

  const send = useCallback((unit: Command) => {
    try {
      ws.current?.send(JSON.stringify(unit));
    } catch (e) {
      console.log(`Unexpected error ${e}`);
    }
  }, []);

  const onMessage = useCallback(
    (e) => {
      let sensor: Nullable<T> = null;

      try {
        sensor = JSON.parse(e.data);
      } catch {
        console.error("Error parsing");
      }

      if (sensor) {
        setData((state) => {
          const filteredSensors = state.filter(({ id }) => id !== sensor?.id);
          const updated = [...filteredSensors, sensor as T];
          const sorted = updated.sort((a, b) => Number(a.id) - Number(b.id));
          return sorted;
        });
      }
      if (isLoading) {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const init = useCallback(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("opening...");
    };

    ws.current.onerror = (error) => {
      console.log("WebSocket error " + error);
    };

    ws.current.onclose = (e) => {
      if (e.code === 1005) {
        console.log("closing...");
      } else {
        console.log(
          "Socket is closed Unexpectedly. Reconnect will be attempted in 4 second.",
          e.reason
        );
        setTimeout(() => {
          init();
        }, 4000);
      }
    };

    ws.current.onmessage = onMessage;
  }, [onMessage]);

  useEffect(() => {
    init();
    return ws.current?.close();
  }, [init]);

  return [data, isLoading, send];
};
