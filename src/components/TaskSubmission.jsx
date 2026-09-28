import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TaskSubmission = () => {
  const { taskId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [proofLink, setProofLink] = useState('');
  const [status, setStatus] = useState('not_started');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTaskDetails();
  }, [user, taskId]);

  const fetchTaskDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/tasks.php?user_id=${user.id}`);
      const data = await res.json();
      if (data.status === 'success') {
        const currentTask = data.tasks.find(t => t.id === parseInt(taskId));
        if (currentTask) {
          setTask(currentTask);
          setStatus(currentTask.status);
          if (currentTask.proof_link) {
            setProofLink(currentTask.proof_link);
          }
        } else {
          setError('Task not found');
        }
      } else {
        setError(data.message || 'Error fetching task');
      }
    } catch (err) {
      setError('Network error fetching task details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofLink.trim()) return;

    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('http://127.0.0.1:8000/submit_proof.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          task_id: parseInt(taskId),
          proof_link: proofLink
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        setStatus('pending_approval');
        setSuccessMsg('Link submitted! Link box turns red after upload, then turns green after admin approval.');
      } else {
        setError(data.message || 'Failed to submit proof');
      }
    } catch (err) {
      setError('Network error submitting proof');
    } finally {
      setSubmitting(false);
    }
  };

  const isApproved = status === 'approved';

  return (
    <div className="landing-container">
      <div className="form-card" style={{ maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span className="logo-badge">Halo Logo</span>
          <h2 style={{ fontSize: '22px', marginTop: '12px', color: 'var(--text-primary)' }}>
            Task Submission Page
          </h2>
        </div>

        {loading ? (
          <div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text" style={{ height: '40px', marginBottom: '16px' }}></div>
            <div className="skeleton skeleton-btn"></div>
          </div>
        ) : error ? (
          <div className="api-error-banner">{error}</div>
        ) : (
          <div>
            <h3 style={{ fontSize: '18px', margin: '0 0 12px', color: 'var(--primary-color)' }}>
              TASK {task?.step_number}: {task?.title}
            </h3>

            {successMsg && (
              <div className="info-box" style={{ backgroundColor: 'var(--primary-bg-light)', marginBottom: '16px', color: 'var(--primary-color)' }}>
                {successMsg}
              </div>
            )}

            {proofLink && (
              <div
                className={`proof-box ${isApproved ? 'approved' : 'pending'}`}
                style={{
                  backgroundColor: isApproved ? 'var(--success-bg)' : 'var(--danger-bg)',
                  borderColor: isApproved ? 'var(--success-color)' : 'var(--danger-color)',
                  color: isApproved ? 'var(--success-color)' : 'var(--danger-color)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: '2px solid'
                }}
              >
                {isApproved ? '🟢 Approved Proof Link: ' : '🔴 Submitted Proof Link (Pending Admin Approval): '}
                <br />
                <a href={proofLink} target="_blank" rel="noreferrer" style={{ color: 'inherit', fontWeight: 'bold' }}>
                  {proofLink}
                </a>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Link to post...</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://facebook.com/your-post-link"
                  value={proofLink}
                  onChange={(e) => setProofLink(e.target.value)}
                  required
                />
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Make sure the facebook post has been made before submitting links.
              </p>

              <button
                type="submit"
                className="btn-block"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '600' }}>
                &lt; Back to homepage
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSubmission;
