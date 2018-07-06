import * as React from 'react';

import { IStation } from 'models/models';

import styles from './styles.css';

interface IProps {
  station: IStation;
}

const TimeTable = ({ station: { name: stationName, platforms } }: IProps) => (
  <div className={styles.TimeTable}>
    <div className={styles.stationName}>{stationName}</div>
    <div>
      {platforms.map(
        ({ line: { id: lineId, color: lineColor }, directions }) => (
          <div key={lineId} className={styles.line}>
            <div
              className={styles.lineId}
              style={{ backgroundColor: lineColor }}
            >
              {lineId}
            </div>
            <div className={styles.directions}>
              {directions ? (
                directions.map(({ name: directionName, times }) => (
                  <div key={directionName} className={styles.direction}>
                    <div className={styles.directionName}>{directionName}</div>
                    <div className={styles.trains}>
                      {times.map(
                        ({ lastStationName, minutes }, index) =>
                          index < 3 && (
                            <div
                              key={`${lastStationName} ${minutes}`}
                              className={styles.train}
                            >
                              <div
                                className={`${styles.minutes} ${
                                  index === 0 ? styles.minutesFirst : ''
                                }`}
                              >
                                {minutes === 0 ? 'Now' : `${minutes} min`}
                              </div>
                              <div className={styles.lastStationName}>
                                {lastStationName}
                              </div>
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.directionEmpty}>No trains</div>
              )}
            </div>
          </div>
        ),
      )}
    </div>
  </div>
);

export default TimeTable;
