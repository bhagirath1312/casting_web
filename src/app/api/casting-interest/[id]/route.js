// src/api/casting-interest/[id]/route.js
import connectDB from "@/lib/mongodb";
import CastingInterest from "@/models/InterestSubmission.js";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const users = await CastingInterest.find({ castingId: id }).lean();
    return NextResponse.json({ success: true, users });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}