import { errorFuture, loadingFuture, valueFuture } from '~/src/lib/future';

import { apiAdvisoriesByLineId, apiLines } from './api';
import { lineStore } from './store';
import { Line } from './types';

export async function fetchLineAdvisories(lineId: string) {
  lineStore.mutate((lineState) => {
    lineState.advisoriesByLineId[lineId] = loadingFuture();
  });

  try {
    const lineAdvisories = await apiAdvisoriesByLineId(lineId);

    lineStore.mutate((lineState) => {
      lineState.advisoriesByLineId[lineId] = valueFuture(lineAdvisories);
    });
  } catch (error) {
    lineStore.mutate((lineState) => {
      lineState.advisoriesByLineId[lineId] = errorFuture(error);
    });
  }
}

export async function fetchLines() {
  lineStore.mutate((lineState) => {
    lineState.linesById = loadingFuture();
  });

  try {
    const linesById: { [lineId: string]: Line } = {};

    const lines = await apiLines();
    lines.forEach((line) => {
      linesById[line.id] = line;
    });

    lineStore.mutate((lineState) => {
      lineState.linesById = valueFuture(linesById);
    });
  } catch (error) {
    lineStore.mutate((lineState) => {
      lineState.linesById = errorFuture(error);
    });
  }
}
