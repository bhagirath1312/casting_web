import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CastingInterest from "@/models/castinginterests";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// AWS Config
const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    const castingId = formData.get("castingId");
    const name = formData.get("name");
    const email = formData.get("email");
    const age = formData.get("age");
    const location = formData.get("location");
    const height = formData.get("height");
    const weight = formData.get("weight");

    const photos = formData.getAll("photos");
    const videos = formData.getAll("videos");

    await connectToDatabase();

    const photoUrls = [];
    for (const file of photos) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `photos/${uuidv4()}-${file.name}`;
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      };
      await s3.send(new PutObjectCommand(uploadParams));
      photoUrls.push(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`);
    }

    const videoUrls = [];
    for (const file of videos) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `videos/${uuidv4()}-${file.name}`;
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      };
      await s3.send(new PutObjectCommand(uploadParams));
      videoUrls.push(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`);
    }

    const newInterest = new CastingInterest({
      castingId,
      name,
      email,
      age,
      location,
      height,
      weight,
      photoUrls,
      videoUrls,
    });

    await newInterest.save();

    return NextResponse.json({ message: "Interest submitted successfully" });
  } catch (error) {
    console.error("Casting interest error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}