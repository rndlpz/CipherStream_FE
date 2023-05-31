var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('file-input');
var uploadBtn = document.getElementById('upload-btn');
var fileName = document.getElementById('file-name');
var linkElement = document.getElementById('linkToShare');

//updating link
var currentURL = window.location.href;
linkElement.href = currentURL;


//changing file input to uploaded files
fileInput.addEventListener("change", function(e) {
  var file = fileInput.files[0];

 if (file) {
   fileName.textContent = "File name: " + file.name;
  } else {
    fileName.textContent = "No file selected";
  }
});


//Dropzone Event Listeners
//------------------------------------
//when dragging files over
dropzone.addEventListener('dragover', function(e) {
  e.preventDefault();
  dropzone.style.backgroundColor = '#e9e9e9';
});

//when leaving dragging files
dropzone.addEventListener('dragleave', function(e) {
  e.preventDefault();
  dropzone.style.backgroundColor = '#ffe6f2';
});

//when dropping files
dropzone.addEventListener('drop', function(e) {
  e.preventDefault();
  dropzone.style.backgroundColor = '#e7dcf5';

  var files = e.dataTransfer.files;
  displayFiles(files);
});

//Upload button Event Listeners
//-------------------------------------
//changing cursor when uploading files
uploadBtn.addEventListener('click', function(e) {//gets file input
  fileInput.click();
});


// //displays files
// fileInput.addEventListener('change', function() {
//   var files = fileInput.files;//gets files from input
//   displayFiles(files);//runs displayFiles function
// });


//copies link when clicked on
linkElement.addEventListener("click", function(e) {
    // event.preventDefault(); // Prevent the link from navigating to the URL

    var link = linkElement.href;

    // Create a temporary input element
    var input = document.createElement("input");
    input.style.opacity = "0"; // Hide the input element
    input.value = link;
    document.body.appendChild(input);

    // Copy the link from the input element
    input.select();
    document.execCommand("copy");

    // Remove the temporary input element
    document.body.removeChild(input);

    // Optionally provide feedback to the user
    alert("Link copied to clipboard: " + link);
});


//helper function for changing file input
function displayFiles(files) {
  var fileNames = '';
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    fileNames += file.name + ', ';
  }
  fileNames.textContent = 'Selected files: ' + fileNames.slice(0, -2);
  var fileNamePrint = document.getElementById("file-name")
  fileNamePrint.textContent += fileNames;
  // Perform actions with the selected file(s) here
}