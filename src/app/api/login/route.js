import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb"; // ✅ Fix this import

export async function POST(req) {
  await connectToDatabase(); // ✅ Call correctly

  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
  }

  const { password: _, ...userData } = user.toObject();

  return NextResponse.json({ message: "Login successful", user: userData });
}