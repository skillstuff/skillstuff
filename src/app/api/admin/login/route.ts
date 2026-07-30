import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { author: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Invalid login credentials.' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid login credentials.' }, { status: 401 });
    }

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      authorId: user.author?.id || null,
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'USER_LOGIN',
        entity: 'User',
        entityId: user.id,
        details: `Successful admin login for ${user.email}`,
      },
    });

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal server login error.' }, { status: 500 });
  }
}
