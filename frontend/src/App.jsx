
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/classes`;

const emptyForm = {
  className: "",
  instructorName: "",
  enrolledCount: "0",
  active: true,
};

export default function App() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadClasses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API}/display`);
      setClasses(response.data);
    } catch {
      setError(
        "Could not connect to the backend. Check that the backend and database are running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const className = form.className.trim();
    const instructorName = form.instructorName.trim();
    const enrolledCount = Number(form.enrolledCount);

    if (!className || !instructorName) {
      setError("Class name and instructor name are required.");
      return;
    }

    if (className.length > 100 || instructorName.length > 100) {
      setError("Names must be 100 characters or fewer.");
      return;
    }

    if (
      form.enrolledCount === "" ||
      !Number.isInteger(enrolledCount) ||
      enrolledCount < 0 ||
      enrolledCount > 10000
    ) {
      setError("Enrolled count must be a whole number from 0 to 10000.");
      return;
    }

    const payload = {
      className,
      instructorName,
      enrolledCount,
      active: form.active,
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await axios.put(`${API}/update/${editingId}`, payload);
        setMessage("Class updated successfully.");
      } else {
        await axios.post(`${API}/add`, payload);
        setMessage("Class added successfully.");
      }

      resetForm();
      await loadClasses();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to save the class. Please check the backend."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setForm({
      className: item.className,
      instructorName: item.instructorName,
      enrolledCount: String(item.enrolledCount),
      active: item.active,
    });
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this class?")) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await axios.delete(`${API}/delete/${id}`);
      setMessage("Class deleted successfully.");

      if (editingId === id) resetForm();

      await loadClasses();
    } catch {
      setError("Unable to delete the class. Please try again.");
    }
  }

  return (
    <div className="app-background min-vh-100">
      <nav className="navbar navbar-dark app-navbar">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            <span className="brand-icon">✦</span> LittleSteps
          </a>
          <span className="navbar-text text-white-50">
            Activity Class Manager
          </span>
        </div>
      </nav>

      <main className="container py-4 py-md-5">
        <section className="hero-section mb-4">
          <span className="eyebrow">CHILD ACTIVITY MANAGEMENT</span>
          <h1 className="display-6 fw-bold mt-2">
            Every little step counts.
          </h1>
          <p className="text-secondary mb-0">
            Organize classes, manage instructors, and keep track of enrollment.
          </p>
        </section>

        {message && (
          <div className="alert alert-success alert-dismissible" role="status">
            {message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setMessage("")}
              aria-label="Close"
            />
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <section className="card app-card h-100">
              <div className="card-body p-4">
                <h2 className="h4 fw-bold mb-1">
                  {editingId !== null ? "Edit class" : "Add a class"}
                </h2>
                <p className="text-secondary small mb-4">
                  Enter the activity class details below.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="className" className="form-label">
                      Class name
                    </label>
                    <input
                      id="className"
                      name="className"
                      className="form-control"
                      placeholder="e.g. Dance"
                      value={form.className}
                      onChange={handleChange}
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="instructorName" className="form-label">
                      Instructor name
                    </label>
                    <input
                      id="instructorName"
                      name="instructorName"
                      className="form-control"
                      placeholder="e.g. Priya"
                      value={form.instructorName}
                      onChange={handleChange}
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="enrolledCount" className="form-label">
                      Number of children enrolled
                    </label>
                    <input
                      id="enrolledCount"
                      name="enrolledCount"
                      type="number"
                      className="form-control"
                      min="0"
                      max="10000"
                      step="1"
                      value={form.enrolledCount}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-check form-switch mb-4">
                    <input
                      id="active"
                      name="active"
                      type="checkbox"
                      className="form-check-input"
                      checked={form.active}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="active">
                      Class is active
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingId !== null
                        ? "Update class"
                        : "Add class"}
                  </button>

                  {editingId !== null && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100 mt-2"
                      onClick={resetForm}
                    >
                      Cancel editing
                    </button>
                  )}
                </form>
              </div>
            </section>
          </div>

          <div className="col-12 col-lg-8">
            <section className="card app-card">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
                  <div>
                    <h2 className="h4 fw-bold mb-1">Activity classes</h2>
                    <p className="text-secondary small mb-0">
                      All registered classes
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={loadClasses}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Refresh"}
                  </button>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="stat-box">
                      <span className="text-secondary small">
                        Total classes
                      </span>
                      <div className="stat-number">{classes.length}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-box">
                      <span className="text-secondary small">
                        Active classes
                      </span>
                      <div className="stat-number">
                        {classes.filter((item) => item.active).length}
                      </div>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-secondary mt-2">Loading classes...</p>
                  </div>
                ) : classes.length === 0 ? (
                  <div className="empty-state text-center py-5">
                    <div className="empty-icon">✿</div>
                    <h3 className="h5 fw-bold mt-3">No classes yet</h3>
                    <p className="text-secondary mb-0">
                      Add your first activity class using the form.
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>Class details</th>
                          <th>Enrolled</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classes.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="fw-semibold">
                                {item.className}
                              </div>
                              <div className="small text-secondary">
                                {item.instructorName}
                              </div>
                            </td>
                            <td>{item.enrolledCount}</td>
                            <td>
                              <span
                                className={`badge ${
                                  item.active
                                    ? "text-bg-success"
                                    : "text-bg-secondary"
                                }`}
                              >
                                {item.active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex flex-wrap gap-1">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(item)}
                                  aria-label={`Edit ${item.className}`}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(item.id)}
                                  aria-label={`Delete ${item.className}`}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        <footer className="text-center text-secondary small mt-4">
          LittleSteps · Child Activity Class Management System
        </footer>
      </main>
    </div>
  );
}
