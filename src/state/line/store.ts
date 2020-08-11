import { emptyFuture } from '~/src/lib/future';
import { StateManager } from '~/src/lib/StateManager';

import { LineState } from './types';

export const lineStore = new StateManager<LineState>({
  advisoriesByLineId: {},
  linesById: emptyFuture(),
});
