import { NextResponse } from "next/server";
import TaskModel from "@/models/Task";
import "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      console.error("❌ No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("✅ Received file:", file.name);

    // Extract filename and extension
    const originalFilename = file.name || "uploaded_file";
    const extension = path.extname(originalFilename).substring(1); // Get extension without "."
    const filename = path.basename(originalFilename, path.extname(originalFilename));

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log(`Uploading: ${filename}.${extension} to Cloudinary...`);

    // Upload to Cloudinary as "raw" (for non-images)
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", // Allows PDF, TXT, DOCX, etc.
          folder: "uploads",
          public_id: filename, // Avoids duplicate extensions
          format: extension, // Ensures correct file extension
          use_filename: true, // Keeps original filename
          unique_filename: false, // Prevents renaming with random characters
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    console.log("✅ File uploaded successfully:", uploadResponse.secure_url);

    // Store Cloudinary URL in MongoDB
    await TaskModel.create({ pdf: uploadResponse.secure_url });

    return NextResponse.json({ status: "ok", pdfUrl: uploadResponse.secure_url });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
