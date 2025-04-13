document.getElementById('itemImage').addEventListener('change', function () {
    const preview = document.getElementById('imagePreview');
    const file = this.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
        preview.dataset.base64 = e.target.result;  // store base64 in image tag
      };
      reader.readAsDataURL(file);
    } else {
      preview.style.display = 'none';
      preview.src = '';
      preview.dataset.base64 = '';
    }
  });
  
  document.getElementById('item-form').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = document.getElementById('itemName').value.trim();
    const category = document.getElementById('itemCategory').value;
    const price250 = document.getElementById('price250').value.trim();
    const price500 = document.getElementById('price500').value.trim();
    const price1000 = document.getElementById('price1000').value.trim();
    const imageBase64 = document.getElementById('imagePreview').dataset.base64;
  
    if (!name || !category || !imageBase64) {
      alert("❌ Please fill all required fields and upload an image.");
      return;
    }
  
    const payload = {
      name,
      category,
      price250,
      price500,
      price1000,
      image: imageBase64
    };
  
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = "⏳ Uploading item...";
  
    try {
      const res = await fetch('https://script.google.com/macros/s/AKfycbxFKEyS6Z0SKvvv1vzcPwMzFbJdi6OinEK_XyKqRYehP1UqdcFL-2pyTOR89-9J8F0S/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      statusDiv.textContent = "✅ Item saved successfully!";
      document.getElementById('item-form').reset();
      document.getElementById('imagePreview').style.display = 'none';
      document.getElementById('imagePreview').src = '';
      document.getElementById('imagePreview').dataset.base64 = '';
  
    } catch (error) {
      statusDiv.textContent = "❌ Upload failed: " + error.message;
    }
  });
  