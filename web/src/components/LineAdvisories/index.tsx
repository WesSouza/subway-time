import * as React from 'react';

import { IFuture } from '~/lib/future';
import { ILineAdvisory } from '~/state/line';

import { ButtonLink } from '../ButtonLink';

import styles from './styles.css';

interface IProps {
  advisoriesFuture: IFuture<ILineAdvisory[] | null> | null;
}

class LineAdvisory extends React.Component<IProps> {
  public render() {
    const { advisoriesFuture } = this.props;
    if (!advisoriesFuture) {
      return null;
    }

    const [advisories, { error }] = advisoriesFuture;

    if (error || !advisories || !advisories.length) {
      return null;
    }

    return (
      <span className={styles.LineAdvisories}>
        {advisories.length ? (
          <>
            <ButtonLink onClick={this.openAdvisoriesDetail}>
              {advisories.length} advisor{advisories.length > 1 ? `ies` : 'y'}
            </ButtonLink>
            {', '}
          </>
        ) : null}
      </span>
    );
  }

  public openAdvisoriesDetail = () => {
    const { advisoriesFuture } = this.props;
    if (!advisoriesFuture) {
      return;
    }

    const [advisories] = advisoriesFuture;
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
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, sans-serif; line-height:1.6; }
          img { vertical-align: baseline; }
          .plannedWorkDetail { padding-left: 2em; }
        </style>
        <script>function ShowHide (id) {document.getElementById(id).style.display=''} </script>
        ${joinedHtml}`,
      );
    }
  };
}

export default LineAdvisory;
