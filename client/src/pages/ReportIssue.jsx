import { useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./ReportIssue.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});

const API_URL = "http://127.0.0.1:5000/api/v1/reports";

const COIMBATORE_CENTER = [11.0168, 76.9558];

function LocationSelector({ onSelect }) {
    useMapEvents({
        click(event) {
            onSelect(event.latlng.lat, event.latlng.lng);
        }
    });

    return null;
}

function ReportIssue() {
    const [form, setForm] = useState({
        category: "",
        description: "",
        latitude: "",
        longitude: "",
        address: "",
        district: "Coimbatore"
    });

    const [evidence, setEvidence] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [submittedReport, setSubmittedReport] = useState(null);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const selectLocation = (latitude, longitude) => {
        setForm((previous) => ({
            ...previous,
            latitude,
            longitude
        }));

        setMessage("Incident location selected on the map.");
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            setMessage("Your browser does not support GPS location.");
            return;
        }

        setMessage("Getting your GPS location...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setForm((previous) => ({
                    ...previous,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));

                setMessage("GPS coordinates captured successfully.");
            },
            () => {
                setMessage(
                    "Unable to get location. Please allow location access or select a location on the map."
                );
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setSubmittedReport(null);

        if (!form.category || !form.description.trim()) {
            setMessage("Please select a category and enter a description.");
            return;
        }

        if (form.latitude === "" || form.longitude === "") {
            setMessage("Please select the incident location on the map or capture your GPS location.");
            return;
        }

        const data = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            data.append(key, value);
        });

        if (evidence) {
            data.append("evidence", evidence);
        }

        try {
            setLoading(true);

            const response = await fetch(API_URL, {
                method: "POST",
                body: data
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Report submission failed."
                );
            }

            setSubmittedReport(result.report);
            setMessage("Your environmental report has been saved successfully!");

            setForm({
                category: "",
                description: "",
                latitude: "",
                longitude: "",
                address: "",
                district: "Coimbatore"
            });

            setEvidence(null);
            e.target.reset();

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="report-page">
            <section className="report-container">

                <div className="report-heading">
                    <p className="eyebrow">CITIZEN ENVIRONMENTAL ACTION</p>

                    <h1>Report an Environmental Issue</h1>

                    <p>
                        Document an environmental concern in your community.
                        Your report will be stored for verification and follow-up.
                    </p>
                </div>

                <form className="report-form" onSubmit={handleSubmit}>

                    <label>
                        Issue Category

                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            <option>Air Pollution</option>
                            <option>Water Pollution</option>
                            <option>Waste Dumping</option>
                            <option>Noise Pollution</option>
                            <option>Deforestation</option>
                            <option>Land Pollution</option>
                        </select>
                    </label>

                    <label>
                        Description

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe what happened, when you noticed it, and its impact..."
                            rows="5"
                            required
                        />
                    </label>

                    <div className="location-section">

                        <h3>Select Incident Location</h3>

                        <p className="map-instructions">
                            Click on the map to mark where the environmental
                            issue occurred. You can move the marker by clicking
                            another location.
                        </p>

                        <MapContainer
                            center={COIMBATORE_CENTER}
                            zoom={13}
                            scrollWheelZoom={true}
                            className="report-map"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <LocationSelector onSelect={selectLocation} />

                            {form.latitude !== "" &&
                                form.longitude !== "" && (
                                    <Marker
                                        position={[
                                            Number(form.latitude),
                                            Number(form.longitude)
                                        ]}
                                    />
                                )}
                        </MapContainer>

                        <p className="map-hint">
                            <strong>Tip:</strong> Zoom in to find the exact
                            street or area before placing your marker.
                        </p>

                        <button
                            type="button"
                            onClick={getLocation}
                        >
                            Capture My GPS Location
                        </button>

                        <div className="coordinate-grid">

                            <label>
                                Latitude

                                <input
                                    value={form.latitude}
                                    readOnly
                                    placeholder="Select a map location"
                                />
                            </label>

                            <label>
                                Longitude

                                <input
                                    value={form.longitude}
                                    readOnly
                                    placeholder="Select a map location"
                                />
                            </label>

                        </div>
                    </div>

                    <label>
                        Address / Landmark

                        <input
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Enter street, area or nearby landmark"
                        />
                    </label>

                    <label>
                        District

                        <select
                            name="district"
                            value={form.district}
                            onChange={handleChange}
                        >
                            <option>Coimbatore</option>
                            <option>Chennai</option>
                            <option>Madurai</option>
                            <option>Tiruppur</option>
                            <option>Salem</option>
                            <option>Erode</option>
                            <option>Other</option>
                        </select>
                    </label>

                    <label>
                        Photo Evidence (Optional)

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setEvidence(e.target.files[0] || null)
                            }
                        />

                        <small>Images only. Maximum file size: 5 MB.</small>
                    </label>

                    {message && (
                        <p className="report-message">{message}</p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Submitting..."
                            : "Submit Environmental Report"}
                    </button>

                </form>

                {submittedReport && (
                    <section className="submission-success">

                        <h2>Report Submitted</h2>

                        <p>Your report reference number:</p>

                        <strong>{submittedReport.reportId}</strong>

                        <p>Status: {submittedReport.status}</p>

                        <p>
                            Submitted:{" "}
                            {new Date(
                                submittedReport.createdAt
                            ).toLocaleString()}
                        </p>

                    </section>
                )}

            </section>
        </main>
    );
}

export default ReportIssue;