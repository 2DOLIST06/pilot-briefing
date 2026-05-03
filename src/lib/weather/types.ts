export type FlightType = 'VFR' | 'IFR';

export type BriefingRequest = {
  departureIcao: string;
  arrivalIcao: string;
  flightDate: string;
  departureLocalTime: string;
  flightType: FlightType;
  plannedAltitudeFt: number;
};

export type WeatherReport = {
  metar: string;
  taf: string;
  source: 'mock';
};

export type BriefingWeather = {
  departure: WeatherReport;
  arrival: WeatherReport;
};

export type AttentionLevel = 'info' | 'caution';

export type WeatherAttentionPoint = {
  token: string;
  message: string;
  level: AttentionLevel;
};

export type BriefingResult = {
  request: BriefingRequest;
  weather: BriefingWeather;
  attentionPoints: WeatherAttentionPoint[];
  isDemoData: boolean;
};

export interface WeatherProvider {
  getWeatherForRoute(input: Pick<BriefingRequest, 'departureIcao' | 'arrivalIcao'>): Promise<BriefingWeather>;
}
