// src/app/api/casting-status/[id]/route.js
import connectDB from '@/lib/mongodb';
import Casting from '@/models/casting'; // ✅ Make sure this is the casting post model
import { NextResponse } from 'next/server';

// GET a single casting post
export async function GET(_, { params }) {
  await connectDB();

  try {
    const casting = await Casting.findById(params.id);
    if (!casting) {
      return NextResponse.json({ message: 'Casting post not found' }, { status: 404 });
    }

    return NextResponse.json(casting);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching casting post' }, { status: 500 });
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
export async function DELETE(_, { params }) {
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


// GET interested users for a casting post
export async function GET(req, { params }) {
    const castingId = params.id;
  
    if (!castingId) {
      return NextResponse.json({ message: "Casting ID is required" }, { status: 400 });
    }
  
    try {
      await connectToDB();
      const users = await CastingInterest.find({ castingId }).lean();
  
      return NextResponse.json(users, { status: 200 });
    } catch (error) {
      console.error("Error fetching interested users:", error);
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
  }