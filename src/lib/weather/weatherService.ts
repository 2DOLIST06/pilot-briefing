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

    const attachments = this.buildAttachments(request);

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

  private buildAttachments(request: BriefingRequest): BriefingAttachments {
    const dateTag = request.flightDate;

    return {
      temsi: {
        title: 'Carte TEMSI',
        description: 'Consultez la carte TEMSI (temps significatif) pour compléter l’analyse route.',
        sourceLabel: 'Météo-France Aéro',
        sourceUrl: `https://meteofrance.com/previsions-meteo-aeronautique?date=${dateTag}`
      },
      wintem: {
        title: 'Carte WINTEM',
        description: 'Consultez la carte WINTEM (vent/température en altitude) pour la préparation en croisière.',
        sourceLabel: 'Météo-France Aéro',
        sourceUrl: `https://meteofrance.com/previsions-meteo-aeronautique?date=${dateTag}`
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
