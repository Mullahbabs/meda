// MEDA Form Validation and File Handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('medaRegistrationForm');
    
    // Initialize all file upload boxes
    document.querySelectorAll('.file-upload-box').forEach(uploadBox => {
      const fileInput = uploadBox.querySelector('input[type="file"]');
      const previewArea = document.createElement('div');
      previewArea.className = 'file-preview';
      uploadBox.appendChild(previewArea);
  
      // Handle file selection
    fileInput.addEventListener('change', function(e) {
        previewArea.innerHTML = '';
        const files = Array.from(e.target.files);
        
    if (files.length > 0) {
        // Show file names and previews if images
          files.forEach(file => {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'file-item';
            
            if (file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'file-thumbnail';
                fileDiv.appendChild(img);
              };
              reader.readAsDataURL(file);
            } else {
              fileDiv.innerHTML = `<i class="fas fa-file-alt"></i>`;
            }
            
            const fileName = document.createElement('span');
            fileName.textContent = file.name;
            fileDiv.appendChild(fileName);
            
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.className = 'remove-file';
            removeBtn.addEventListener('click', () => {
              fileInput.value = '';
              previewArea.removeChild(fileDiv);
            });
            
            fileDiv.appendChild(removeBtn);
            previewArea.appendChild(fileDiv);
          });
        }
      });
  
      // Make the whole box clickable
      uploadBox.addEventListener('click', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
          fileInput.click();
        }
      });
    });
  
    // Form Validation
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      let isValid = true;
  
      // Validate required fields
      form.querySelectorAll('[required]').forEach(field => {
        const parent = field.closest('.input-group, .file-upload-group');
        
        if (!field.value) {
          parent.classList.add('error');
          isValid = false;
          
          // Create error message if not exists
          if (!parent.querySelector('.error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'This field is required';
            parent.appendChild(errorMsg);
          }
        } else {
          parent.classList.remove('error');
          const errorMsg = parent.querySelector('.error-message');
          if (errorMsg) errorMsg.remove();
        }
      });
  
      // Validate file types and sizes
      form.querySelectorAll('input[type="file"]').forEach(fileInput => {
        const parent = fileInput.closest('.file-upload-group');
        const files = fileInput.files;
        const acceptTypes = fileInput.accept;
        const maxSize = 5 * 1024 * 1024; // 5MB default
  
        if (files.length > 0) {
          Array.from(files).forEach(file => {
            // Check file type
            if (acceptTypes && !acceptTypes.split(',').some(type => {
              const ext = type.replace('.', '').trim();
              return file.name.toLowerCase().endsWith(ext) || 
                     file.type.startsWith(type.replace('/*', ''));
            })) {
              showFileError(parent, 'Invalid file type');
              isValid = false;
            }
            
            // Check file size (ID photos max 2MB, others 5MB)
            const sizeLimit = fileInput.id.includes('id') ? 2 * 1024 * 1024 : maxSize;
            if (file.size > sizeLimit) {
              showFileError(parent, `File too large (max ${sizeLimit/1024/1024}MB)`);
              isValid = false;
            }
          });
        }
      });
    
      if (isValid) {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <span>Application submitted successfully!</span>
        `;
        form.prepend(successMsg);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          form.reset();
          document.querySelectorAll('.file-preview').forEach(preview => {
            preview.innerHTML = '';
          });
          successMsg.remove();
        }, 3000);
      } else {
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  
    function showFileError(parent, message) {
      parent.classList.add('error');
      let errorMsg = parent.querySelector('.error-message');
      
      if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        parent.appendChild(errorMsg);
      }
      
      errorMsg.textContent = message;
    }
  });