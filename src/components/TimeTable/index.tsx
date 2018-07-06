import * as moment from 'moment';
import * as React from 'react';

import { IStation } from 'models/models';

import styles from './styles.css';

interface IProps {
  lastUpdate: number;
  station: IStation;
  updateData: () => void;
}

interface IState {
  lastUpdateString: string;
}

class TimeTable extends React.Component<IProps, IState> {
  public timer: any = null;
  public state = {
    lastUpdateString: '',
  };

  public componentDidMount() {
    this.updateLastUpdateString();
    this.timer = setInterval(() => {
      this.updateLastUpdateString();
    }, 5000);
  }

  public componentDidUpdate(prevProps: IProps) {
    const { lastUpdate } = this.props;
    if (lastUpdate !== prevProps.lastUpdate) {
      this.updateLastUpdateString();
    }
  }

  public componentWillUnmount() {
    clearTimeout(this.timer);
  }

  public render() {
    const { lastUpdateString } = this.state;
    const {
      station: { name: stationName, platforms },
      updateData,
    } = this.props;

    return (
      <div className={styles.TimeTable}>
        <div className={styles.stationNameGroup}>
          <div className={styles.stationName}>{stationName}</div>
          <div className={styles.updateData}>
            <button
              className={styles.updateDataButton}
              onClick={updateData}
              type="button"
            >
              Reload
            </button>
          </div>
        </div>
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
                        <div className={styles.directionName}>
                          {directionName}
                        </div>
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
        <div className={styles.lastUpdate}>updated {lastUpdateString}</div>
      </div>
    );
  }

  public updateLastUpdateString = () => {
    const { lastUpdate } = this.props;
    this.setState({
      lastUpdateString: moment(lastUpdate).fromNow(),
    });
  };
}

export default TimeTable;
