import * as React from 'react';

import { IEntities } from '~/lib/entities';
import { IFuture, valueFuture } from '~/lib/future';
import { ILineAdvisory } from '~/state/line';

import styles from './styles.css';

interface IProps {
  advisoriesFuture: IFuture<IEntities<ILineAdvisory[] | null>>;
  filterByLineIds: string[];
}

class LineAdvisory extends React.Component<IProps> {
  public render() {
    const [advisories, { error, loading }] = this.getAdvisories();

    if (error) {
      return <div className={styles.LineAdvisories}>Error.</div>;
    }

    if (loading) {
      return <div className={styles.LineAdvisories}>Loading.</div>;
    }

    if (!advisories) {
      return null;
    }

    return (
      <div className={styles.LineAdvisories}>
        {advisories.length ? (
          <button
            type="button"
            className={styles.openButton}
            onClick={this.openAdvisoriesDetail}
          >
            {advisories.length} advisor{advisories.length > 1 ? `ies` : 'y'}
          </button>
        ) : null}
      </div>
    );
  }

  public getAdvisories = (): IFuture<ILineAdvisory[]> => {
    const { advisoriesFuture, filterByLineIds } = this.props;
    const [advisoriesByLineId, { error, loading }] = advisoriesFuture;

    let advisories: ILineAdvisory[] = [];

    if (!advisoriesByLineId || error || loading) {
      return [[], { error, loading }];
    }

    if (filterByLineIds.length) {
      filterByLineIds.forEach(lineId => {
        const advisoriesForLine = advisoriesByLineId[lineId];
        if (advisoriesForLine) {
          advisories = [...advisories, ...advisoriesForLine];
        }
      });
    } else {
      Object.keys(advisoriesByLineId).forEach(lineId => {
        const advisoriesForLine = advisoriesByLineId[lineId];
        if (advisoriesForLine) {
          advisories = [...advisories, ...advisoriesForLine];
        }
      });
    }

    return valueFuture(advisories);
  };

  public openAdvisoriesDetail = () => {
    const [advisories] = this.getAdvisories();
    if (!advisories) {
      return;
    }

    const joinedHtml = advisories.reduce(
      (html, advisory, index) =>
        `${html}${index === 0 ? '' : '<hr>'}${advisory.html}`,
      '',
    );
    const win = window.open('about:blank', '_blank', 'width=450,height=600');
    if (win) {
      // Look ma, 1996!
      win.document.write(
        `<base href="http://subwaytime.mta.info/">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <style>body {font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;}</style>
        <script>function ShowHide (id) {document.getElementById(id).style.display=''} </script>
        ${joinedHtml}`,
      );
    }
  };
}

export default LineAdvisory;
