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

const updateSchema = z.object({
  title:       z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status:      z.enum(['todo', 'in-progress', 'done']).optional(),
  due_date:    z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // ← await params
    const userId = getUserId(req);
    const body = updateSchema.parse(await req.json());
    await connectDB();

    const task = await Task.findOne({ _id: id, userId });
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const updated = await Task.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // ← await params
    const userId = getUserId(req);
    await connectDB();

    const task = await Task.findOne({ _id: id, userId });
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    await Task.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Task deleted' });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}