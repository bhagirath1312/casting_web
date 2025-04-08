import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, age, languages, mobile, gender, location } = body;

    // ✅ Validate required fields
    if (!name || !email || !password || !age || !languages || !mobile || !gender || !location) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
      languages,
      mobile,
      gender,
      location,
      role: "user",
    });

    const savedUser = await newUser.save();

    // ✅ Exclude password from response
    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    return NextResponse.json(
      {
        message: "Signup successful",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}