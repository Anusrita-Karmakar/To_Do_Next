"use client";
import { useRef,useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";
import "../styles/globals.css";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [file, setFile] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const result = await axios.get("/api/getTasks");
      setTasks(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post("/api/addTask", { task });
      setTask("");
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDone = async (id) => {
    try {
      await axios.put(`/api/markdone/${id}`);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/deleteTask/${id}`);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const fileInputRef = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/api/upload-files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
      }
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const showPdf = (pdf) => {
    window.open(`/uploads/${pdf}`, "_blank");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>To Do List</h1>
      <input
        className={styles.input}
        type="text"
        placeholder="Add a task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button className={styles.button} onClick={handleAdd}>
        Add Task
      </button>

      <p><strong>OR</strong></p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Upload a file to do:</label>
        <input
          className={styles.fileInput}
          type="file"
          accept=".pdf, .txt, .doc, .docx, .xls, .xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileInputRef}
          required
        />
        <button className={styles.button} type="submit">
          Add File
        </button>
      </form>

      <h2 className={styles.sectionTitle}>TASKS TO DO</h2>
      {tasks.length === 0 ? (
        <h4 className={styles.noTasks}>No tasks to do</h4>
      ) : (
        tasks.map((task, index) => (
          <div key={index} className={styles.taskItem}>
            <h4 className={task.done ? styles.done : ""}>
              {task.task} &nbsp;
              {task.pdf && (
                <button className={`${styles.button} ${task.done ? styles.done : ""}`} onClick={() => showPdf(task.pdf)}>
                  {task.pdf}
                </button>
              )}
              {!task.done && (
                <button className={styles.button} onClick={() => handleDone(task._id)}>
                  Mark As Done
                </button>
              )}
              <button className={styles.button} onClick={() => handleDelete(task._id)}>
                Delete Task
              </button>
            </h4>
          </div>
        ))
      )}
    </div>
  );
}
