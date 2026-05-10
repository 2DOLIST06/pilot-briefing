import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/lib/weather/weatherService';
import { BriefingRequest } from '@/lib/weather/types';

const weatherService = new WeatherService();

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<BriefingRequest>;

    const departureIcao = body.departureIcao?.trim().toUpperCase() ?? '';
    const arrivalIcao = body.arrivalIcao?.trim().toUpperCase() ?? '';

    if (!departureIcao && !arrivalIcao) {
      return NextResponse.json({ error: 'Paramètres invalides.' }, { status: 400 });
    }

    const normalizedDepartureIcao = departureIcao || arrivalIcao;
    const normalizedArrivalIcao = arrivalIcao || departureIcao;

    const briefing = await weatherService.buildBriefing({
      departureIcao: normalizedDepartureIcao,
      arrivalIcao: normalizedArrivalIcao,
      flightDate: body.flightDate || new Date().toISOString().slice(0, 10),
      departureLocalTime: body.departureLocalTime || '12:00',
      flightType: body.flightType || 'VFR',
      plannedAltitudeFt: Number(body.plannedAltitudeFt || 3000)
    });

    return NextResponse.json(briefing);
  } catch (error) {
    console.error('Erreur API briefing', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
