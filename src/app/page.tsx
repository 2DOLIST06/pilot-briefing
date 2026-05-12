import { BriefingForm } from '@/components/BriefingForm';
import { Disclaimer } from '@/components/Disclaimer';
import { MassBalanceTool } from '@/components/MassBalanceTool';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 p-4 md:p-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Pilot Weather Briefing</h1>
        <p className="text-slate-700">
          Application MVP de préparation d’un premier dossier météo VFR à partir de deux aérodromes et d’une heure de départ.
        </p>
      </header>
      <Disclaimer />
      <section className='rounded-xl bg-white p-2 shadow-sm'>
        <div className='flex flex-wrap gap-2'>
          <a href='#meteo' className='rounded bg-slate-900 px-3 py-2 text-sm text-white'>Briefing météo</a>
          <a href='#masse' className='rounded border border-slate-300 px-3 py-2 text-sm'>Masse & centrage</a>
        </div>
      </section>
      <section id='meteo'><BriefingForm /></section>
      <section id='masse'><MassBalanceTool /></section>
    </main>
  );
}
