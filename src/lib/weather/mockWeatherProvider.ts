import { BriefingWeather, WeatherProvider } from './types';

const demoMetar = {
  LFMD: 'LFMD 031530Z 21012KT 9999 SCT030 BKN060 21/14 Q1014 NOSIG',
  LFMT: 'LFMT 031530Z 18015KT 8000 BR FEW020 BKN050 20/15 Q1013 TEMPO 4000'
};

const demoTaf = {
  LFMD: 'TAF LFMD 031100Z 0312/0412 22010KT 9999 SCT030 BKN080 TEMPO 0318/0322 TSRA BKN035CB',
  LFMT: 'TAF LFMT 031100Z 0312/0412 17012KT 9999 BKN040 PROB30 0316/0320 3000 FG OVC002'
};

export class MockWeatherProvider implements WeatherProvider {
  async getWeatherForRoute({ departureIcao, arrivalIcao }: { departureIcao: string; arrivalIcao: string; }): Promise<BriefingWeather> {
    const dep = departureIcao.toUpperCase();
    const arr = arrivalIcao.toUpperCase();

    return {
      departure: {
        metar: demoMetar[dep as keyof typeof demoMetar] ?? `${dep} 031530Z VRB03KT CAVOK 18/12 Q1015`,
        taf: demoTaf[dep as keyof typeof demoTaf] ?? `TAF ${dep} 031100Z 0312/0412 VRB05KT 9999 SCT030`,
        source: 'mock'
      },
      arrival: {
        metar: demoMetar[arr as keyof typeof demoMetar] ?? `${arr} 031530Z 20008KT 9999 FEW025 19/13 Q1014`,
        taf: demoTaf[arr as keyof typeof demoTaf] ?? `TAF ${arr} 031100Z 0312/0412 20008KT 9999 FEW030`,
        source: 'mock'
      }
    };
  }
}
