import { get, Endpoints } from '~/lib/api';

import { Line, LineAdvisory } from './index';

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

export const apiAdvisoriesByLineId = async (
  lineId: string,
): Promise<LineAdvisory[]> => {
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
};

export const apiLines = async (): Promise<Line[]> => {
  return get<ApiSubwayLine[]>(Endpoints.Lines);
};
