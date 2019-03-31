import * as React from 'react';

import { IEntities } from '~/lib/entities';
import { emptyFuture, IFuture, IFutureLoading } from '~/lib/future';
import { ILineAdvisory } from '~/state/line';

import styles from './styles.css';

interface IProps {
  advisoriesByLineId: IEntities<IFuture<ILineAdvisory[] | null> | null>;
  filterByLineIds: string[];
}

class LineAdvisory extends React.Component<IProps> {
  public render() {
    const [advisories, { error }] = this.getAdvisories();

    if (error) {
      console.error(error);
      return <div className={styles.LineAdvisories}>Unknown advisories</div>;
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
    const { advisoriesByLineId, filterByLineIds } = this.props;
    if (!advisoriesByLineId) {
      return emptyFuture();
    }

    let mergedAdvisories: ILineAdvisory[] = [];
    let error: Error | null = null;
    let loading: IFutureLoading | null = null;

    if (filterByLineIds.length) {
      filterByLineIds.forEach(lineId => {
        const advisoriesFuture = advisoriesByLineId[lineId];
        if (!advisoriesFuture) {
          return;
        }
        const [
          advisories,
          { error: advisoriesError, loading: advisoriesLoading },
        ] = advisoriesFuture;

        if (advisories && advisories.length) {
          mergedAdvisories = mergedAdvisories.concat(advisories);
        }

        if (advisoriesError) {
          error = advisoriesError;
        }

        if (advisoriesLoading) {
          loading = advisoriesLoading;
        }
      });
    } else {
      return emptyFuture();
    }

    return [mergedAdvisories, { error, loading }];
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
