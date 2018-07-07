import * as React from 'react';

import LineId from 'components/LineId';

import {
  IStation,
  IStationLine,
  IStationLineDirection,
  IStationLineDirectionTime,
} from 'models/models';

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
        <div>{platforms.map(this.renderPlatform)}</div>
        <div className={styles.lastUpdate}>updated {lastUpdateString}</div>
      </div>
    );
  }

  public renderPlatform = ({
    line: { id: lineId, color: lineColor },
    directions,
  }: IStationLine) => {
    const hasDirections = directions && directions.length;
    return (
      <div
        key={lineId}
        className={`${styles.line} ${
          !hasDirections ? styles.lineDisabled : ''
        }`}
      >
        <LineId id={lineId} color={lineColor} className={styles.lineId} />
        <div className={styles.directions}>
          {hasDirections ? (
            (directions as IStationLineDirection[]).map(this.renderDirection)
          ) : (
            <div className={styles.directionEmpty}>No trains</div>
          )}
        </div>
      </div>
    );
  };

  public renderDirection = ({
    name: directionName,
    times,
  }: IStationLineDirection) => (
    <div key={directionName} className={styles.direction}>
      <div className={styles.directionName}>{directionName}</div>
      <div className={styles.trains}>
        {times.filter((_, index) => index < 3).map(this.renderTime)}
      </div>
    </div>
  );

  public renderTime = (
    { lastStationName, minutes }: IStationLineDirectionTime,
    index: number,
    filteredTrains: IStationLineDirectionTime[],
  ) => (
    <div
      key={`${lastStationName} ${minutes}`}
      className={styles.train}
      style={{ width: `${100 / filteredTrains.length}%` }}
    >
      <div
        className={`${styles.minutes} ${
          index === 0 ? styles.minutesFirst : ''
        }`}
      >
        {minutes === 0 ? 'Now' : `${minutes} min`}
      </div>
      <div className={styles.lastStationName}>{lastStationName}</div>
    </div>
  );

  public updateLastUpdateString = () => {
    const { lastUpdate } = this.props;
    let lastUpdateString = 'now';
    let delta = Math.floor((Date.now() - lastUpdate) / 1000);

    if (delta > 1) {
      lastUpdateString = `${delta} seconds ago`;
    }

    if (delta > 60) {
      delta = Math.floor(delta / 60);
      lastUpdateString = `${delta} minute${delta > 1 ? 's' : ''} ago`;
    }

    this.setState({
      lastUpdateString,
    });
  };
}

export default TimeTable;
