import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth/password';
import { readUsers, writeUsers } from '@/lib/auth/userStore';

export async function POST(request: Request) {
  const body = await request.json();
  const fullName = String(body.fullName ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');

  if (!fullName || !email || password.length < 8) {
    return NextResponse.json({ error: 'Données invalides.' }, { status: 400 });
  }

  const users = await readUsers();
  if (users.some((user) => user.email === email)) {
    return NextResponse.json({ error: 'Email déjà utilisé.' }, { status: 409 });
  }

  const { hash, salt } = hashPassword(password);
  users.push({ id: crypto.randomUUID(), fullName, email, passwordHash: hash, salt, createdAt: new Date().toISOString() });
  await writeUsers(users);

  return NextResponse.json({ ok: true, user: { fullName, email } });
}
