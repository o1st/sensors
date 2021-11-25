import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Command, Nullable } from "../types";
import { baseWebsocket, BaseWebsocket } from "./BaseWebsocket";

type TSendFunction = (data: Command) => void;
type TFunction = <
  T extends { id: string; connected: boolean; value: Nullable<string> }
>() => [data: T[], isLoading: boolean, send: TSendFunction];

export const useWs: TFunction = <
  T extends { id: string; connected: boolean; value: Nullable<string> }
>() => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Record<string, T>>({});
  const ws = useRef<BaseWebsocket>(baseWebsocket);

  const send = useCallback((unit: Command) => {
    try {
      ws.current?.send(JSON.stringify(unit));
    } catch (e) {
      console.log(`Unexpected error ${e}`);
    }
  }, []);

  const onMessage = useCallback((e) => {
    let sensor: Nullable<T> = null;

    try {
      sensor = JSON.parse(e.data);
    } catch {
      console.error("Error parsing");
    }

    if (sensor) {
      setData((state) => {
        if (sensor) {
          const copyState = { ...state };
          copyState[sensor.id] = {
            ...sensor,
            value: sensor.connected
              ? sensor.value
              : copyState[sensor.id]?.value,
          };

          return copyState;
        }
        return state;
      });
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const unSubFn = ws.current.subscribe(onMessage);
    return unSubFn;
  }, [onMessage]);

  const memoData = useMemo(() => {
    const valuesOfData = Object.values(data);
    const filteredValues = valuesOfData.sort(
      (a, b) => Number(a.id) - Number(b.id)
    );
    return filteredValues;
  }, [data]);

  return [memoData, isLoading, send];
};
