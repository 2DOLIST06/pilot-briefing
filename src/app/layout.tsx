import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pilot Weather Briefing',
  description: 'Préparation météo VFR - version MVP avec données de démonstration'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
