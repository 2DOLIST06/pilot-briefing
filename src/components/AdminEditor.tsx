'use client';

import { FormEvent, useEffect, useState } from 'react';
import { defaultContent, STORAGE_KEY, type ContentPageKey, type ContentPages } from '@/lib/contentPages';

const fields: Array<{ key: ContentPageKey; label: string }> = [
  { key: 'accueil', label: 'Texte Accueil' },
  { key: 'meteo', label: 'Texte Météo' },
  { key: 'masse-centrage', label: 'Texte Masse & centrage' }
];

export function AdminEditor() {
  const [form, setForm] = useState<ContentPages>(defaultContent);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Partial<ContentPages>;
      setForm({ ...defaultContent, ...parsed });
    } catch {
      setForm(defaultContent);
    }
  }, []);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setMessage('Contenu sauvegardé. Les pages sont mises à jour via le header.');
  };

  return (
    <form onSubmit={onSubmit} className='space-y-4 rounded-xl bg-white p-6 shadow-sm'>
      <h2 className='text-2xl font-semibold'>Éditeur admin</h2>
      <p className='text-sm text-slate-600'>Modifiez les zones de texte pour Accueil, Météo et Masse & centrage.</p>
      {fields.map(({ key, label }) => (
        <label key={key} className='block space-y-2'>
          <span className='text-sm font-medium text-slate-900'>{label}</span>
          <textarea
            value={form[key]}
            onChange={(event) => setForm((previous) => ({ ...previous, [key]: event.target.value }))}
            rows={5}
            className='w-full rounded border border-slate-300 p-3 text-sm outline-none ring-slate-400 transition focus:ring-2'
          />
        </label>
      ))}
      <button type='submit' className='rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white'>
        Sauvegarder
      </button>
      {message ? <p className='text-sm text-emerald-700'>{message}</p> : null}
    </form>
  );
}
