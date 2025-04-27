const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

const projectValidation = async (req, res, next) => {
    try {
        // Check if user is authorized
        if (!req.user || !req.user.kycVerified) {
            throw new Error('User not authorized to create projects');
        }

        // Validate funding goal
        if (!req.body.fundingGoal || req.body.fundingGoal <= 0) {
            throw new Error('Invalid funding goal');
        }

        // Validate interest rate
        if (!req.body.interestRate || req.body.interestRate <= 0 || req.body.interestRate > 100) {
            throw new Error('Invalid interest rate');
        }

        // Validate project duration
        if (!req.body.duration || req.body.duration < 1) {
            throw new Error('Invalid project duration');
        }

        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const validateDocument = (file) => {
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error('Invalid file type');
    }
};

module.exports = { projectValidation, upload, validateDocument };