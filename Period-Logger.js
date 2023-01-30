/* Period Logger */
// Step 1: retrieve file and add today as last period date

let fileManager = FileManager.iCloud();
let filePath = fileManager.documentsDirectory();
let file = fileManager.joinPath(filePath, "periodTracker.csv");
fileManager.downloadFileFromiCloud(file);

if(fileManager.fileExists(file)) {
  console.log("File found!");
  
  // determine if it makes sense to add the date (i.e. more than 14 days away)
  var prevPeriodDate = getLastPeriodDate(file);
  var now = new Date().getTime();
  var diff = prevPeriodDate - now;
  var daysSince = Math.abs(Math.floor(diff / (1000 * 60 * 60 * 24)));

  
  if( daysSince > 14 ) {

    var dateToAdd = new Date();
    var dateString = dateToAdd.toLocaleDateString();
    var data = fileManager.readString(file);
    data = data + ",\n" + dateString;
    fileManager.writeString(file, data);
    console.log(dateString + " added ✅");
    
    // show the user
    let alert = new Alert();
    alert.title = "✅ Period Logged ✅";
    alert.message = "Added " + dateString + " to the period log.";
    alert.addAction("Thanks!");
    alert.present();
  }
  else {
    
    // show the user
    let alert = new Alert();
    alert.title = "⚠️No Period Logged⚠️";
    alert.message = "It's only been " + daysSince + " day(s) since the last logged period. No period Logged";
    alert.addCancelAction("Thanks... 😬");
    alert.present();

  }
  
}
else {
  var dateToAdd = new Date();
  var dateString = dateToAdd.toLocaleDateString();
  fileManager.writeString(file, dateString);
  console.log("No File found, so we created one!");
  console.log(dateString + " added ✅");
  
  // show the user
  let alert = new Alert();
  alert.title = "⚠️Period Log Created👍";
  alert.message = "No File found, so we created one!" + dateString + " added.";
  alert.addAction("Thanks!");
  alert.present();
}


Script.complete();

/*
 * Get the last recorded Period date from the file
 */
function getLastPeriodDate(file) {
  
  var data = fileManager.readString(file);
  var dates = data.split(',');
  console.log(dates.length);
  
  var date = new Date(dates[dates.length-1]).getTime();
  
  return date;
}

