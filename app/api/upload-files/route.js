import { writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import TaskModel from "@/models/Task";
import "@/lib/mongodb";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(process.cwd(), "public/uploads", file.name);
    
    await writeFile(filePath, buffer);

    await TaskModel.create({ pdf: file.name });

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
