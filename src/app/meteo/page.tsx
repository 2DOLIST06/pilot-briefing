import { EditableTextContent } from '@/components/EditableTextContent';
import { SiteHeader } from '@/components/SiteHeader';
import { BriefingForm } from '@/components/BriefingForm';

export default function MeteoPage() {
  return (
    <main className='mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 p-4 md:p-8'>
      <SiteHeader />
      <EditableTextContent pageKey='meteo' title='Rubrique Météo' />
      <BriefingForm />
    </main>
  );
}
