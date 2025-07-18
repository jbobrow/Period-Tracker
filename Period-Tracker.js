/* Period Tracker */
// Step 1: retrieve last period date
// Step 2: look 28 days ahead and show how many days away that is
// Bonus: Added Fertility indicator with teal during the most fertile window

let fileManager = FileManager.iCloud();
let filePath = fileManager.documentsDirectory();
let file = fileManager.joinPath(filePath, "periodTracker.csv");
fileManager.downloadFileFromiCloud(file);

var days = 365; // this is a default value, if unchanged, the widget will display that it needs setup

if(fileManager.fileExists(file)) {
  console.log("File found!");

  var prevPeriodDate = getLastPeriodDate(file);
  
  // Only calculate if we have a valid previous period date
  if (prevPeriodDate !== null) {
    var averagePeriodLength = getAveragePeriodLength(file);
    var now = new Date().getTime();
    var distance = prevPeriodDate - now;
    var distanceToNext = distance + averagePeriodLength * (1000 * 60 * 60 * 24);
    days = Math.floor(distanceToNext / (1000 * 60 * 60 * 24))+1;
    days = days > 0 ? days : 0;
  } else {
    // No valid period date found, keep default value
    console.log("No valid period date found in file");
    days = 365; // This will trigger the setup message
  }
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
    widget.backgroundImage = canvas.getImage(); // add circle if initialized

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
    setupTitle.font = new Font("Helvetica-Bold", 20);
    setupTitle.textColor = new Color('#FFFFFF');
    setupTitle.leftAlignText();
    setupTitle.lineLimit = 0;
        
    let setupPrompt = widget.addText("Click here to log a period.")
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
  
  // Handle case where file is empty or returns null
  if (!data || data.trim() === "") {
    return null;
  }
  
  var dates = data.split(',');
  
  // Check if we have valid dates
  if (dates.length === 0 || dates[dates.length-1].trim() === "") {
    return null;
  }
  
  var date = new Date(dates[dates.length-1].trim()).getTime();
  
  return date;
}


/*
 *
 */
function getAveragePeriodLength(file) {
  var avg = 28; // default to 28

  var data = fileManager.readString(file);
  
  // Handle case where file is empty or returns null
  if (!data || data.trim() === "") {
    return avg;
  }
  
  var dates = data.split(',');
    
  if( dates.length > 2 ) {
    var total = 0;
    var num = dates.length-1;
    var first = num >= 6 ? num - 6 : 0;
    

    for(var i=num; i>first; i--) {
      var beginDate = new Date(dates[i-1]).getTime();
      var endDate = new Date(dates[i]).getTime();
      var daysBetween = Math.floor((endDate-beginDate) / (1000 * 60 * 60 * 24));
      
      if( daysBetween >= 40 ) { // invalid: don't add this one to the total 
      
        if(first > 0) {
          first--;  // let's get another date
        }
        num--;    // let's also shift our total
        
        console.log("gap detected with " + daysBetween + " days"); 
      }
      else {
        total += daysBetween; // valid: add this one to the total
      }
    }

    avg = total / (num - first);
    console.log("Calculated average period length: " + avg + " days");
  }
  
  return avg;
}


/*
 * Get a background color based on the number of days
 */  
function backgroundColorByDays(days) {
  
  // Fertile Window
  if(days > 18) {
    return new Color("#4A4B4C"); // Dark Grey
  }
  else if(days > 15) {
    return new Color("#468585"); // Dark Teal
  }
  else if(days > 13) {
    return new Color("#50B498"); // Teal
  }  
  
  // Period
  else if(days > 7) {
    return new Color("#4A4B4C"); // Dark Grey
  }
  else if(days > 3) {
    return new Color("#985353"); // Middle Red
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
  canvas.fillEllipse(new Rect((canvSize-size)/2,(canvSize-size)/2,size,size));
}