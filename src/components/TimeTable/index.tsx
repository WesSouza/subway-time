import * as React from 'react';

import styles from './styles.css';

interface IProps {
  station: {
    id: string;
    name: string;
  };
  lines: Array<{
    id: string;
    color: string;
    directions: Array<{
      name: string;
      trains: Array<{
        minutes: number;
        destinationStationName: string;
      }>;
    }>;
  }>;
}

const TimeTable = ({ station: { name: stationName }, lines }: IProps) => (
  <div className={styles.TimeTable}>
    <div className={styles.stationName}>{stationName}</div>
    <div>
      {lines.map(({ id: lineId, color: lineColor, directions }) => (
        <div key={lineId} className={styles.line}>
          <div className={styles.lineId} style={{ backgroundColor: lineColor }}>
            {lineId}
          </div>
          <div className={styles.directions}>
            {directions.map(({ name: directionName, trains }) => (
              <div key={directionName} className={styles.direction}>
                <div className={styles.directionName}>{directionName}</div>
                <div className={styles.trains}>
                  {trains.map(({ destinationStationName, minutes }, index) => (
                    <div
                      key={`${destinationStationName} ${minutes}`}
                      className={styles.train}
                    >
                      <div
                        className={`${styles.minutes} ${
                          index === 0 ? styles.minutesFirst : ''
                        }`}
                      >
                        {minutes} min
                      </div>
                      <div className={styles.destinationStationName}>
                        {destinationStationName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TimeTable;
