document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('drawing-upload');
  const scale = document.getElementById('scale-input').value;
  const resultsDiv = document.getElementById('results');

  const formData = new FormData();
  formData.append('drawing', fileInput.files[0]);
  formData.append('scale', scale);

  resultsDiv.innerHTML = 'Processing...';

  try {
    const res = await fetch('/process', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.error) {
      resultsDiv.innerHTML = 'Error: ' + data.error;
    } else {
      resultsDiv.innerHTML = JSON.stringify(data.results, null, 2);
    }
  } catch (error) {
    resultsDiv.innerHTML = 'Failed to connect to server.';
  }
});
