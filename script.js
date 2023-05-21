var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('file-input');
var uploadBtn = document.getElementById('upload-btn');
var fileName = document.getElementById('file-name');

dropzone.addEventListener('dragover', function(e) {
  e.preventDefault();
  dropzone.style.backgroundColor = '#e9e9e9';
});

dropzone.addEventListener('dragleave', function(e) {
  e.preventDefault();
  dropzone.style.backgroundColor = '#fff';
});

dropzone.addEventListener('drop', function(e) {
  e.preventDefault();
  dropzone.style.backgroundColor = '#fff';

  var files = e.dataTransfer.files;
  displayFiles(files);
});

uploadBtn.addEventListener('click', function() {
  fileInput.click();
});

fileInput.addEventListener('change', function() {
  var files = fileInput.files;
  displayFiles(files);
});

function displayFiles(files) {
  var fileNames = '';
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    fileNames += file.name + ', ';
  }
  fileName.textContent = 'Selected files: ' + fileNames.slice(0, -2);
  // Perform actions with the selected file(s) here
}