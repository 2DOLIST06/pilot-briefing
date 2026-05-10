'use client';

import { FormEvent, useState } from 'react';
import { BriefingChart, BriefingResult, FlightType } from '@/lib/weather/types';

export function BriefingForm() {
  const [result, setResult] = useState<BriefingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [decodedView, setDecodedView] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const departureIcaoInput = String(formData.get('departureIcao') ?? '').toUpperCase().trim();
    const arrivalIcaoInput = String(formData.get('arrivalIcao') ?? '').toUpperCase().trim();
    const departureIcao = departureIcaoInput || arrivalIcaoInput;
    const arrivalIcao = arrivalIcaoInput || departureIcaoInput;
    const flightDate = String(formData.get('flightDate') ?? '') || new Date().toISOString().slice(0, 10);
    const departureLocalTime = String(formData.get('departureLocalTime') ?? '') || '12:00';
    const flightType = String(formData.get('flightType') ?? 'VFR') as FlightType;
    const plannedAltitudeFt = Number(formData.get('plannedAltitudeFt') ?? 3000);

    if (!departureIcao && !arrivalIcao) {
      setError('Veuillez renseigner au moins un aérodrome (départ ou arrivée).');
      setResult(null);
      return;
    }

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
          <label className="space-y-1"><span>Départ (OACI)</span><input name="departureIcao" placeholder="LFMD" className="w-full rounded border p-2"/></label>
          <label className="space-y-1"><span>Arrivée (OACI)</span><input name="arrivalIcao" placeholder="LFMT" className="w-full rounded border p-2"/></label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1"><span>Date du vol (optionnel)</span><input type="date" name="flightDate" className="w-full rounded border p-2"/></label>
          <label className="space-y-1"><span>Heure locale départ (optionnel)</span><input type="time" name="departureLocalTime" className="w-full rounded border p-2"/></label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1"><span>Type de vol</span><select name="flightType" defaultValue="VFR" className="w-full rounded border p-2"><option value="VFR">VFR</option><option value="IFR">IFR</option></select></label>
          <label className="space-y-1"><span>Altitude prévue (ft, optionnel)</span><input type="number" name="plannedAltitudeFt" min={500} step={100} className="w-full rounded border p-2"/></label>
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={decodedView} onChange={(event) => setDecodedView(event.target.checked)} />
          Afficher METAR/TAF décodés
        </label>
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white">Générer le dossier météo</button>
      </form>

      {error ? <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {result ? <ResultSection result={result} decodedView={decodedView} /> : null}
    </div>
  );
}

function ResultSection({ result, decodedView }: { result: BriefingResult; decodedView: boolean }) {
  const sameAerodrome = result.request.departureIcao === result.request.arrivalIcao;

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

      <div className="flex flex-wrap gap-2">
        <DownloadButton filename="dossier-meteo-complet.txt" content={result.dossierText} label="Télécharger le dossier complet" />
        <DownloadButton filename="metar-taf.txt" content={extractMetarTaf(result)} label="Télécharger METAR/TAF" />
      </div>

      <div className="text-sm">
        <p><strong>Route:</strong> {sameAerodrome ? `Aérodrome départ/arrivée: ${result.request.departureIcao}` : `${result.request.departureIcao} → ${result.request.arrivalIcao}`}</p>
        <p><strong>Date:</strong> {result.request.flightDate} à {result.request.departureLocalTime} (locale)</p>
        <p><strong>Type:</strong> {result.request.flightType} | <strong>Altitude:</strong> {result.request.plannedAltitudeFt} ft</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <WeatherBlock title="METAR départ" value={result.weather.departure.metar} decodedView={decodedView} />
        <WeatherBlock title="TAF départ" value={result.weather.departure.taf} decodedView={decodedView} />
        {!sameAerodrome ? <WeatherBlock title="METAR arrivée" value={result.weather.arrival.metar} decodedView={decodedView} /> : null}
        {!sameAerodrome ? <WeatherBlock title="TAF arrivée" value={result.weather.arrival.taf} decodedView={decodedView} /> : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <ChartBlock chart={result.attachments.temsi} />
        <ChartBlock chart={result.attachments.wintem} />
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

function WeatherBlock({ title, value, decodedView }: { title: string; value: string; decodedView: boolean }) {
  const displayedValue = decodedView ? decodeWeather(value) : value;

  return (
    <article className="rounded border bg-slate-50 p-3">
      <h4 className="mb-1 text-sm font-semibold">{title}</h4>
      <p className="text-xs text-slate-800">{displayedValue}</p>
    </article>
  );
}

function ChartBlock({ chart }: { chart: BriefingChart }) {
  return (
    <article className="rounded border bg-slate-50 p-3 text-sm">
      <h4 className="font-semibold">{chart.title}</h4>
      <p className="mt-1 text-xs text-slate-700">{chart.description}</p>
      <a href={chart.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-medium text-blue-700 underline">
        Ouvrir ({chart.sourceLabel})
      </a>
    </article>
  );
}

function DownloadButton({ filename, content, label }: { filename: string; content: string; label: string }) {
  function handleDownload() {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" onClick={handleDownload} className="rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-800 hover:bg-slate-100">
      {label}
    </button>
  );
}

function extractMetarTaf(result: BriefingResult): string {
  return [
    `[METAR DEPART] ${result.weather.departure.metar}`,
    `[TAF DEPART] ${result.weather.departure.taf}`,
    `[METAR ARRIVEE] ${result.weather.arrival.metar}`,
    `[TAF ARRIVEE] ${result.weather.arrival.taf}`
  ].join('\n');
}

function decodeWeather(report: string): string {
  const replacements: Array<[RegExp, string]> = [
    [/\bCAVOK\b/g, 'CAVOK (visibilité >= 10 km, pas de nuages significatifs sous 5000 ft)'],
    [/\bBKN(\d{3})\b/g, 'Nuages fragmentés à $100 ft'],
    [/\bOVC(\d{3})\b/g, 'Couvert à $100 ft'],
    [/\bSCT(\d{3})\b/g, 'Nuages épars à $100 ft'],
    [/\bFEW(\d{3})\b/g, 'Peu de nuages à $100 ft'],
    [/\bTS\b/g, 'orage'],
    [/\bRA\b/g, 'pluie'],
    [/\bSN\b/g, 'neige'],
    [/\bFG\b/g, 'brouillard'],
    [/\bKT\b/g, 'kt (nœuds)'],
    [/\bTEMPO\b/g, 'temporairement'],
    [/\bPROB(\d{2})\b/g, 'probabilité $1%'],
    [/\bNOSIG\b/g, 'pas de changement significatif']
  ];

  return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), report);
}
