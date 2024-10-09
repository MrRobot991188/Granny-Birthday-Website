const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000; // Set the port here

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be saved in the 'uploads' directory

// Serve index.html file when accessing the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the thankyou.html file
app.get('/thankyou.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'thankyou.html')); // Closing the function here
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.redirect('/thankyou.html'); // Redirect to Thank You page after upload
});

// Endpoint to get the list of files
app.get('/files', (req, res) => {
    fs.readdir('./uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Unable to fetch files' });
        }
        res.json(files);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

