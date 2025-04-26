const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
    const formData = new FormData();
    formData.append('title', 'Test Project');
    formData.append('description', 'Test Description');
    formData.append('fundingGoal', '1000');
    formData.append('interestRate', '5');
    formData.append('duration', '30');
    
    // Add documents
    formData.append('documents', fs.createReadStream('path/to/your/document.pdf'));
    formData.append('documentDescriptions', JSON.stringify({
        'document.pdf': 'Business Plan'
    }));

    try {
        const response = await axios.post('http://localhost:3000/api/projects', formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': 'Bearer your-jwt-token'
            }
        });
        console.log('Upload successful:', response.data);
    } catch (error) {
        console.error('Upload failed:', error.response.data);
    }
}

testUpload();