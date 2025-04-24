import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Casting from '@/models/casting';
import CastingInterest from '@/models/InterestSubmission'; // For fetching interested users

// GET a single casting post or its interested users
export async function GET(req, { params }) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const showInterests = searchParams.get("interests");

  try {
    if (showInterests === "true") {
      const users = await CastingInterest.find({ castingId: params.id }).lean();
      return NextResponse.json({ success: true, users }, { status: 200 });
    }

    const casting = await Casting.findById(params.id);
    if (!casting) {
      return NextResponse.json({ message: 'Casting post not found' }, { status: 404 });
    }

    return NextResponse.json(casting);
  } catch (error) {
    console.error("Error in GET /casting-status/[id]:", error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// PATCH (update) a casting post
export async function PATCH(req, { params }) {
  await connectDB();

  try {
    const data = await req.json();
    const updated = await Casting.findByIdAndUpdate(params.id, data, { new: true });

    if (!updated) {
      return NextResponse.json({ message: 'Casting post not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating casting post' }, { status: 500 });
  }
}

// DELETE a casting post
export async function DELETE(req, { params }) {
  await connectDB();

  try {
    const deleted = await Casting.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ message: 'Casting post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Casting post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting casting post' }, { status: 500 });
  }
}