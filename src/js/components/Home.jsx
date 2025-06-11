import React, { useEffect, useState } from "react";
import "../../styles/index.css";

const USERNAME = "Tomas";
const CREATE_USER_URL = `https://playground.4geeks.com/todo/users/${USERNAME}`;
const API_BASE_URL = `https://playground.4geeks.com/todo/todos`;
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
        if (!response.ok) throw new Error("El usuario ya existe");
        return response.json();
      })
      .then((data) => console.log("Usuario creado", data))
      .catch((error) => console.error("Error al crear usuario:", error.message));
  };

  const fetchTodos = () => {
    fetch(GET_TASKS_URL)
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        const cleaned = data.todos.map(task => ({
          id: task.id,
          label: task.label,
          is_done: task.is_done
        }));
        setTasks(cleaned);
      })
      .catch((error) => console.error("Error al obtener tareas:", error.message));
  };

  const addTask = () => {
    if (input.trim() === "") return;

    const newTask = { label: input, is_done: false };

    fetch(API_BASE_URL + `/${USERNAME}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask)
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json(); // aquí es un objeto nuevo
      })
      .then(() => {
        setInput("");
        fetchTodos();
      })
      .catch((error) => console.error("Error al añadir tarea:", error.message));
  };

  const deleteTask = (taskId) => {
    fetch(`${API_BASE_URL}/${taskId}`, {
      method: "DELETE"
    })
      .then((response) => {
        if (!response.ok) throw new Error("No se pudo eliminar");
        return response.text(); // porque devuelve un string como "ok"
      })
      .then((msg) => {
        console.log("Respuesta de eliminación:", msg);
        fetchTodos();
      })
      .catch((error) => console.error("Error al eliminar tarea:", error.message));
  };

  return (
    <div className="app-container">
      <h1>Lista de Tareas</h1>
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
          tasks.map((task) => (
            <div className="task-item" key={task.id}>
              <span>{task.label}</span>
              <button className="deleteButton" onClick={() => deleteTask(task.id)}>X</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
