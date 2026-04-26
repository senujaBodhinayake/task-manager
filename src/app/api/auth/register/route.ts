import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { z } from 'zod';

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    await connectDB();

    const exists = await User.findOne({ email: body.email });
    if (exists) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

    const hashed = await bcrypt.hash(body.password, 12);
    await User.create({ email: body.email, password: hashed });

    return NextResponse.json({ message: 'Account created' }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    if (e instanceof Error) {
      console.error('REGISTER ERROR:', e.message);
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}