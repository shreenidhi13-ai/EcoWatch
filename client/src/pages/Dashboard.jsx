import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const API_URL = "http://127.0.0.1:5000/api/v1/reports";

function Dashboard() {
const [reports, setReports] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

async function loadReports() {
    try {
    setLoading(true);
    setError("");

    const response = await fetch(API_URL);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to load reports");
    }

    const reportList = Array.isArray(data)
        ? data
        : data.reports || data.data || [];

    setReports(reportList);
    } catch (err) {
    setError(err.message || "Cannot connect to EcoWatch server.");
    } finally {
    setLoading(false);
    }
}

useEffect(() => {
    loadReports();
}, []);

const totalReports = reports.length;
const resolvedReports = reports.filter(
    (report) => report.status === "Resolved"
).length;
const pendingReports = reports.filter(
    (report) => report.status !== "Resolved" && report.status !== "Rejected"
).length;

return (
    <div className="eco-dashboard">
    <header className="eco-header">
        <div>
        <p className="eco-label">ENVIRONMENTAL INTELLIGENCE</p>
        <h1>EcoWatch Dashboard</h1>
        <p>Monitor environmental reports and community action.</p>
        </div>

        <Link to="/report" className="eco-primary-button">
        + Report an Issue
        </Link>
    </header>

    <nav className="eco-navigation">
        <Link to="/dashboard">Home</Link>
        <Link to="/report">Report an Issue</Link>
        <Link to="/explore-reports">Explore Dashboard</Link>
    </nav>

    <section className="eco-welcome">
        <h2>Welcome to EcoWatch</h2>
        <p>
        Your contribution helps identify environmental problems
and encourages timely action.
        </p>
    </section>

    <section className="eco-stats">
        <div className="eco-stat-card">
        <span>Total Reports</span>
        <h2>{loading ? "..." : totalReports}</h2>
        </div>

        <div className="eco-stat-card">
        <span>Pending Reports</span>
        <h2>{loading ? "..." : pendingReports}</h2>
        </div>

        <div className="eco-stat-card">
        <span>Resolved Reports</span>
        <h2>{loading ? "..." : resolvedReports}</h2>
        </div>
    </section>

    <section className="eco-feature-grid">
        <Link to="/explore-reports" className="eco-feature-card">
        <h3>My Reports</h3>
        <p>View environmental reports and their current status.</p>
        </Link>

        <Link to="/explore-reports" className="eco-feature-card">
        <h3>Pollution Hotspots</h3>
        <p>Explore reported environmental concerns by location.</p>
        </Link>

        <Link to="/explore-reports" className="eco-feature-card">
        <h3>Track Progress</h3>
        <p>Follow the status of your environmental complaints.</p>
        </Link>

        <Link to="/explore-reports" className="eco-feature-card">
        <h3>Authority Accountability</h3>
        <p>View complaint status and resolution information.</p>
        </Link>
    </section>

    <section className="eco-recent-reports">
        <div className="eco-section-heading">
        <div>
            <h2>Explore Environmental Reports</h2>
            <p>Reports retrieved from the EcoWatch database.</p>
        </div>

        <Link to="/explore-reports">View All →</Link>
        </div>

        {loading && <p>Loading reports...</p>}

        {error && (
        <div className="eco-error">
            {error}
            <button onClick={loadReports}>Retry</button>
        </div>
        )}

        {!loading && !error && reports.length === 0 && (
        <p>No complaints have been submitted yet.</p>
        )}

        <div className="eco-report-list">
        {reports.slice(0, 5).map((report) => (
            <article className="eco-report-item" key={report._id}>
            <div>
                <h3>{report.category}</h3>
                <p>{report.description}</p>
                <small>
                {report.address || "Location not provided"}
                </small>
            </div>

            <span className="eco-status">
                {report.status || "Submitted"}
            </span>
            </article>
        ))}
        </div>
    </section>

    <footer className="eco-footer">
        <h3>Small Actions. Cleaner Communities.</h3>
        <p>
        Report environmental issues, monitor progress and support
        a healthier environment.
        </p>
    </footer>
    </div>
);
}

export default Dashboard;