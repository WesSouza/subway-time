import { createState } from '~/lib/simple-state';

import { apiAdvisoriesByLineId, apiLines } from './api';

import { IEntities } from '~/lib/entities';
import {
  emptyFuture,
  errorFuture,
  IFuture,
  loadingFuture,
  valueFuture,
} from '~/lib/future';

// # Interfaces

export interface ILineState {
  advisoriesByLineId: IEntities<IFuture<ILineAdvisory[]>>;
  linesById: IFuture<IEntities<ILine>>;
}

export interface ILine {
  id: string;
  color: string;
}

export interface ILineAdvisory {
  id: string;
  html: string;
  reason: string;
  summary: string;
}

// # State

export const lineState = createState<ILineState>({
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
    const linesById: { [lineId: string]: ILine } = {};

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
