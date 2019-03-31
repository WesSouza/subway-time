import * as React from 'react';

import ErrorMessage from '~/components/ErrorMessage';
import LineAdvisories from '~/components/LineAdvisories';
import LineId from '~/components/LineId';
import { IEntities } from '~/lib/entities';
import { IFuture } from '~/lib/future';
import { ILine, ILineAdvisory } from '~/state/line';
import {
  IStation,
  IStationPlatform,
  IStationPlatformDirection,
  IStationPlatformDirectionTime,
} from '~/state/station';

import Skeleton from './Skeleton';
import styles from './styles.css';

interface IProps {
  advisoriesByLineId: IEntities<IFuture<ILineAdvisory[] | null>>;
  linesFuture: IFuture<IEntities<ILine>>;
  platformsByStationId: IEntities<IFuture<IStationPlatform[]> | null>;
  reloadData: () => void;
  station: IStation;
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
  }

  public componentDidUpdate(prevProps: IProps) {
    const { platformsByStationId } = this.props;
    if (platformsByStationId !== prevProps.platformsByStationId) {
      this.updateLastUpdateString();
    }
  }

  public componentWillUnmount() {
    clearTimeout(this.timer);
  }

  public render() {
    const { lastUpdateString } = this.state;
    const {
      advisoriesByLineId,
      platformsByStationId,
      reloadData,
      station,
    } = this.props;

    const platformFuture = platformsByStationId[station.id];
    if (!platformFuture) {
      return null;
    }
    const [platforms, { error, loading }] = platformFuture;

    if (error) {
      console.error(error);
    }

    return (
      <div className={styles.TimeTable}>
        <div className={styles.stationNameGroup}>
          <div className={styles.stationName}>{station.name}</div>
        </div>
        {error ? (
          <ErrorMessage retryOnClick={reloadData}>
            There was a problem loading train times.
          </ErrorMessage>
        ) : loading || !platforms || !platforms.length ? (
          <Skeleton />
        ) : (
          platforms.map(this.renderPlatform)
        )}
        <div className={styles.footer}>
          <div className={styles.advisories}>
            <LineAdvisories
              advisoriesByLineId={advisoriesByLineId}
              filterByLineIds={station.lineIds}
            />
          </div>
          <div className={styles.lastUpdate}>
            {lastUpdateString}
            {lastUpdateString && (
              <>
                <span className={styles.footerSeparator}>|</span>
                <button
                  className={styles.updateDataButton}
                  onClick={reloadData}
                  type="button"
                >
                  reload
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  public renderPlatform = ({ lineId, directions }: IStationPlatform) => {
    let lineColor: string | null = null;

    const { linesFuture } = this.props;
    const [linesById] = linesFuture;
    if (linesById && linesById[lineId]) {
      lineColor = linesById[lineId].color;
    }

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
            (directions as IStationPlatformDirection[]).map(
              this.renderDirection,
            )
          ) : (
            <div className={styles.directionEmpty}>No train information.</div>
          )}
        </div>
      </div>
    );
  };

  public renderDirection = ({
    name: directionName,
    times,
  }: IStationPlatformDirection) => (
    <div key={directionName} className={styles.direction}>
      <div className={styles.directionName}>{directionName}</div>
      <div className={styles.trains}>
        {times.filter((_, index) => index < 3).map(this.renderTime)}
      </div>
    </div>
  );

  public renderTime = (
    { lastStationName, minutes }: IStationPlatformDirectionTime,
    index: number,
    filteredTrains: IStationPlatformDirectionTime[],
  ) => (
    <div
      key={`${index} ${lastStationName} ${minutes}`}
      className={styles.train}
      style={{ width: `${100 / filteredTrains.length}%` }}
    >
      <div
        className={`${styles.minutes} ${
          index === 0 && typeof minutes === 'number' ? styles.minutesFirst : ''
        }`}
      >
        {minutes === 0
          ? 'Now'
          : typeof minutes === 'number'
          ? `${minutes} min`
          : minutes}
      </div>
      <div className={styles.lastStationName}>{lastStationName}</div>
    </div>
  );

  public updateLastUpdateString = () => {
    clearTimeout(this.timer);

    const { platformsByStationId, station } = this.props;
    const platformFuture = platformsByStationId[station.id];
    if (!platformFuture) {
      return;
    }

    const [platforms] = platformFuture;

    if (!platforms || !platforms[0] || !platforms[0].lastUpdate) {
      this.setState({
        lastUpdateString: '',
      });
      return;
    }

    const { lastUpdate } = platforms[0];

    let lastUpdateString = 'now';
    let delta = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);

    if (delta > 1) {
      lastUpdateString = `${delta} seconds ago`;
    }

    if (delta >= 60) {
      delta = Math.floor(delta / 60);
      lastUpdateString = `${delta} minute${delta > 1 ? 's' : ''} ago`;
    }

    if (delta > 300) {
      lastUpdateString = `more than 5 minutes ago`;
    }

    this.setState({
      lastUpdateString,
    });

    this.timer = setTimeout(() => {
      this.updateLastUpdateString();
    }, 5000);
  };
}

export default TimeTable;
