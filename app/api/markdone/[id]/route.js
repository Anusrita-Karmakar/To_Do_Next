import TaskModel from "@/models/Task";
import "@/lib/mongodb";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    await TaskModel.findByIdAndUpdate(id, { done: true });
    return Response.json({ status: "task updated" });
  } catch (err) {
    return Response.json({ status: "error" }, { status: 500 });
  }
}
