import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API_URL = "http://127.0.0.1:5000/api/v1/reports";
const SERVER_URL = "http://127.0.0.1:5000";

function AdminDashboard() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("ecowatch_token");

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load complaints");
            }

            setReports(
                Array.isArray(data) ? data : data.reports || []
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-dashboard">

            <div className="admin-header">
                <div className="admin-brand">
                    <h1>EcoWatch Admin</h1>
                    <p>Environmental Complaint Management</p>
                </div>

                <button
                    className="admin-refresh-btn"
                    onClick={fetchReports}
                >
                    Refresh Complaints
                </button>
            </div>

            <div className="admin-summary">
                <h2>Total Complaints</h2>
                <h1>{reports.length}</h1>
                <p>Citizen-submitted environmental complaints</p>
            </div>

            <h2 className="admin-section-title">
                Citizen Complaints
            </h2>

            {loading && (
                <p className="admin-loading">
                    Loading complaints...
                </p>
            )}

            {error && (
                <p className="admin-error">
                    {error}
                </p>
            )}

            {!loading && !error && reports.length === 0 && (
                <p className="admin-empty">
                    No complaints have been submitted yet.
                </p>
            )}

            {!loading && !error && reports.length > 0 && (
                <div className="admin-report-list">
                    {reports.map((report) => (
                        <div
                            className="admin-report-card"
                            key={report._id}
                        >
                            <h3>{report.category}</h3>

                            <p>
                                <strong>Complaint ID:</strong>{" "}
                                {report.reportId || report._id}
                            </p>

                            <p>
                                <strong>Description:</strong>{" "}
                                {report.description}
                            </p>

                            <p>
                                <strong>Location:</strong>{" "}
                                {report.address || "Not provided"}
                            </p>

                            <p>
                                <strong>District:</strong>{" "}
                                {report.district || "Not provided"}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                <span className="admin-status">
                                    {report.status || "Submitted"}
                                </span>
                            </p>

                            <p>
                                <strong>Date:</strong>{" "}
                                {report.createdAt
                                    ? new Date(report.createdAt).toLocaleString()
                                    : "Not available"}
                            </p>

                            {report.imageUrl && (
                                <div>
                                    <p><strong>Evidence:</strong></p>
                                    <img
                                        className="admin-evidence"
                                        src={`${SERVER_URL}/${report.imageUrl.replace(/^\/+/, "")}`}
                                        alt="Complaint evidence"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default AdminDashboard;