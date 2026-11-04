
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./db");
const reportRoutes = require("./routes/reportRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRoutes);

// Make uploaded evidence images accessible
app.use(
"/uploads",
express.static(path.join(__dirname, "uploads"))
);

// API routes
app.use("/api/v1/reports", reportRoutes);

// Home route
app.get("/", (req, res) => {
res.json({
    success: true,
    message: "Welcome to EcoWatch"
});
});

// Health check
app.get("/api/health", (req, res) => {
res.json({
    success: true,
    message: "EcoWatch API is working"
});
});

// Start after MongoDB connects
const startServer = async () => {
try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
    console.log(`EcoWatch server running on port ${PORT}`);
    });

} catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
}
};

startServer();
