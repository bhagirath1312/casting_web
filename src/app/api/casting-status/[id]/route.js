import connectDB from '@/lib/mongodb';
import Casting from '@/models/casting';
import { NextResponse } from 'next/server';

// GET a single casting post
export async function GET(_, { params }) {
  await connectDB();
  const casting = await Casting.findById(params.id);
  if (!casting) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(casting);
}

// PUT (update) a casting post
export async function PUT(req, { params }) {
  await connectDB();
  const data = await req.json();
  const updated = await Casting.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(updated);
}

// DELETE a casting post
export async function DELETE(_, { params }) {
  await connectDB();
  await Casting.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Deleted' });
}