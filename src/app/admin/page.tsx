import { AdminEditor } from '@/components/AdminEditor';
import { SiteHeader } from '@/components/SiteHeader';

export default function AdminPage() {
  return (
    <main className='mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 p-4 md:p-8'>
      <SiteHeader />
      <AdminEditor />
    </main>
  );
}
