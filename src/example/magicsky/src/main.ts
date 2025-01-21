import { invoke } from "@tauri-apps/api/core";

//console.log = (log) => invoke('dbg', log);

// Creates and adds the full-screen form to the DOM
function createUploadForm() {
  const form = document.createElement('div');
  form.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  form.innerHTML = `
    <div style="width: 100%; max-width: 500px;">
      <h2 style="text-align: center; margin-bottom: 20px;">Upload Form</h2>
      
      <div style="margin-bottom: 15px;">
        <label>Image:</label><br>
        <input type="file" id="imageUpload" accept="image/*">
      </div>

      <div style="margin-bottom: 15px;">
        <label>Title:</label><br>
        <input type="text" id="titleInput" style="width: 100%; padding: 8px; margin-top: 5px;">
      </div>

      <div style="margin-bottom: 15px;">
        <label>Description:</label><br>
        <input type="text" id="descInput" style="width: 100%; padding: 8px; margin-top: 5px;">
      </div>

      <div style="margin-bottom: 15px;">
        <label>Price:</label><br>
        <input type="number" id="priceInput" style="width: 100%; padding: 8px; margin-top: 5px;">
      </div>

      <button id="submitBtn" style="width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Submit
      </button>

      <div id="fileInfo" style="margin-top: 20px;"></div>
    </div>
  `;

  document.body.appendChild(form);

  // Add event listeners
  const fileInput = document.getElementById('imageUpload');
  const submitBtn = document.getElementById('submitBtn');
  const fileInfo = document.getElementById('fileInfo');

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      fileInfo.innerHTML = `
        <strong>Selected File:</strong><br>
        Name: ${file.name}<br>
        Type: ${file.type}<br>
        Size: ${(file.size / 1024).toFixed(2)} KB
      `;
    }
  });

console.log('should add the listener');

  submitBtn.addEventListener('click', () => {
console.log('button clicked');
    const file = fileInput.files[0];
    if (!file) {
      alert('Please select an image');
      return;
    }
console.log('there\'s a file');

    const formData = {
      title: document.getElementById('titleInput').value,
      description: document.getElementById('descInput').value,
      price: document.getElementById('priceInput').value,
      filePath: file.name,
      fileType: file.type,
      fileSize: file.size
    };
console.log('and form data' + JSON.stringify(formData));

    window.alert('Form Data:' + JSON.stringify(formData));
  });
}

// Call this function to create and show the form
if(document.readyState !== 'loading') {
  createUploadForm();
} else {
  window.addEventListener("DOMContentLoaded", createUploadForm);
}
