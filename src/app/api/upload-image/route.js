// // src/app/api/upload-image/route.js

// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { v4 as uuidv4 } from 'uuid';
// import { NextResponse } from 'next/server';

// const BUCKET_NAME = process.env.AWS_BUCKET_NAME; // "castingwebuploads"

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
//   useAccelerateEndpoint: true,
// });

// export async function POST(req) {
//   const formData = await req.formData();
//   const file = formData.get("file");

//   if (!file) {
//     return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
//   }

//   const buffer = Buffer.from(await file.arrayBuffer());
//   const fileExt = file.name.split(".").pop();
//   const key = `uploads/${uuidv4()}.${fileExt}`;

//   const uploadParams = {
//     Bucket: BUCKET_NAME,
//     Key: key,
//     Body: buffer,
//     ContentType: file.type,
//   };

//   try {
//     await s3.send(new PutObjectCommand(uploadParams));

//     const fileUrl = `https://${BUCKET_NAME}.s3-accelerate.amazonaws.com/${key}`;
//     return NextResponse.json({ success: true, url: fileUrl });
//   } catch (err) {
//     console.error("S3 Upload Error:", err);
//     return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//   }
// }
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  useAccelerateEndpoint: true,
});

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split('.').pop();
  const uniqueFileName = `${uuidv4()}.${extension}`;
  const key = `uploads/${uniqueFileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  try {
    await s3.send(command);
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3-accelerate.amazonaws.com/${key}`;
    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}