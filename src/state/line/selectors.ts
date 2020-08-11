import { LineState } from './types';

export function getAdvisoriesByLineId(state: LineState) {
  return state.advisoriesByLineId;
}

export function getLinesById(state: LineState) {
  return state.linesById;
}
