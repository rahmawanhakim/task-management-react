import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("desc");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = await getTasks({
        search,
        status: filterStatus,
        priority: filterPriority,
        sortBy,
        order,
      });
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks()
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleDelete(id) {
    setDeletingId(id);
    setError("");

    deleteTask(id)
      .then(() => {
        return getTasks();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setDeletingId(null);
      });
  }

  function handleEdit(task) {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setPriority(task.priority);
  }

  function handleUpdate(e) {
    e.preventDefault();
    setError("");

    const task = {
      title,
      description,
      status,
      priority,
    };

    updateTask(editingId, task)
      .then(() => {
        setEditingId(null);
        setTitle("");
        setDescription("");
        setStatus("pending");
        setPriority("medium");

        return getTasks();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const task = {
      title,
      description,
      status,
      priority,
    };

    createTask(task)
      .then(() => {
        setTitle("");
        setDescription("");
        setStatus("pending");
        setPriority("medium");

        return getTasks();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Task Management</h1>
          <p>Kelola dan pantau semua pekerjaanmu dalam satu tempat.</p>
        </div>
      </header>

      <main className="container">
        <section>
          <h2 className="section-title">Tambah Task Baru</h2>

          <div className="card">
            <form
              className="task-form"
              onSubmit={editingId ? handleUpdate : handleSubmit}
            >
              <div className="form-group full-width">
                <label>Judul Task</label>
                <input
                  type="text"
                  placeholder="Masukkan judul task"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Deskripsi</label>
                <textarea
                  placeholder="Masukkan deskripsi task"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Prioritas</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <button className="btn-primary" type="submit">
                {editingId ? "Simpan Perubahan" : "+ Tambah Task"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setDescription("");
                    setStatus("pending");
                    setPriority("medium");
                  }}
                >
                  Batal
                </button>
              )}
            </form>
          </div>
        </section>
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
          <input
            type="text"
            placeholder="Cari task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          </div>
          <div className="form-group">
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          </div>
          <div className="form-group">

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">Semua Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          </div>
          <div className="form-group">
          <button className="btn btn-primary" type="submit">Filter</button>
          </div>
        </form>

        <section className="task-section">
          <h2 className="section-title">Daftar Task</h2>

          {loading && <p className="loading">Memuat task...</p>}

          {error && <p className="error">{error}</p>}

          {!loading && !error && tasks.length === 0 && (
            <div className="empty-state">
              Belum ada task. Silakan tambahkan task baru.
            </div>
          )}

          {!loading && tasks.length > 0 && (
            <div className="task-list">
              {tasks.map((task) => (
                <div className="task-card" key={task.id}>
                  <h3>{task.title}</h3>

                  <p className="task-description">
                    {task.description || "Tidak ada deskripsi"}
                  </p>

                  <div className="task-meta">
                    <span className={`badge status-${task.status}`}>
                      {task.status.replace("_", " ")}
                    </span>

                    <span className={`badge priority-${task.priority}`}>
                      {task.priority} priority
                    </span>
                  </div>
                  <div className="task-actions">
                    <button
                      type="button"
                      className="btn-edit"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => handleDelete(task.id)}
                      disabled={deletingId === task.id}
                    >
                      {deletingId === task.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
