import TaskModel from "@/models/Task";
import "@/lib/mongodb";

export async function POST(req) {
  try {
    const { task } = await req.json();
    await TaskModel.create({ task });
    return Response.json({ status: "task added" });
  } catch (err) {
    return Response.json({ status: "error" }, { status: 500 });
  }
}
