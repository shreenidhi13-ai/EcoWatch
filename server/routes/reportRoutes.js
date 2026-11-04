
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Report = require("../models/Report");

// Configure image storage
const storage = multer.diskStorage({
destination: (req, file, cb) => {
    cb(null, "uploads/");
},
filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname).toLowerCase());
}
});

// Accept image files only
const upload = multer({
storage,
  limits: { fileSize: 5 * 1024 * 1024 },
fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
    cb(null, true);
    } else {
    cb(new Error("Only image files are allowed."));
    }
}
});

// SUBMIT A REPORT
router.post("/", (req, res) => {
upload.single("evidence")(req, res, async (uploadError) => {
    if (uploadError) {
    return res.status(400).json({
        success: false,
        message: uploadError.message
    });
    }

    try {
    const {
        category,
        description,
        longitude,
        latitude,
        address,
        district
    } = req.body;

    const lng = Number(longitude);
    const lat = Number(latitude);

    if (
        !category ||
        !description ||
        longitude === undefined ||
        latitude === undefined ||
        !Number.isFinite(lng) ||
        !Number.isFinite(lat) ||
        lng < -180 || lng > 180 ||
        lat < -90 || lat > 90
    ) {
        return res.status(400).json({
        success: false,
        message: "Please provide valid report details and GPS coordinates."
        });
    }

    const allowedCategories = [
        "Air Pollution",
        "Water Pollution",
        "Waste Dumping",
        "Noise Pollution",
        "Deforestation",
        "Land Pollution"
    ];

    if (!allowedCategories.includes(category)) {
        return res.status(400).json({
        success: false,
        message: "Invalid pollution category."
        });
    }

    const report = await Report.create({
        reportId: "ECO-" + Date.now(),
        category,
        description,
        location: {
        type: "Point",
        coordinates: [lng, lat]
        },
        address: address || "",
        district: district || "",
        imageUrl: req.file
        ? "/uploads/" + req.file.filename
        : ""
    });

    res.status(201).json({
        success: true,
        message: "Report submitted successfully!",
        report
    });

    } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
    }
});
});

// GET ALL REPORTS
router.get("/", async (req, res) => {
try {
    const reports = await Report.find().sort({ createdAt: -1 });

    res.json({
    success: true,
    count: reports.length,
    reports
    });

} catch (error) {
    res.status(500).json({
    success: false,
    message: error.message
    });
}
});

// GET ONE REPORT USING ITS REPORT ID
router.get("/:reportId", async (req, res) => {
try {
    const report = await Report.findOne({
    reportId: req.params.reportId
    });

    if (!report) {
    return res.status(404).json({
        success: false,
        message: "Report not found."
    });
    }

    res.json({
    success: true,
    report
    });

} catch (error) {
    res.status(500).json({
    success: false,
    message: error.message
    });
}
});

module.exports = router;
