/* Period Logger */
// Step 1: retrieve file and add today as last period date

let fileManager = FileManager.iCloud();
let filePath = fileManager.documentsDirectory();
let file = fileManager.joinPath(filePath, "periodTracker.csv");
fileManager.downloadFileFromiCloud(file);


let alert = new Alert();


if(fileManager.fileExists(file)) {
  console.log("File found!");
  
  // determine days since last period
  var prevPeriodDate = getLastPeriodDate(file);
  var now = new Date().getTime();
  var diff = prevPeriodDate - now;
  var daysSince = Math.abs(Math.floor(diff / (1000 * 60 * 60 * 24)));

  alert.title = "Period Logger";
  alert.message = "It's been " + daysSince + " day(s) since the last period logged. Do you want to log a period today?";
  alert.addAction("Log period");
  alert.addCancelAction("Cancel");
  var result = await alert.present();
  
  if( result == 0 ) {
    // selected Log period    
    var dateToAdd = new Date();
    var dateString = dateToAdd.toLocaleDateString();
    var data = fileManager.readString(file);
    data = data + ",\n" + dateString;
    fileManager.writeString(file, data);
    console.log(dateString + " added ✅");
    
    // show the user
    let confirmation = new Alert();
    confirmation.title = "✅ Period Logged ✅";
    confirmation.message = "Added " + dateString + " to the period log.";
    confirmation.addAction("Thanks!");
    confirmation.present();
  }
  else if( result == 1) {
    // selected cancel
    let confirmation = new Alert();
    confirmation.title = "No Period Logged";
    confirmation.message = "No date added to the period log.";
    confirmation.addAction("Thanks!");
    confirmation.present();
  }
}
else {
  // create an empty log
  fileManager.writeString(file, "");
  console.log("No File found, so we created one!");

  // prompt the user
  let alert = new Alert();
  alert.title = "⚠️Period Log Created";
  alert.message = "No File found, so we created one! Would you like to add a date?";
  alert.addAction("Yes");
  alert.addCancelAction("No");
  var result = await alert.present();
  
  if( result == 0 ) {
    // selected yes
    let datePrompt = new Alert();
    datePrompt.title = "Period Logger";
    datePrompt.message = "What date would you like to log?"
    datePrompt.addAction("Today");
    datePrompt.addAction("Other");
    var resultPrompt = await datePrompt.present();
    
    if( resultPrompt == 0 ) {
      // selected Today      
      var dateToAdd = new Date();
      var dateString = dateToAdd.toLocaleDateString();
      fileManager.writeString(file, dateString);
      console.log(dateString + " added ✅");
      
      // show the user
      let confirmation = new Alert();
      confirmation.title = "✅ Period Logged ✅";
      confirmation.message = "Added " + dateString + " to the period log.";
      confirmation.addAction("Thanks!");
      confirmation.present();
    }
    else {
      // selected other
      let otherDatePrompt = new Alert();
      otherDatePrompt.title = "Period Logger";
      otherDatePrompt.message = "Enter a date (Month/Day/Year)";
      otherDatePrompt.addTextField("i.e. 1/1/2023","");
      otherDatePrompt.addAction("Log period");
      otherDatePrompt.addCancelAction("Cancel");
      var resultCustomDate = await otherDatePrompt.present();
      
      if( resultCustomDate == 0 ) {
        // entered date
        // TODO: validate the date entered... wow, really over engineering this logger
      
        var dateString = otherDatePrompt.textFieldValue(0);
        fileManager.writeString(file, dateString);
        console.log(dateString + " added ✅");
        
        // show the user
        let confirmation = new Alert();
        confirmation.title = "✅ Period Logged ✅";
        confirmation.message = "Added " + dateString + " to the period log.";
        confirmation.addAction("Thanks!");
        confirmation.present();
          
      }
      else {
        // selected cancel
        let confirmation = new Alert();
        confirmation.title = "No Period Logged";
        confirmation.message = "No date added to the period log.";
        confirmation.addAction("Thanks!");
        confirmation.present();
      }

    }
  }
  else if( result == 1 ) {
    // selected no
    let confirmation = new Alert();
    confirmation.title = "No Period Logged";
    confirmation.message = "No date added to the period log.";
    confirmation.addAction("Thanks!");
    confirmation.present();
  }

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
