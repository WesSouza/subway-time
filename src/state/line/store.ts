import { emptyFuture } from '~/lib/future';
import { StateManager } from '~/lib/StateManager';

import { LineState } from './types';

export const lineStore = new StateManager<LineState>({
  advisoriesByLineId: {},
  linesById: emptyFuture(),
});
