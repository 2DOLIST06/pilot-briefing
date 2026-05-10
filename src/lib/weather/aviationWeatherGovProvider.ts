import { BriefingWeather, WeatherProvider } from './types';

const API_BASE = 'https://aviationweather.gov/api/data';

type ReportKind = 'metar' | 'taf';

async function fetchRawReport(kind: ReportKind, icao: string): Promise<string> {
  const params = new URLSearchParams({
    ids: icao,
    format: 'raw'
  });

  const response = await fetch(`${API_BASE}/${kind}?${params.toString()}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Impossible de récupérer ${kind.toUpperCase()} pour ${icao} (HTTP ${response.status}).`);
  }

  const rawText = (await response.text()).trim();
  if (!rawText) {
    throw new Error(`Aucun ${kind.toUpperCase()} disponible pour ${icao}.`);
  }

  return rawText.split('\n')[0]?.trim() ?? rawText;
}

export class AviationWeatherGovProvider implements WeatherProvider {
  async getWeatherForRoute({ departureIcao, arrivalIcao }: { departureIcao: string; arrivalIcao: string; }): Promise<BriefingWeather> {
    const dep = departureIcao.toUpperCase();
    const arr = arrivalIcao.toUpperCase();

    const [depMetar, depTaf, arrMetar, arrTaf] = await Promise.all([
      fetchRawReport('metar', dep),
      fetchRawReport('taf', dep),
      fetchRawReport('metar', arr),
      fetchRawReport('taf', arr)
    ]);

    return {
      departure: {
        metar: depMetar,
        taf: depTaf,
        source: 'aviationweather.gov'
      },
      arrival: {
        metar: arrMetar,
        taf: arrTaf,
        source: 'aviationweather.gov'
      }
    };
  }
}
