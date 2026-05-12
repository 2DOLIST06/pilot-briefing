'use client';

import { useEffect, useState } from 'react';
import { ContentPageKey, defaultContent, STORAGE_KEY, type ContentPages } from '@/lib/contentPages';

type Props = {
  pageKey: ContentPageKey;
  title: string;
};

export function EditableTextContent({ pageKey, title }: Props) {
  const [content, setContent] = useState(defaultContent[pageKey]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<ContentPages>;
      if (parsed[pageKey]) {
        setContent(parsed[pageKey] as string);
      }
    } catch {
      setContent(defaultContent[pageKey]);
    }
  }, [pageKey]);

  return (
    <section className='rounded-xl bg-white p-6 shadow-sm'>
      <h2 className='mb-3 text-2xl font-semibold text-slate-900'>{title}</h2>
      <p className='whitespace-pre-wrap text-slate-700'>{content}</p>
    </section>
  );
}
