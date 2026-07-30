import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address required.' }, { status: 400 });
    }

    const existing = await prisma.subscriber.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      if (existing.status === 'UNSUBSCRIBED') {
        await prisma.subscriber.update({
          where: { id: existing.id },
          data: { status: 'SUBSCRIBED' },
        });
      }
      return NextResponse.json({ message: 'You are already subscribed to SkillStuff updates!' });
    }

    await prisma.subscriber.create({
      data: {
        email: email.toLowerCase().trim(),
        source: source || 'homepage',
        status: 'SUBSCRIBED',
      },
    });

    return NextResponse.json({ message: 'Thank you for subscribing to SkillStuff engineering newsletter!' });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to process subscription.' }, { status: 500 });
  }
}
