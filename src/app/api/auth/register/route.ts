import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { z } from 'zod';
import { authRatelimit } from '@/lib/ratelimit';

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await authRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = schema.parse(await req.json());
    await connectDB();

    const exists = await User.findOne({ email: body.email });
    if (exists) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

    const hashed = await bcrypt.hash(body.password, 12);
    await User.create({ email: body.email, password: hashed });

    return NextResponse.json({ message: 'Account created' }, { status: 201 });
  } catch (e: any) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    console.error('REGISTER ERROR:', e.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}