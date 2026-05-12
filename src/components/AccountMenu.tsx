'use client';

import { FormEvent, useState } from 'react';

type User = { fullName: string; email: string };

export function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isRegistering) return;
    setIsRegistering(true);
    setMessage('Création du compte en cours...');
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error ?? 'Erreur création compte.');
        return;
      }

      setUser(data.user);
      setMessage('Compte créé et connecté.');
      event.currentTarget.reset();
    } catch {
      setMessage('Impossible de joindre le serveur. Vérifiez que l’application tourne bien.');
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setMessage('Connexion en cours...');
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error ?? 'Erreur connexion.');
        return;
      }

      setUser(data.user);
      setMessage('Connexion réussie.');
    } catch {
      setMessage('Impossible de joindre le serveur. Vérifiez que l’application tourne bien.');
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <div className='relative'>
      <button onClick={() => setOpen((v) => !v)} className='rounded border border-slate-300 px-3 py-2 text-sm'>Mon compte ▾</button>
      {open ? (
        <div className='absolute right-0 z-20 mt-2 w-80 rounded-lg border bg-white p-4 shadow-lg'>
          {user ? <p className='mb-3 text-sm text-emerald-700'>Connecté: {user.fullName} ({user.email})</p> : null}
          <form className='mb-4 space-y-2' onSubmit={handleLogin}>
            <p className='text-sm font-semibold'>Se connecter</p>
            <input required type='email' name='email' placeholder='Email' className='w-full rounded border p-2 text-sm'/>
            <input required type='password' name='password' placeholder='Mot de passe' className='w-full rounded border p-2 text-sm'/>
            <button disabled={isLoggingIn} className='rounded bg-slate-900 px-3 py-2 text-xs text-white disabled:cursor-not-allowed disabled:opacity-60'>{isLoggingIn ? 'Connexion...' : 'Se connecter'}</button>
          </form>
          <form className='space-y-2' onSubmit={handleRegister}>
            <p className='text-sm font-semibold'>Créer un compte</p>
            <input required name='fullName' placeholder='Nom complet' className='w-full rounded border p-2 text-sm'/>
            <input required type='email' name='email' placeholder='Email' className='w-full rounded border p-2 text-sm'/>
            <input required minLength={8} type='password' name='password' placeholder='Mot de passe (8+)' className='w-full rounded border p-2 text-sm'/>
            <button disabled={isRegistering} className='rounded bg-blue-700 px-3 py-2 text-xs text-white disabled:cursor-not-allowed disabled:opacity-60'>{isRegistering ? 'Création...' : 'Créer un compte'}</button>
          </form>
          {message ? <p className='mt-3 text-xs text-slate-700'>{message}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
