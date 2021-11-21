import { FC, memo, useCallback, useMemo, useState } from "react";

import { Card, Header } from "./components";
import { ReactComponent as Spinner } from "./assets/spinner.svg";

import { useWs } from "./hooks";
import { Command, Sensor } from "./types";

import styles from "./App.module.css";

export const App: FC = memo(() => {
  const [showAll, setShowAll] = useState<boolean>(true);
  const [sensors, isLoading, send] = useWs<Sensor>();

  const toggleSensorState = useCallback(
    (command: Command) => {
      send(command);
    },
    [send]
  );

  const filteredCards = useMemo(() => {
    return sensors.filter(({ connected }) => showAll || connected);
  }, [sensors, showAll]);

  return (
    <div className={styles.app}>
      {isLoading && (
        <Spinner className={styles.loading} data-testid="app-loading" />
      )}
      <Header isAll={showAll} toggleShow={setShowAll} />
      {!isLoading && (
        <main className={styles.list} data-testid="app-cards">
          {filteredCards.length > 0 ? (
            filteredCards.map((item) => (
              <Card
                key={item.id}
                sensor={item}
                toggleState={toggleSensorState}
              />
            ))
          ) : (
            <div className={styles.noData}>No data</div>
          )}
        </main>
      )}
    </div>
  );
});
