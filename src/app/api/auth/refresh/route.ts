import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, signAccessToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('refreshToken')?.value;
    if (!token) return NextResponse.json({ error: 'No refresh token' }, { status: 401 });

    const { userId } = verifyRefreshToken(token);
    const accessToken = signAccessToken(userId);

    return NextResponse.json({ accessToken });
  } catch {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}