import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/lib/weather/weatherService';
import { BriefingRequest } from '@/lib/weather/types';

const weatherService = new WeatherService();

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<BriefingRequest>;

    if (!body.departureIcao || !body.arrivalIcao || !body.flightDate || !body.departureLocalTime || !body.flightType || !body.plannedAltitudeFt) {
      return NextResponse.json({ error: 'Paramètres invalides.' }, { status: 400 });
    }

    const briefing = await weatherService.buildBriefing({
      departureIcao: body.departureIcao,
      arrivalIcao: body.arrivalIcao,
      flightDate: body.flightDate,
      departureLocalTime: body.departureLocalTime,
      flightType: body.flightType,
      plannedAltitudeFt: Number(body.plannedAltitudeFt)
    });

    return NextResponse.json(briefing);
  } catch (error) {
    console.error('Erreur API briefing', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
