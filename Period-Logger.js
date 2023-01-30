/* Period Logger */
// Step 1: retrieve file and add today as last period date

let fileManager = FileManager.iCloud();
let filePath = fileManager.documentsDirectory();
let file = fileManager.joinPath(filePath, "periodTracker.csv");
fileManager.downloadFileFromiCloud(file);

if(fileManager.fileExists(file)) {
  console.log("File found!");
  var dateToAdd = new Date();
  var dateString = dateToAdd.toLocaleDateString();
  var data = fileManager.readString(file);
  data = data + ",\n" + dateString;
  fileManager.writeString(file, data);
  console.log(dateString + " added ✅");
}
else {
  var dateToAdd = new Date();
  var dateString = dateToAdd.toLocaleDateString();
  fileManager.writeString(file, dateString);
  console.log("No File found, so we created one!");
  console.log(dateString + " added ✅");
}


Script.complete();
