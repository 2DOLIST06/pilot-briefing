import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/meteo', label: 'Météo' },
  { href: '/masse-centrage', label: 'Masse & centrage' },
  { href: '/admin', label: 'Admin' }
];

export function SiteHeader() {
  return (
    <header className='rounded-xl bg-white p-4 shadow-sm'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h1 className='text-2xl font-bold text-slate-900'>Pilot Weather Briefing</h1>
        <nav className='flex flex-wrap gap-2'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='rounded border border-slate-300 px-3 py-2 text-sm text-slate-800 transition hover:bg-slate-100'
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
