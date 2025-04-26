const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    fileData: {
        type: Buffer,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    validationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
});

const ProjectSchema = new mongoose.Schema({
    contractProjectId: {
        type: Number,
        unique: true,
        sparse: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fundingGoal: {
        type: Number,
        required: true
    },
    currentFunding: {
        type: Number,
        default: 0
    },
    interestRate: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    documents: [DocumentSchema],
    status: {
        type: String,
        enum: ['pending', 'active', 'funded', 'completed', 'rejected'],
        default: 'pending'
    },
    validationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', ProjectSchema);