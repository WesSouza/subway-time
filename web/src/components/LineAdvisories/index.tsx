import * as React from 'react';

import { ILineAdvisory } from '~/state/line';

import styles from './styles.css';

interface IProps {
  advisories: ILineAdvisory[];
}

class LineAdvisory extends React.Component<IProps> {
  public render() {
    const { advisories } = this.props;
    return (
      <div className={styles.LineAdvisories}>
        {advisories && advisories.length ? (
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

  public openAdvisoriesDetail = () => {
    const { advisories } = this.props;
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
