import { useEffect, useState } from "react";
import "./ExploreReports.css";

const API_URL = "http://127.0.0.1:5000/api/v1/reports";

function ExploreReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [category, setCategory] = useState("All");

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to fetch reports.");
            }

            setReports(result.reports || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const filteredReports = category === "All"
        ? reports
        : reports.filter((report) => report.category === category);

    return (
        <main className="explore-page">
            <section className="explore-container">

                <div className="explore-heading">
                    <p className="eyebrow">ENVIRONMENTAL TRANSPARENCY</p>
                    <h1>Explore Environmental Reports</h1>
                    <p>
                        Discover environmental concerns reported by citizens
                        and follow their progress.
                    </p>
                </div>

                <div className="explore-toolbar">
                    <div>
                        <h2>Community Reports</h2>
                        <p>{reports.length} reports retrieved from the database</p>
                    </div>

                    <button onClick={fetchReports}>
                        Refresh Reports
                    </button>
                </div>

                <div className="report-filter">
                    <label htmlFor="category-filter">Filter by category</label>

                    <select
                        id="category-filter"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option>Air Pollution</option>
                        <option>Water Pollution</option>
                        <option>Waste Dumping</option>
                        <option>Noise Pollution</option>
                        <option>Deforestation</option>
                        <option>Land Pollution</option>
                    </select>
                </div>

                {loading && <p className="explore-message">Loading reports...</p>}

                {error && (
                    <div className="explore-error">
                        {error}
                        <button onClick={fetchReports}>Try Again</button>
                    </div>
                )}

                {!loading && !error && filteredReports.length === 0 && (
                    <div className="empty-reports">
                        <h3>No reports found</h3>
                        <p>
                            {reports.length === 0
                                ? "No environmental reports have been submitted yet."
                                : "No reports match the selected category."}
                        </p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="reports-grid">
                        {filteredReports.map((report) => (
                            <article
                                className="report-card"
                                key={report._id || report.reportId}
                            >
                                {report.imageUrl && (
                                    <img
                                        className="report-evidence"
                                        src={
                                            report.imageUrl.startsWith("http")
                                                ? report.imageUrl
                                                : `http://127.0.0.1:5000/${report.imageUrl.replace(/^\/+/, "")}`
                                        }
                                        alt="Environmental issue evidence"
                                    />
                                )}

                                <div className="report-card-content">

                                    <div className="report-card-top">
                                        <span className="report-category">
                                            {report.category}
                                        </span>

                                        <span className="report-status">
                                            {report.status}
                                        </span>
                                    </div>

                                    <h3>{report.reportId}</h3>

                                    <p className="report-description">
                                        {report.description}
                                    </p>

                                    <div className="report-details">
                                        <p>
                                            <strong>Location:</strong>{" "}
                                            {report.address || "Location not provided"}
                                        </p>

                                        <p>
                                            <strong>District:</strong>{" "}
                                            {report.district || "Not specified"}
                                        </p>

                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {report.createdAt
                                                ? new Date(report.createdAt).toLocaleString()
                                                : "Not available"}
                                        </p>
                                    </div>

                                </div>
                            </article>
                        ))}
                    </div>
                )}

            </section>
        </main>
    );
}

export default ExploreReports;