import * as React from 'react';

import LineId from '~/components/LineId';

import styles from './styles.css';

class TimeTableSkeleton extends React.Component {
  public render() {
    return (
      <div className={`${styles.TimeTable} ${styles.skeleton}`}>
        <div className={styles.stationNameGroup}>
          <div className={styles.stationName}>───&nbsp;&nbsp;─</div>
        </div>
        <div>{this.renderPlatform()}</div>
        <div className={styles.footer}>
          <div className={styles.advisories} />
          <div className={styles.lastUpdate}>updating...</div>
        </div>
      </div>
    );
  }

  public renderPlatform = () => {
    return (
      <div className={styles.line}>
        <LineId id={' '} className={styles.lineId} />
        <div className={styles.directions}>
          {this.renderDirection()}
          {this.renderDirection()}
        </div>
      </div>
    );
  };

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
