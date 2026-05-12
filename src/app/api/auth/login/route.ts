import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth/password';
import { readUsers } from '@/lib/auth/userStore';

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');

  const users = await readUsers();
  const user = users.find((item) => item.email === email);
  if (!user || !verifyPassword(password, user.salt, user.passwordHash)) {
    return NextResponse.json({ error: 'Identifiants invalides.' }, { status: 401 });
  }

  return NextResponse.json({ ok: true, user: { fullName: user.fullName, email: user.email } });
}
