import { createState } from '~/lib/simple-state';

import { apiAdvisoriesByLineId, apiLines } from './api';

import { Entities } from '~/lib/entities';
import {
  emptyFuture,
  errorFuture,
  IFuture,
  loadingFuture,
  valueFuture,
} from '~/lib/future';

// # Interfaces

export interface LineState {
  advisoriesByLineId: Entities<IFuture<LineAdvisory[]>>;
  linesById: IFuture<Entities<Line>>;
}

export interface Line {
  id: string;
  color: string;
}

export interface LineAdvisory {
  id: string;
  html: string;
  reason: string;
  summary: string;
}

// # State

export const lineState = createState<LineState>({
  advisoriesByLineId: {},
  linesById: emptyFuture(),
});

// # Actions

const fetchLineAdvisories = async (lineId: string) => {
  await lineState.set(({ advisoriesByLineId: lineAdvisoriesByLineId }) => ({
    advisoriesByLineId: {
      ...lineAdvisoriesByLineId,
      [lineId]: loadingFuture(),
    },
  }));

  try {
    const lineAdvisories = await apiAdvisoriesByLineId(lineId);

    await lineState.set(({ advisoriesByLineId: lineAdvisoriesByLineId }) => ({
      advisoriesByLineId: {
        ...lineAdvisoriesByLineId,
        [lineId]: valueFuture(lineAdvisories),
      },
    }));
  } catch (error) {
    await lineState.set(({ advisoriesByLineId: lineAdvisoriesByLineId }) => ({
      advisoriesByLineId: {
        ...lineAdvisoriesByLineId,
        [lineId]: errorFuture(error),
      },
    }));
  }
};

const fetchLines = async () => {
  await lineState.set({
    linesById: loadingFuture(),
  });

  try {
    const linesById: { [lineId: string]: Line } = {};

    const lines = await apiLines();
    lines.forEach(line => {
      linesById[line.id] = line;
    });

    await lineState.set({
      linesById: valueFuture(linesById),
    });
  } catch (error) {
    await lineState.set({
      linesById: errorFuture(error),
    });
  }
};

// # Export

export const lineActions = {
  fetchLineAdvisories,
  fetchLines,
};
