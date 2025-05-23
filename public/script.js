document.getElementById('upload-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const resultElement = document.getElementById('result');
  resultElement.textContent = "Processing...";

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error("Processing failed");
    }

    const result = await response.text();
    resultElement.textContent = result;
  } catch (error) {
    resultElement.textContent = "Error: " + error.message;
  }
});
