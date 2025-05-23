const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const scaleInput = req.body.scale || '1:100';

  console.log(`File path: ${filePath}`);
  console.log(`Scale input: ${scaleInput}`);

  const python = spawn('python', ['analyze.py', filePath, scaleInput]);

  let result = '';
  python.stdout.on('data', (data) => {
    result += data.toString();
  });

  python.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
  });

  python.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python exited with code ${code}`);
      return res.status(500).send("Processing failed");
    }
    res.send(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
