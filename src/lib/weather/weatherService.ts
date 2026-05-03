import { analyzeWeatherTexts } from './analyzeWeather';
import { MockWeatherProvider } from './mockWeatherProvider';
import { BriefingRequest, BriefingResult, WeatherProvider } from './types';

export class WeatherService {
  constructor(private readonly provider: WeatherProvider = new MockWeatherProvider()) {}

  async buildBriefing(request: BriefingRequest): Promise<BriefingResult> {
    const weather = await this.provider.getWeatherForRoute({
      departureIcao: request.departureIcao,
      arrivalIcao: request.arrivalIcao
    });

    const attentionPoints = analyzeWeatherTexts([
      weather.departure.metar,
      weather.departure.taf,
      weather.arrival.metar,
      weather.arrival.taf
    ]);

    return {
      request,
      weather,
      attentionPoints,
      isDemoData: true
    };
  }
}
