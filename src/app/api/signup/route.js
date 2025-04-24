// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { name, email, password, age, languages, mobile, gender, location , height, weight,} = body;

//     // ✅ Validate required fields
//     if (!name || !email || !password || !age || !languages || !mobile || !gender || !location ||  height || weight) {
//       return NextResponse.json({ message: "All fields are required" }, { status: 400 });
//     }

//     await connectDB();

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ message: "User already exists" }, { status: 409 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       age,
//       languages,
//       mobile,
//       gender,
//       location,
//       height,
//       weight,
//       role: "user",
//     });

//     const savedUser = await newUser.save();

//     // ✅ Exclude password from response
//     const { password: _, ...userWithoutPassword } = savedUser.toObject();

//     return NextResponse.json(
//       {
//         message: "Signup successful",
//         user: userWithoutPassword,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Signup error:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, age, languages, mobile, gender, location, height, weight } = body;

    // ✅ Validate required fields
    if (!name || !email || !password || !age || !languages || !mobile || !gender || !location || !height || !weight) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Validate if height and weight are numbers and greater than 0
    if (isNaN(height) || height <= 0) {
      return NextResponse.json({ message: "Height must be a positive number" }, { status: 400 });
    }

    if (isNaN(weight) || weight <= 0) {
      return NextResponse.json({ message: "Weight must be a positive number" }, { status: 400 });
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
      height,
      weight,
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