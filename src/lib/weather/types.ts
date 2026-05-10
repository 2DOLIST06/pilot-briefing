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
  source: 'mock' | 'aviationweather.gov';
};

export type BriefingWeather = {
  departure: WeatherReport;
  arrival: WeatherReport;
};

export type BriefingChart = {
  title: string;
  description: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type BriefingAttachments = {
  temsi: BriefingChart;
  wintem: BriefingChart;
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
  attachments: BriefingAttachments;
  dossierText: string;
  attentionPoints: WeatherAttentionPoint[];
  isDemoData: boolean;
};

export interface WeatherProvider {
  getWeatherForRoute(input: Pick<BriefingRequest, 'departureIcao' | 'arrivalIcao'>): Promise<BriefingWeather>;
}
