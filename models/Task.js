import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  task: String,
  done: {
    type: Boolean,
    default: false,
  },
  pdf: String,
});

const TaskModel = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default TaskModel;
