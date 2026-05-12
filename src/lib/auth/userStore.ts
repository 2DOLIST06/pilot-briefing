import { promises as fs } from 'node:fs';
import path from 'node:path';

export type StoredUser = {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDir, 'users.json');

export async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await fs.readFile(usersFile, 'utf-8');
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

export async function writeUsers(users: StoredUser[]) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), 'utf-8');
}
