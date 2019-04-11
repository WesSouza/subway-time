import { Link } from '@reach/router';
import * as React from 'react';
import naturalCompare from 'natural-compare-lite';

import { IEntities } from '~/lib/entities';
import { IFuture } from '~/lib/future';
import { ILineAdvisory } from '~/state/line';
import {
  IStation,
  IStationPlatform,
  IStationPlatformDirection,
  IStationPlatformDirectionTime,
} from '~/state/station';

import { ButtonLink } from '../ButtonLink';
import LineAdvisories from '../LineAdvisories';
import { LinedBlock } from '../LinedBlock';
import { LoadingBlock } from '../LoadingBlock';

import styles from './styles.css';
import sortByObjectKey from '~/lib/sortByObjectKey';

interface IProps {
  advisoriesByLineId: IEntities<IFuture<ILineAdvisory[] | null>>;
  loadData: (station: IStation) => void;
  platformsByStationId: IEntities<IFuture<IStationPlatform[]> | null>;
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
    this.initData();
    this.updateLastUpdateString();
  }

  public componentDidUpdate(prevProps: IProps) {
    const { platformsByStationId, station } = this.props;

    if (platformsByStationId !== prevProps.platformsByStationId) {
      this.updateLastUpdateString();
    }

    if (station !== prevProps.station) {
      this.initData();
    }
  }

  public componentWillUnmount() {
    clearTimeout(this.timer);
  }

  public render() {
    const { platformsByStationId, station } = this.props;

    const platformFuture = platformsByStationId[station.id];
    if (!platformFuture) {
      return null;
    }
    const [platforms, { error }] = platformFuture;

    return (
      <div className={styles.TimeTable}>
        {error
          ? station.lineIds.map(this.renderErrorLine)
          : platforms && platforms.length
          ? platforms.sort(sortByObjectKey('lineId')).map(this.renderPlatform)
          : station.lineIds.sort(naturalCompare).map(this.renderLoadingLine)}
      </div>
    );
  }

  public renderErrorLine = (lineId: string) => {
    const { advisoriesByLineId, loadData, station } = this.props;

    return (
      <LinedBlock
        key={lineId}
        lineId={lineId}
        title={
          <Link to={`/station/${station.id}?lineId=${lineId}`}>
            {station.name}
          </Link>
        }
        subtitle={
          <>
            <LineAdvisories advisoriesFuture={advisoriesByLineId[lineId]} />
            <ButtonLink onClick={() => loadData(station)}>reload</ButtonLink>
          </>
        }
      >
        <div className={styles.directionsError}>No train information</div>
      </LinedBlock>
    );
  };

  public renderLoadingLine = (lineId: string) => {
    const { advisoriesByLineId, station } = this.props;

    return (
      <LinedBlock
        lineId={lineId}
        title={
          <Link to={`/station/${station.id}?lineId=${lineId}`}>
            {station.name}
          </Link>
        }
        subtitle={
          <>
            <LineAdvisories advisoriesFuture={advisoriesByLineId[lineId]} />
            loading
          </>
        }
        key={lineId}
      >
        <div className={styles.directions}>
          <div className={styles.direction}>
            <div className={styles.directionName}>
              <LoadingBlock width={100} />
            </div>
            <div className={styles.times}>
              <LoadingBlock width={210} />
            </div>
          </div>
          <div className={styles.direction}>
            <div className={styles.directionName}>
              <LoadingBlock width={80} />
            </div>
            <div className={styles.times}>
              <LoadingBlock width={230} />
            </div>
          </div>
        </div>
      </LinedBlock>
    );
  };

  public renderPlatform = ({ lineId, directions }: IStationPlatform) => {
    const { lastUpdateString } = this.state;
    const { advisoriesByLineId, platformsByStationId, station } = this.props;

    const platformFuture = platformsByStationId[station.id];
    if (!platformFuture) {
      return null;
    }

    const [, { loading }] = platformFuture;

    const hasDirections = directions && directions.length;
    return (
      <LinedBlock
        lineId={lineId}
        title={
          <Link to={`/station/${station.id}?lineId=${lineId}`}>
            {station.name}
          </Link>
        }
        subtitle={
          loading ? (
            'loading'
          ) : (
            <>
              <LineAdvisories advisoriesFuture={advisoriesByLineId[lineId]} />
              {lastUpdateString}
              {lastUpdateString && (
                <>
                  {', '}
                  <ButtonLink onClick={this.loadData}>reload</ButtonLink>
                </>
              )}
            </>
          )
        }
        key={lineId}
      >
        <div className={styles.directions}>
          {hasDirections ? (
            directions.map(this.renderDirection)
          ) : (
            <div className={styles.directionEmpty}>No train information.</div>
          )}
        </div>
      </LinedBlock>
    );
  };

  public renderDirection = ({
    name: directionName,
    times,
  }: IStationPlatformDirection) => (
    <div key={directionName} className={styles.direction}>
      <div className={styles.directionName}>{directionName}</div>
      <div className={styles.times}>
        {times
          .filter((_, index) => index < 3)
          .map(this.renderTime)
          .join(', ')}
      </div>
    </div>
  );

  public renderTime = ({ minutes }: IStationPlatformDirectionTime) =>
    minutes === 0
      ? 'Now'
      : typeof minutes === 'number'
      ? `${minutes} min`
      : minutes;

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

    let lastUpdateString = 'seconds ago';
    let delta = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);

    if (delta > 10) {
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

  public initData = () => {
    const { platformsByStationId, station } = this.props;
    const platformFuture = platformsByStationId[station.id];

    // If there is data, don't reload
    if (platformFuture) {
      return;
    }

    this.loadData();
  };

  public loadData = () => {
    const { loadData, station } = this.props;
    loadData(station);
  };
}

export default TimeTable;
