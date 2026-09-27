import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    hashtags: '#haloSurvey #HSG',
    step_number: '1'
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/admin.php?action=get_submissions');
      const data = await res.json();
      if (data.status === 'success') {
        setSubmissions(data.submissions || []);
        setTasks(data.tasks || []);
      } else {
        setError(data.message || 'Error loading admin data');
      }
    } catch (err) {
      setError('Network error fetching admin panel data');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewProof = async (submissionId, status) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/admin.php?action=review_proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'review_proof',
          submission_id: submissionId,
          status: status
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMsg(`Proof marked as ${status}`);
        fetchAdminData();
      } else {
        setError(data.message || 'Failed to review proof');
      }
    } catch (err) {
      setError('Error processing review');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.description) return;

    try {
      const res = await fetch('http://127.0.0.1:8000/admin.php?action=add_task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_task',
          ...newTask,
          step_number: parseInt(newTask.step_number)
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        setMsg('New task added successfully!');
        setNewTask({ title: '', description: '', hashtags: '#haloSurvey #HSG', step_number: '1' });
        fetchAdminData();
      } else {
        setError(data.message || 'Failed to add task');
      }
    } catch (err) {
      setError('Error adding task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch('http://127.0.0.1:8000/admin.php?action=delete_task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_task',
          task_id: taskId
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        setMsg('Task deleted successfully');
        fetchAdminData();
      } else {
        setError(data.message || 'Failed to delete task');
      }
    } catch (err) {
      setError('Error deleting task');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Management Panel</h2>
        <span className="logo-badge">Halo Admin</span>
      </div>

      {msg && <div className="info-box" style={{ color: 'var(--success-color)' }}>{msg}</div>}
      {error && <div className="api-error-banner">{error}</div>}

      <div className="form-card" style={{ maxWidth: '100%', marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Add New Task</h3>
        <form onSubmit={handleAddTask} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Task Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Share link on WhatsApp"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>Task Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Share on status with hashtags"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>Hashtags</label>
            <input
              type="text"
              className="form-control"
              value={newTask.hashtags}
              onChange={(e) => setNewTask({ ...newTask, hashtags: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>Step Sequence #</label>
            <input
              type="number"
              className="form-control"
              value={newTask.step_number}
              onChange={(e) => setNewTask({ ...newTask, step_number: e.target.value })}
              required
              min="1"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="btn-block" style={{ height: '45px' }}>
              + Add Task
            </button>
          </div>
        </form>
      </div>

      <div className="form-card" style={{ maxWidth: '100%', marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Active Daily Tasks</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Step #</th>
              <th>Title</th>
              <th>Description</th>
              <th>Hashtags</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td><strong>Task {t.step_number}</strong></td>
                <td>{t.title}</td>
                <td>{t.description}</td>
                <td><code>{t.hashtags}</code></td>
                <td>
                  <button
                    onClick={() => handleDeleteTask(t.id)}
                    style={{ background: 'var(--danger-bg)', color: 'var(--danger-color)', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-card" style={{ maxWidth: '100%' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>User Task Proof Submissions</h3>
        {loading ? (
          <p>Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No task proofs submitted yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Task</th>
                <th>Proof Link</th>
                <th>Status</th>
                <th>Reward Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.submission_id}>
                  <td>
                    <strong>{sub.full_name}</strong>
                    <br />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{sub.email}</span>
                  </td>
                  <td>
                    Task {sub.step_number}: {sub.task_title}
                  </td>
                  <td>
                    <a href={sub.proof_link} target="_blank" rel="noreferrer" style={{ wordBreak: 'break-all', color: 'var(--primary-color)' }}>
                      {sub.proof_link}
                    </a>
                  </td>
                  <td>
                    <span className={`status-badge ${sub.status === 'approved' ? 'approved' : sub.status === 'rejected' ? 'rejected' : 'awaiting'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td>
                    <strong>₦{Number(sub.task_reward).toLocaleString()}</strong> (25%)
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleReviewProof(sub.submission_id, 'approved')}
                        style={{
                          backgroundColor: 'var(--success-color)',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReviewProof(sub.submission_id, 'rejected')}
                        style={{
                          backgroundColor: 'var(--danger-color)',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default AdminPanel;
