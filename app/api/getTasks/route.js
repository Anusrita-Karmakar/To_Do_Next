import TaskModel from "@/models/Task";
import "@/lib/mongodb";

export async function GET() {
  try {
    const tasks = await TaskModel.find();
    return Response.json(tasks);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
