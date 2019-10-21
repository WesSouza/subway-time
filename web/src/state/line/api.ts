import { get, Endpoints } from '~/lib/api';

import { Line, LineAdvisory } from './types';

export interface ApiSubwayAdvisory {
  SituationNumber: string;
  ReasonName: string;
  Summary: string;
  LongDescription: string;
}

export interface ApiSubwayLine {
  id: string;
  color: string;
}

export async function apiAdvisoriesByLineId(
  lineId: string,
): Promise<LineAdvisory[]> {
  const advisories = await get<ApiSubwayAdvisory[] | ''>(
    Endpoints.LineAdvisories,
    {
      lineId,
    },
  );

  if (advisories === '') {
    return [];
  }

  return advisories.map(advisory => ({
    id: advisory.SituationNumber,
    reason: advisory.ReasonName,
    summary: advisory.Summary,
    html: advisory.LongDescription,
  }));
}

export async function apiLines(): Promise<Line[]> {
  return get<ApiSubwayLine[]>(Endpoints.Lines);
}
