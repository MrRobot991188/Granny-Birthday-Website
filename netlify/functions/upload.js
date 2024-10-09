// netlify/functions/upload.js
const AWS = require('aws-sdk'); // Assuming you will use AWS S3 for storage
const formidable = require('formidable');

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS,
    region: process.env.MY_AWS_REGION,
});

exports.handler = async (event, context) => {
    const form = new formidable.IncomingForm();

    return new Promise((resolve, reject) => {
        form.parse(event.body, async (err, fields, files) => {
            if (err) {
                reject({ statusCode: 400, body: 'Error parsing files' });
                return;
            }

            // Get file details
            const file = files.file[0]; // Assuming 'file' is the field name for the upload
            const fileContent = fs.readFileSync(file.path);

            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: file.name,
                Body: fileContent,
                ContentType: file.type,
            };

            try {
                await s3.upload(params).promise();
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ message: 'File uploaded successfully!' }),
                });
            } catch (uploadError) {
                reject({ statusCode: 500, body: JSON.stringify({ message: uploadError.message }) });
            }
        });
    });
};
