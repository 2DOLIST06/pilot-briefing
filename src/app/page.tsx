import { BriefingForm } from '@/components/BriefingForm';
import { Disclaimer } from '@/components/Disclaimer';

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
      <BriefingForm />
    </main>
  );
}
