import { EditableTextContent } from '@/components/EditableTextContent';
import { SiteHeader } from '@/components/SiteHeader';

export default function MassPage() {
  return (
    <main className='mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 p-4 md:p-8'>
      <SiteHeader />
      <EditableTextContent pageKey='masse-centrage' title='Rubrique Masse & centrage' />
    </main>
  );
}
