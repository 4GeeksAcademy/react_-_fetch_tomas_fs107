import React, { useEffect, useState } from "react";
import "../../styles/index.css";

const USERNAME = "Tomas";
const CREATE_USER_URL = `https://playground.4geeks.com/todo/users/${USERNAME}`;
const API_TODO_URL = `https://playground.4geeks.com/todo/todos/${USERNAME}`;
const GET_TASKS_URL = `https://playground.4geeks.com/todo/users/${USERNAME}`;

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    createUser();
  }, []);

  const createUser = () => {
    fetch(CREATE_USER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([])
    })
      .then((response) => {
        if (response.status === 400) {
          fetchTodos();
          return;
        }
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(() => fetchTodos())
      .catch((error) => console.error("Error:", error.message));
  };

  const fetchTodos = () => {
    fetch(GET_TASKS_URL)
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        const cleaned = data.todos.map(task => ({
          label: task.label,
          is_done: task.is_done
        }));
        setTasks(cleaned);
      })
      .catch((error) => console.error("Error:", error.message));
  };

  const addTask = () => {
    if (input.trim() === "") return;

    const newTask = { label: input, is_done: false };

    fetch(API_TODO_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask)
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(() => {
        setInput("");
        fetchTodos();
      })
      .catch((error) => console.error("Error:", error.message));
  };

  const deleteTask = (indexToDelete) => {
    const cleanedTasks = tasks
      .filter((_, index) => index !== indexToDelete)
      .map(task => ({
        label: task.label,
        is_done: task.is_done
      }));

    fetch(API_TODO_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanedTasks)
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(() => fetchTodos())
      .catch((error) => console.error("Error:", error.message));
  };

  return (
    <div className="app-container">
      <h1>📝 Lista de Tareas</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Añade una tarea..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Agregar</button>
      </div>

      <div className="task-box">
        {tasks.length === 0 ? (
          <p className="no-tasks">No hay tareas por ahora.</p>
        ) : (
          tasks.map((task, index) => (
            <div className="task-item" key={index}>
              <span>{task.label}</span>
              <button onClick={() => deleteTask(index)}>❌</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
