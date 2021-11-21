export type Nullable<T> = T | null | undefined;

export type Sensor = {
  id: string;
  name: string;
  connected: boolean;
  unit: string;
  value: Nullable<string>;
};

export type Command = {
  command: "disconnect" | "connect";
  id: string;
};
