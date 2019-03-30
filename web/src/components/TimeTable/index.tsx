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
  advisoriesFuture: IFuture<IEntities<ILineAdvisory[] | null>>;
  linesFuture: IFuture<IEntities<ILine>>;
  platformsFuture: IFuture<IEntities<IStationPlatform[] | null>>;
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
    const { platformsFuture } = this.props;
    if (platformsFuture !== prevProps.platformsFuture) {
      this.updateLastUpdateString();
    }
  }

  public componentWillUnmount() {
    clearTimeout(this.timer);
  }

  public render() {
    const { lastUpdateString } = this.state;
    const {
      advisoriesFuture,
      platformsFuture,
      reloadData,
      station,
    } = this.props;

    const [platformsByStationId, { error, loading }] = platformsFuture;

    const isLoadingThisStation =
      loading && platformsByStationId && !platformsByStationId[station.id];

    if (error) {
      console.error(error);
    }

    const platforms =
      (platformsByStationId && platformsByStationId[station.id]) || [];

    return (
      <div className={styles.TimeTable}>
        <div className={styles.stationNameGroup}>
          <div className={styles.stationName}>{station.name}</div>
        </div>
        {!error && !isLoadingThisStation ? (
          platforms.map(this.renderPlatform)
        ) : isLoadingThisStation ? (
          <Skeleton />
        ) : (
          <ErrorMessage retryOnClick={reloadData}>
            There was a problem loading train times.
          </ErrorMessage>
        )}
        <div className={styles.footer}>
          <div className={styles.advisories}>
            {!error && (
              <LineAdvisories
                advisoriesFuture={advisoriesFuture}
                filterByLineIds={station.lineIds}
              />
            )}
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
    this.timer = setTimeout(() => {
      this.updateLastUpdateString();
    }, 5000);

    const { platformsFuture, station } = this.props;
    const [platformsByStationId] = platformsFuture;

    if (!platformsByStationId) {
      return;
    }

    const platforms = platformsByStationId[station.id] || [];

    if (!platforms[0] || !platforms[0].lastUpdate) {
      return;
    }

    const { lastUpdate } = platformsByStationId[station.id]![0];

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
  };
}

export default TimeTable;
