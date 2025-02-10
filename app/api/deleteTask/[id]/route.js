import TaskModel from "@/models/Task";
import "@/lib/mongodb";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await TaskModel.findByIdAndDelete(id);
    return Response.json({ status: "task deleted" });
  } catch (err) {
    return Response.json({ status: "error" }, { status: 500 });
  }
}
