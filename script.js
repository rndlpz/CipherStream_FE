var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('file-input');
var uploadBtn = document.getElementById('upload-btn');
var fileName = document.getElementById('file-name');

dropzone.addEventListener('dragover', function(e) {//when dragging files over
  e.preventDefault();
  dropzone.style.backgroundColor = '#e9e9e9';
});

dropzone.addEventListener('dragleave', function(e) {//when leaving field with file?
  e.preventDefault();
  dropzone.style.backgroundColor = '#ffe6f2';
});

dropzone.addEventListener('drop', function(e) {//showing files when dropped into box
  e.preventDefault();
  dropzone.style.backgroundColor = '#e7dcf5';

  var files = e.dataTransfer.files;
  displayFiles(files);
});

uploadBtn.addEventListener('click', function() {//gets file input
  fileInput.click();
});

fileInput.addEventListener('change', function() {
  var files = fileInput.files;//gets files from input
  displayFiles(files);//runs displayFiles function
});

function displayFiles(files) {
  var fileNames = '';
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    fileNames += file.name + ', ';
  }
  fileNames.textContent = 'Selected files: ' + fileNames.slice(0, -2);
  var fileNamePrint = document.getElementById("file-name")
  fileNamePrint.textContent += fileNames;
  console.log(fileNamePrint)
  console.log("Hello world")
  // Perform actions with the selected file(s) here
}