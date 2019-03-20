import { get, Endpoints } from '~/lib/api';

import { ILine, ILineAdvisory } from './index';

export interface IApiSubwayAdvisory {
  SituationNumber: string;
  ReasonName: string;
  Summary: string;
  LongDescription: string;
}

export interface IApiSubwayLine {
  id: string;
  color: string;
}

export const apiAdvisoriesByLineId = async (
  lineId: string,
): Promise<ILineAdvisory[]> => {
  const advisories = await get<IApiSubwayAdvisory[] | ''>(
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

export const apiLines = async (): Promise<ILine[]> => {
  return get<IApiSubwayLine[]>(Endpoints.Lines);
};
