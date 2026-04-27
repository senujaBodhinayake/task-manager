import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signAccessToken, signRefreshToken } from '@/lib/auth';
import { z } from 'zod';
import { getAuthRatelimit } from '@/lib/ratelimit';

const schema = z.object({
  email:    z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await getAuthRatelimit().limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = schema.parse(await req.json());
    await connectDB();

    const user = await User.findOne({ email: body.email });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const valid = await bcrypt.compare(body.password, user.password);
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const accessToken  = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    const res = NextResponse.json({ accessToken });
    res.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e: unknown) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('LOGIN ERROR:', message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}