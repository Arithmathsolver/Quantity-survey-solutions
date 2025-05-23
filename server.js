const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  console.log(`Received file: ${filePath}`);

  const python = spawn('python', ['analyze.py', filePath]);

  python.stdout.on('data', (data) => {
    console.log(`Python output: ${data}`);
    res.send(`Result: ${data}`);
  });

  python.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
  });

  python.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      return res.status(500).send("Processing failed");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
