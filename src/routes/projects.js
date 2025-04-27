const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { projectValidation, upload, validateDocument } = require('../middleware/validation');
const Project = require('../models/Project');

// Create new project with documents
router.post('/', auth, upload.array('documents', 5), projectValidation, async (req, res) => {
    try {
        const project = new Project({
            owner: req.user._id,
            title: req.body.title,
            description: req.body.description,
            fundingGoal: req.body.fundingGoal,
            interestRate: req.body.interestRate,
            duration: req.body.duration
        });

        // Process uploaded documents
        if (req.files && req.files.length > 0) {
            const documents = req.files.map(file => {
                validateDocument(file);
                return {
                    name: file.originalname,
                    description: req.body.documentDescriptions ? 
                        JSON.parse(req.body.documentDescriptions)[file.originalname] : '',
                    fileData: file.buffer,
                    mimeType: file.mimetype,
                    uploadedBy: req.user._id
                };
            });
            project.documents = documents;
        }

        await project.save();
        
        // Remove fileData from response
        const response = project.toObject();
        if (response.documents) {
            response.documents = response.documents.map(doc => ({
                ...doc,
                fileData: undefined
            }));
        }
        
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get project document
router.get('/:projectId/documents/:documentId', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const document = project.documents.id(req.params.documentId);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.set('Content-Type', document.mimeType);
        res.send(document.fileData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get project documents metadata
router.get('/:projectId/documents', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const documents = project.documents.map(doc => ({
            id: doc._id,
            name: doc.name,
            description: doc.description,
            mimeType: doc.mimeType,
            uploadedBy: doc.uploadedBy,
            uploadedAt: doc.uploadedAt,
            validationStatus: doc.validationStatus
        }));

        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Validate project document
router.post('/:projectId/documents/:documentId/validate', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const document = project.documents.id(req.params.documentId);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Check if user is a validator
        if (req.user.role !== 'validator') {
            return res.status(403).json({ error: 'Not authorized to validate documents' });
        }

        document.validationStatus = req.body.status;
        await project.save();

        res.json({
            id: document._id,
            name: document.name,
            validationStatus: document.validationStatus
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all projects (with pagination)
router.get('/', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;

        const query = {};
        if (status) {
            query.status = status;
        }

        const projects = await Project.find(query)
            .populate('owner', 'username walletAddress')
            .select('-documents.fileData')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Project.countDocuments(query);

        res.json({
            projects,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProjects: total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;