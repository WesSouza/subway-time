import * as React from 'react';

import LineId from '~/components/LineId';

import styles from './styles.css';

class TimeTableSkeleton extends React.Component {
  public render() {
    return (
      <div className={styles.line}>
        <LineId id={' '} color={null} className={styles.lineId} />
        <div className={styles.directions}>
          {this.renderDirection()}
          {this.renderDirection()}
        </div>
      </div>
    );
  }

  public renderDirection = () => (
    <div className={styles.direction}>
      <div className={styles.directionName}>───</div>
      <div className={styles.trains}>
        {this.renderTime()}
        {this.renderTime()}
        {this.renderTime()}
      </div>
    </div>
  );

  public renderTime = () => (
    <div className={styles.train}>
      <div className={`${styles.minutes}`}>─</div>
      <div className={styles.lastStationName}>───</div>
    </div>
  );
}

export default TimeTableSkeleton;
