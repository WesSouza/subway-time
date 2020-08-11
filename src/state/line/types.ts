import { Entities } from '~/lib/entities';
import { Future } from '~/lib/future';

export interface LineState {
  advisoriesByLineId: Entities<Future<LineAdvisory[]>>;
  linesById: Future<Entities<Line>>;
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
