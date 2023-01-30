/* Period Tracker */
// Step 1: retrieve last period date
// Step 2: look 28 days ahead and show how many days away that is

let fileManager = FileManager.iCloud();
let filePath = fileManager.documentsDirectory();
let file = fileManager.joinPath(filePath, "periodTracker.csv");
fileManager.downloadFileFromiCloud(file);

if(fileManager.fileExists(file)) {
  console.log("File found!");
}
else {
  console.log("No File found :(");
}

var prevPeriodDate = getLastPeriodDate(file);
var averagePeriodLength = 28; // TODO: calculate this based on historical data... (not that critical)
var now = new Date().getTime();
var distance = prevPeriodDate - now;
var distanceToNext = distance + 28 * (1000 * 60 * 60 * 24);
var days = Math.floor(distanceToNext / (1000 * 60 * 60 * 24));


let widget = createWidget(days);
Script.setWidget(widget);
Script.complete();
  
// run widget
widget.presentSmall();


/*
 * Create, layout, and draw the widget
 */
function createWidget(days) {
  let widget = new ListWidget();

  // draw background color
  widget.backgroundColor = backgroundColorByDays(days);

  let title = widget.addText("Period expected in")
  title.font = Font.semiboldSystemFont(14);
  title.textColor = textColorByDays(days);
  title.leftAlignText();
  title.lineLimit = 2;
  
  let countText = widget.addText(days.toString());
  countText.font = Font.semiboldSystemFont(48);
  countText.textColor = textColorByDays(days);
  countText.leftAlignText();  

  let daysText = widget.addText("days");
  daysText.font = Font.semiboldSystemFont(14);
  daysText.textColor = textColorByDays(days);
  daysText.leftAlignText();  

  return widget
}

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


/*
 * Get a background color based on the number of days
 */  
function backgroundColorByDays(days) {
  
  if(days > 7) {
    return new Color("#222A2A"); // Dark Grey
  }
  else if(days > 3) {
    return new Color("#662222"); // Dark Red
  }
  else {
    return new Color("#AA2222"); // Lighter Red    
  }
}


/*
 * Get a text color based on the number of days
 */  
function textColorByDays(days) {
  
  if(days > 7) {
    return new Color("#666A6A"); // Dark Grey
  }
  else if(days > 3) {
    return new Color("#CCAAAA"); //
  }
  else {
    return new Color("#EECCCC"); //
  }
}
