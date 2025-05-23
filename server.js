const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { PythonShell } = require('python-shell');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/process', upload.single('drawing'), (req, res) => {
  const scale = req.body.scale;
  const filePath = req.file.path;

  let options = {
    args: [filePath, scale]
  };

  PythonShell.run('analyze.py', options, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Processing failed.' });
    }

    fs.unlinkSync(filePath);
    res.json({ results: JSON.parse(results[0]) });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
