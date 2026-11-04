
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
{
    reportId: {
    type: String,
    unique: true,
    required: true
    },

    category: {
    type: String,
    enum: [
        "Air Pollution",
        "Water Pollution",
        "Waste Dumping",
        "Noise Pollution",
        "Deforestation",
        "Land Pollution"
],
    required: true
    },

    description: {
    type: String,
    required: true
    },

    location: {
    type: {
        type: String,
        enum: ["Point"],
        default: "Point"
    },
    coordinates: {
        type: [Number],
        required: true
    }
    },

    address: String,
    district: String,
    imageUrl: String,

    status: {
    type: String,
    enum: [
        "Submitted",
        "Under Verification",
        "Verified",
        "Assigned",
        "In Progress",
        "Resolved",
        "Rejected"
    ],
    default: "Submitted"
    }
},
{ timestamps: true }
);

reportSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Report", reportSchema);
