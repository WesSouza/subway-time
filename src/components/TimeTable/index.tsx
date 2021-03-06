import { Link } from '@reach/router';
import naturalCompare from 'natural-compare-lite';
import React, { useCallback, useEffect, useState } from 'react';

import { Times } from '~/src/constants/times';
import { Entities } from '~/src/lib/entities';
import { Future } from '~/src/lib/future';
import sortByObjectKey from '~/src/lib/sortByObjectKey';
import { LineAdvisory } from '~/src/state/line/types';
import {
  Station,
  StationPlatform,
  StationPlatformDirection,
  StationPlatformDirectionTime,
} from '~/src/state/station/types';

import { ButtonLink } from '../ButtonLink';
import LineAdvisories from '../LineAdvisories';
import { LinedBlock } from '../LinedBlock';
import { LoadingBlock } from '../LoadingBlock';
import * as styles from './styles.css';

interface Props {
  advisoriesByLineId: Entities<Future<LineAdvisory[] | null>>;
  loadData: (station: Station) => void;
  platformsByStationId: Entities<Future<StationPlatform[]> | null>;
  station: Station;
}

export const TimeTable = ({
  advisoriesByLineId,
  loadData,
  platformsByStationId,
  station,
}: Props) => {
  const [lastUpdateString, setLastUpdateString] = useState<string | null>(null);

  // # Callbacks

  const loadStationData = useCallback(() => {
    loadData(station);
  }, [loadData, station]);

  const updateLastUpdateString = useCallback(() => {
    const platformFuture = platformsByStationId[station.id];
    if (!platformFuture) {
      return;
    }

    const [platforms] = platformFuture;

    if (!platforms || !platforms[0] || !platforms[0].lastUpdate) {
      setLastUpdateString(null);
      return;
    }

    const { lastUpdate } = platforms[0];

    let lastUpdateString = 'seconds ago';
    let delta = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);

    if (delta < Times.stationAutoReload / 1000) {
      lastUpdateString = 'just updated';
    } else if (delta > 300) {
      lastUpdateString = `more than 5 minutes ago`;
    } else if (delta > 60) {
      delta = Math.floor(delta / 60);
      lastUpdateString = `${delta} minute${delta > 1 ? 's' : ''} ago`;
    } else if (delta > 5) {
      lastUpdateString = `${delta} seconds ago`;
    }

    setLastUpdateString(lastUpdateString);
  }, [platformsByStationId, station]);

  // # Effects

  useEffect(() => {
    const platformFuture = platformsByStationId[station.id];

    // If there is data, don't reload
    if (platformFuture) {
      const [platforms, { loading }] = platformFuture;
      if (loading || !platforms || !platforms[0] || !platforms[0].lastUpdate) {
        return;
      }

      const { lastUpdate } = platforms[0];
      if (lastUpdate.valueOf() + Times.stationAutoReload > Date.now()) {
        return;
      }
    }

    loadData(station);
  }, [loadData, platformsByStationId, station]);

  useEffect(() => {
    updateLastUpdateString();

    const timer = setInterval(() => {
      updateLastUpdateString();
    }, Times.stationUpdatedRenderReload);

    return () => {
      clearTimeout(timer);
    };
  }, [updateLastUpdateString]);

  useEffect(() => {
    const timer = setInterval(() => {
      loadData(station);
    }, Times.stationAutoReload);

    return () => {
      clearTimeout(timer);
    };
  }, [loadData, station]);

  // # Renders

  const renderTime = useCallback(
    ({ minutes }: StationPlatformDirectionTime, index: number) => (
      <React.Fragment key={`${minutes} ${index}`}>
        {index !== 0 ? ', ' : ''}
        <span className={styles.minute}>
          {minutes === 0
            ? 'Now'
            : typeof minutes === 'number'
            ? `${minutes} min`
            : minutes}
        </span>
      </React.Fragment>
    ),
    [],
  );

  const renderDirection = useCallback(
    ({ name: directionName, times }: StationPlatformDirection) => (
      <div key={directionName} className={styles.direction}>
        <div className={styles.directionName}>{directionName}</div>
        <div className={styles.times}>{times.map(renderTime)}</div>
      </div>
    ),
    [renderTime],
  );

  const renderPlatform = useCallback(
    ({ lineId, directions }: StationPlatform) => {
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
                    <ButtonLink onClick={loadStationData}>reload</ButtonLink>
                  </>
                )}
              </>
            )
          }
          key={lineId}
        >
          <div className={styles.directions}>
            {hasDirections ? (
              directions.map(renderDirection)
            ) : (
              <div className={styles.directionEmpty}>No train information.</div>
            )}
          </div>
        </LinedBlock>
      );
    },
    [
      advisoriesByLineId,
      lastUpdateString,
      loadStationData,
      platformsByStationId,
      renderDirection,
      station,
    ],
  );

  const renderErrorLine = useCallback(
    (lineId: string) => (
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
            <ButtonLink onClick={loadStationData}>reload</ButtonLink>
          </>
        }
      >
        <div className={styles.directionsError}>No train information</div>
      </LinedBlock>
    ),
    [advisoriesByLineId, loadStationData, station],
  );

  const renderLoadingLine = useCallback(
    (lineId: string) => (
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
    ),
    [advisoriesByLineId, station],
  );

  // # Final render

  const platformFuture = platformsByStationId[station.id];
  if (!platformFuture) {
    return null;
  }

  const [platforms, { error }] = platformFuture;

  return (
    <div className={styles.TimeTable}>
      {error
        ? station.lineIds.map(renderErrorLine)
        : platforms && platforms.length
        ? [...platforms].sort(sortByObjectKey('lineId')).map(renderPlatform)
        : [...station.lineIds].sort(naturalCompare).map(renderLoadingLine)}
    </div>
  );
};
