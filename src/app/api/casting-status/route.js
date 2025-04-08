// app/api/casting-status/route.js
import connectDB from "@/lib/mongodb";
import Casting from "@/models/Casting";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const castings = await Casting.find().sort({ createdAt: -1 });
  return NextResponse.json(castings);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const newCasting = await Casting.create(data);
  return NextResponse.json(newCasting, { status: 201 });
}