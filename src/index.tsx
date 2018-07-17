import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

import './global.css';

if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  location.href = location.href.replace(/^http:\/\//, 'https://');
} else {
  ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
}
