/* Period Tracker */
// Step 1: retrieve last period date
// Step 2: look 28 days ahead and show how many days away that is

let fileManager = FileManager.iCloud();
let filePath = fileManager.documentsDirectory();
let file = fileManager.joinPath(filePath, "periodTracker.csv");
fileManager.downloadFileFromiCloud(file);

var days = 365; // this is a default value, if unchanged, the widget will display that it needs setup

if(fileManager.fileExists(file)) {
  console.log("File found!");

  var prevPeriodDate = getLastPeriodDate(file);
  var averagePeriodLength = getAveragePeriodLength(file); // based on historical data...
  var now = new Date().getTime();
  var distance = prevPeriodDate - now;
  var distanceToNext = distance + averagePeriodLength * (1000 * 60 * 60 * 24);
  days = Math.floor(distanceToNext / (1000 * 60 * 60 * 24));
  days = days > 0 ? days : 0;
}
else {
  console.log("No File found :(");
}

// DRAW THE BACKGROUND CIRCLE
const canvSize = 282;
const canvas = new DrawContext();
canvas.opaque = false;
canvas.size = new Size(canvSize, canvSize);
canvas.respectScreenScale = true;
makeCircle(180);

let widget = createWidget(days);
widget.backgroundImage = canvas.getImage();
widget.url = "scriptable:///run/Period%20Logger";
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
  widget.backgroundColor = new Color('#222222');
  
  if( days != 365 ) {

    widget.addSpacer();
    const stack = widget.addStack();
    stack.setPadding(0, 0, 0, 0);
    stack.layoutVertically();
    
    let numStack = stack.addStack();
    numStack.setPadding(0,0,-12,0);
    numStack.layoutHorizontally();
    numStack.addSpacer();
    let countText = numStack.addText(days.toString());
    countText.font = new Font("Helvetica-Bold", 60);
    countText.textColor = new Color('#222222');
    numStack.addSpacer();
  
    let dayStack = stack.addStack();
    dayStack.setPadding(0,0,0,0);
    dayStack.layoutHorizontally();
    dayStack.addSpacer();
    let daysText = days===1 ? dayStack.addText("day") : dayStack.addText("days");
    daysText.font = new Font("Helvetica-Bold", 18);
    daysText.textColor = new Color('#222222');
    dayStack.addSpacer();
    
    widget.addSpacer();
  }
  else {
    // the period log isn't setup
    let setupTitle = widget.addText("⚠️ Read Me")
    setupTitle.font = new Font("Helvetica-Bold", 22);
    setupTitle.textColor = new Color('#FFFFFF');
    setupTitle.leftAlignText();
    setupTitle.lineLimit = 0;
        
    let setupPrompt = widget.addText("Please run the Period Logger script first.")
    setupPrompt.font = new Font("Helvetica-Bold", 14);
    setupPrompt.textColor = new Color('#666A6A');
    setupPrompt.leftAlignText();
    setupPrompt.lineLimit = 0;
  
    widget.addSpacer();
  }

  return widget
}


/*
 * Get the last recorded Period date from the file
 */
function getLastPeriodDate(file) {
  
  var data = fileManager.readString(file);
  var dates = data.split(',');
  //console.log(dates.length);
  
  var date = new Date(dates[dates.length-1]).getTime();
  
  return date;
}


/*
 *
 */
function getAveragePeriodLength(file) {
  var avg = 28; // default to 28

  var data = fileManager.readString(file);
  var dates = data.split(',');
    
  if( dates.length > 2 ) {
    var total = 0;
    var num = dates.length-1;

    for(var i=0; i<dates.length-1; i++) {
      var beginDate = new Date(dates[i]).getTime();
      var endDate = new Date(dates[i+1]).getTime();
      var daysBetween = Math.floor((endDate-beginDate) / (1000 * 60 * 60 * 24));      
      total += daysBetween;
    }

    avg = total / num;
    console.log("Calculated average period length: " + avg + " days");
  }
  
  return avg;
}


/*
 * Get a background color based on the number of days
 */  
function backgroundColorByDays(days) {
  
  if(days > 7) {
    return new Color("#4A4B4C"); // Dark Grey
  }
  else if(days > 3) {
    return new Color("#985353"); // Middle
  }
  else {
    return new Color("#FF644B"); // Lighter Red    
  }
}

/*
 * Adds an circle to the canvas
 */
function makeCircle(size) {
  canvas.setFillColor(backgroundColorByDays(days));
  canvas.fillEllipse(new Rect((canvSize-size)/2,(canvSize-size)/2,size,size))
}
