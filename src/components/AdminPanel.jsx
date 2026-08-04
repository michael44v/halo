import React, { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/get_submissions.php');
      const data = await response.json();
      if (response.ok && data.success) {
        setSubmissions(data.submissions || []);
      } else {
        setError(data.message || 'Failed to fetch submissions');
      }
    } catch (err) {
      setError('Network error. Could not connect to API.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const response = await fetch('/api/update_status.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // Update local state status
        setSubmissions((prev) =>
          prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
        );
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      alert('Network error. Failed to update status.');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const renderDynamicFields = (dynamicData) => {
    if (!dynamicData) return <em style={{ color: '#999' }}>No survey data</em>;

    // Check if it's a string (though PHP should have decoded it for us)
    const data = typeof dynamicData === 'string' ? JSON.parse(dynamicData) : dynamicData;

    return (
      <div className="dynamic-details">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} style={{ fontSize: '13px', margin: '2px 0' }}>
            <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>
              {key.replace(/_/g, ' ')}:
            </span>{' '}
            <span style={{ color: 'var(--accent)' }}>{value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="admin-container" style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Loading Submissions...</h3>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button onClick={fetchSubmissions} className="btn btn-secondary btn-sm">
          Refresh Data
        </button>
      </div>

      {error && <div className="api-error-banner" style={{ marginBottom: '20px' }}>{error}</div>}

      {submissions.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <p>No submissions found yet.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="desktop-view">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Contact Info</th>
                  <th>Business Info</th>
                  <th>Track</th>
                  <th>Password (Plain)</th>
                  <th>Survey Details</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.id}</td>
                    <td><strong>{sub.full_name}</strong></td>
                    <td>
                      <div style={{ fontSize: '14px' }}>{sub.email}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{sub.phone_number}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '500' }}>{sub.business}</div>
                      {sub.extra_field_1 && (
                        <div style={{ fontSize: '12px' }}>
                          <a href={sub.extra_field_1} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
                            {sub.extra_field_1}
                          </a>
                        </div>
                      )}
                      {sub.extra_field_2 && <div style={{ fontSize: '12px', color: '#666' }}>Sector: {sub.extra_field_2}</div>}
                      {sub.extra_field_3 && <div style={{ fontSize: '12px', color: '#666' }}>Budget: {sub.extra_field_3}</div>}
                    </td>
                    <td>
                      <span className="track-badge">{sub.selected_option}</span>
                    </td>
                    <td>
                      <code>{sub.password}</code>
                    </td>
                    <td>{renderDynamicFields(sub.dynamic_data)}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <select
                          value={sub.status}
                          onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                          disabled={updatingId === sub.id}
                          className={`status-select ${sub.status}`}
                        >
                          <option value="awaiting_approval">Awaiting Approval</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        {updatingId === sub.id && <span style={{ fontSize: '11px', color: '#888' }}>Saving...</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-view">
            {submissions.map((sub) => (
              <div key={sub.id} className="admin-card">
                <div className="card-header">
                  <div className="card-id">ID: {sub.id}</div>
                  <span className={`status-badge-inline ${sub.status}`}>
                    {sub.status === 'awaiting_approval'
                      ? 'Awaiting'
                      : sub.status === 'approved'
                      ? 'Approved'
                      : 'Rejected'}
                  </span>
                </div>
                <div className="card-body">
                  <div className="card-row">
                    <span className="card-label">Name:</span>
                    <span className="card-val"><strong>{sub.full_name}</strong></span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Email:</span>
                    <span className="card-val">{sub.email}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Phone:</span>
                    <span className="card-val">{sub.phone_number}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Business:</span>
                    <span className="card-val">
                      <div>{sub.business}</div>
                      {sub.extra_field_1 && <div style={{ fontSize: '12px', color: 'var(--accent)' }}>{sub.extra_field_1}</div>}
                      {sub.extra_field_2 && <div style={{ fontSize: '12px', color: '#666' }}>Sector: {sub.extra_field_2}</div>}
                      {sub.extra_field_3 && <div style={{ fontSize: '12px', color: '#666' }}>Budget: {sub.extra_field_3}</div>}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Track:</span>
                    <span className="card-val"><span className="track-badge">{sub.selected_option}</span></span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Password:</span>
                    <span className="card-val"><code>{sub.password}</code></span>
                  </div>

                  <div className="card-survey-section">
                    <div style={{ fontWeight: '500', marginBottom: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '2px' }}>
                      Survey Details
                    </div>
                    {renderDynamicFields(sub.dynamic_data)}
                  </div>

                  <div className="card-actions">
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#666' }}>Update Status:</label>
                    <select
                      value={sub.status}
                      onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                      disabled={updatingId === sub.id}
                      className={`status-select ${sub.status}`}
                    >
                      <option value="awaiting_approval">Awaiting Approval</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
