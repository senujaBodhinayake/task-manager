import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Task from '@/models/Task';
import { verifyAccessToken } from '@/lib/auth';
import { z } from 'zod';

function getUserId(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('Unauthorized');
  return verifyAccessToken(token).userId;
}

const taskSchema = z.object({
  title:       z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  status:      z.enum(['todo', 'in-progress', 'done']).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    await connectDB();
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    const body = taskSchema.parse(await req.json());
    await connectDB();
    const task = await Task.create({ ...body, userId });
    return NextResponse.json(task, { status: 201 });
  } catch (e: any) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}