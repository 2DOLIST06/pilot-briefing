import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { EditableTextContent } from '@/components/EditableTextContent';

export default function HomePage() {
  return (
    <main className='mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 p-4 md:p-8'>
      <SiteHeader />
      <section className='rounded-xl bg-gradient-to-r from-sky-700 to-blue-900 p-6 text-white shadow-sm'>
        <h2 className='text-3xl font-bold'>Bannière d’accueil</h2>
        <p className='mt-2 max-w-2xl text-blue-100'>
          Accédez rapidement aux rubriques météo et masse & centrage depuis le menu.
        </p>
        <div className='mt-4 flex flex-wrap gap-2'>
          <Link href='/meteo' className='rounded bg-white px-4 py-2 text-sm font-semibold text-sky-900'>
            Ouvrir Météo
          </Link>
          <Link href='/masse-centrage' className='rounded border border-white px-4 py-2 text-sm font-semibold text-white'>
            Ouvrir Masse & centrage
          </Link>
        </div>
      </section>
      <EditableTextContent pageKey='accueil' title='Rubrique Accueil' />
    </main>
  );
}
