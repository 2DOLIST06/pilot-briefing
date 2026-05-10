'use client';

import { FormEvent, useState } from 'react';
import { BriefingResult, FlightType } from '@/lib/weather/types';

export function BriefingForm() {
  const [result, setResult] = useState<BriefingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const departureIcao = String(formData.get('departureIcao') ?? '').toUpperCase();
    const arrivalIcao = String(formData.get('arrivalIcao') ?? '').toUpperCase();
    const flightDate = String(formData.get('flightDate') ?? '');
    const departureLocalTime = String(formData.get('departureLocalTime') ?? '');
    const flightType = String(formData.get('flightType') ?? 'VFR') as FlightType;
    const plannedAltitudeFt = Number(formData.get('plannedAltitudeFt') ?? 0);

    setError(null);

    const response = await fetch('/api/briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        departureIcao,
        arrivalIcao,
        flightDate,
        departureLocalTime,
        flightType,
        plannedAltitudeFt
      })
    });

    if (!response.ok) {
      setResult(null);
      setError('Impossible de récupérer le briefing météo pour le moment.');
      return;
    }

    const briefing = (await response.json()) as BriefingResult;
    setResult(briefing);
  }

  return (
    <div className="space-y-6">
      <form className="grid gap-4 rounded-xl bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1"><span>Départ (OACI)</span><input name="departureIcao" required placeholder="LFMD" className="w-full rounded border p-2"/></label>
          <label className="space-y-1"><span>Arrivée (OACI)</span><input name="arrivalIcao" required placeholder="LFMT" className="w-full rounded border p-2"/></label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1"><span>Date du vol</span><input type="date" name="flightDate" required className="w-full rounded border p-2"/></label>
          <label className="space-y-1"><span>Heure locale départ</span><input type="time" name="departureLocalTime" required className="w-full rounded border p-2"/></label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1"><span>Type de vol</span><select name="flightType" defaultValue="VFR" className="w-full rounded border p-2"><option value="VFR">VFR</option><option value="IFR">IFR</option></select></label>
          <label className="space-y-1"><span>Altitude prévue (ft)</span><input type="number" name="plannedAltitudeFt" min={500} step={100} required className="w-full rounded border p-2"/></label>
        </div>
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white">Générer le dossier météo</button>
      </form>

      {error ? <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {result ? <ResultSection result={result} /> : null}
    </div>
  );
}

function ResultSection({ result }: { result: BriefingResult }) {
  return (
    <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
      {result.isDemoData ? (
        <p className="rounded border border-amber-300 bg-amber-50 p-3 font-semibold text-amber-800">
          Source officielle indisponible : affichage en mode démonstration (mock).
        </p>
      ) : (
        <p className="rounded border border-emerald-300 bg-emerald-50 p-3 font-semibold text-emerald-800">
          Données issues de la source officielle AviationWeather.gov (METAR/TAF bruts).
        </p>
      )}
      <div className="text-sm">
        <p><strong>Route:</strong> {result.request.departureIcao} → {result.request.arrivalIcao}</p>
        <p><strong>Date:</strong> {result.request.flightDate} à {result.request.departureLocalTime} (locale)</p>
        <p><strong>Type:</strong> {result.request.flightType} | <strong>Altitude:</strong> {result.request.plannedAltitudeFt} ft</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <WeatherBlock title="METAR départ" value={result.weather.departure.metar} />
        <WeatherBlock title="TAF départ" value={result.weather.departure.taf} />
        <WeatherBlock title="METAR arrivée" value={result.weather.arrival.metar} />
        <WeatherBlock title="TAF arrivée" value={result.weather.arrival.taf} />
      </div>

      <div>
        <h3 className="mb-2 font-semibold">Points d’attention météo</h3>
        {result.attentionPoints.length === 0 ? (
          <p className="text-sm">Aucun mot-clé surveillé détecté dans les messages météo.</p>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {result.attentionPoints.map((item) => (
              <li key={item.token}>{item.token}: {item.message}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function WeatherBlock({ title, value }: { title: string; value: string }) {
  return (
    <article className="rounded border bg-slate-50 p-3">
      <h4 className="mb-1 text-sm font-semibold">{title}</h4>
      <p className="font-mono text-xs text-slate-800">{value}</p>
    </article>
  );
}
