// src/api/signup/route.js

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  const body = await req.json();
  const { name, email, password, age, languages, mobile, gender, location } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  await connectToDatabase();

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
  });

  await newUser.save();

  return NextResponse.json({ message: "Signup successful" }, { status: 201 });
}