import { analyzeWeatherTexts } from './analyzeWeather';
import { AviationWeatherGovProvider } from './aviationWeatherGovProvider';
import { MockWeatherProvider } from './mockWeatherProvider';
import { BriefingAttachments, BriefingRequest, BriefingResult, WeatherProvider } from './types';

export class WeatherService {
  constructor(private readonly provider: WeatherProvider = new AviationWeatherGovProvider()) {}

  async buildBriefing(request: BriefingRequest): Promise<BriefingResult> {
    const weather = await this.getWeatherWithFallback({
      departureIcao: request.departureIcao,
      arrivalIcao: request.arrivalIcao
    });

    const attachments = this.buildAttachments();

    const attentionPoints = analyzeWeatherTexts([
      weather.departure.metar,
      weather.departure.taf,
      weather.arrival.metar,
      weather.arrival.taf
    ]);

    const dossierText = [
      'DOSSIER METEO PILOTE',
      `Route: ${request.departureIcao} -> ${request.arrivalIcao}`,
      `Date/heure locale: ${request.flightDate} ${request.departureLocalTime}`,
      `Type/Altitude: ${request.flightType} / ${request.plannedAltitudeFt} ft`,
      '',
      `[METAR DEPART] ${weather.departure.metar}`,
      `[TAF DEPART] ${weather.departure.taf}`,
      `[METAR ARRIVEE] ${weather.arrival.metar}`,
      `[TAF ARRIVEE] ${weather.arrival.taf}`,
      '',
      `[TEMSI] ${attachments.temsi.sourceLabel}: ${attachments.temsi.sourceUrl}`,
      `[WINTEM] ${attachments.wintem.sourceLabel}: ${attachments.wintem.sourceUrl}`
    ].join('\n');

    return {
      request,
      weather,
      attachments,
      dossierText,
      attentionPoints,
      isDemoData: weather.departure.source === 'mock' || weather.arrival.source === 'mock'
    };
  }

  private buildAttachments(): BriefingAttachments {
    return {
      temsi: {
        title: 'Carte TEMSI',
        description: 'Visualisation intégrée de la carte des phénomènes significatifs (source officielle AWC/NOAA).',
        sourceLabel: 'AviationWeather (NOAA)',
        sourceUrl: `https://aviationweather.gov/gfa/`,
        embedUrl: `https://aviationweather.gov/gfa/#sigwx`
      },
      wintem: {
        title: 'Carte WINTEM',
        description: 'Visualisation intégrée des vents et températures d’altitude (source officielle AWC/NOAA).',
        sourceLabel: 'AviationWeather (NOAA)',
        sourceUrl: `https://aviationweather.gov/windtemp/`,
        embedUrl: `https://aviationweather.gov/windtemp/`
      }
    };
  }

  private async getWeatherWithFallback(input: Pick<BriefingRequest, 'departureIcao' | 'arrivalIcao'>) {
    try {
      return await this.provider.getWeatherForRoute(input);
    } catch (error) {
      console.error('Source officielle indisponible, bascule vers données mock.', error);
      return new MockWeatherProvider().getWeatherForRoute(input);
    }
  }
}
