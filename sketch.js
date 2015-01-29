var strokeW = 2; // how thick our lines are going to be
function setup() {
    createCanvas(840, 480);
    background(50);
    strokeWeight(strokeW);
    medicine = []; // array for all medecin placements
    r = 0;
    g = 255;
    b = 0;
    frameRate(10);
}

var w= 30; // width of medicine
var h = w; // height of medicine
var boxBeingDragged = false; // is a box being dragged right now
var currentBoxID = -1; // which box is being dragged right now
var boxLineMargin = 50; // margin from med box to the right side line
var margin = 50; // margins overall between stuff

function draw() {
    background(50);
    if (boxBeingDragged) {
	console.log("boxBeingDragged");
	getBoxWithID(currentBoxID).setX(mouseX);
	getBoxWithID(currentBoxID).setY(mouseY);
    } // FIX HERE somewhere, the drawArea thingie does not work as intended yet

    for (var i in medicine) {
	element = medicine[i];
	drawArea(element);
	stroke(element.r,element.g,element.b);
	line(element.x+w+boxLineMargin, height, element.x+w+boxLineMargin, 0); 
	drawMedicine(element);
//	drawPic(element);
//	drawInfo1(element);

    } 
}

// funktionen ritar ut en låda där man klickar
function mousePressed() {
    var x = mouseX-w/2;
    var y = mouseY-h/2;

    // if there is already medicine there we want to drag-and-drop the box instead
    if (!isThereMedicine(x, y)) {
	r = random(255);
	g = random(255);
	b = random(255);
	fill(r,g,b);

	rect(x, y, w, h);
	
	// data pushed on is of format {x,y, color}
	addMed(x,y,r,g,b);
    } else {
	currentBoxID  = findBox(x,y);
	boxBeingDragged = true;
    }
}

function mouseReleased() {
    boxBeingDragged = false;
}

// returns -1 if it does not find anything, otherwise returns the ID of the box
function findBox(x,y) {
    for (var i in medicine) {
	element = medicine[i];
	boxX = element.x;
	boxY = element.y;
	
	//approximative calculation on if we are at the current box
	if (dist(x, y, boxX, boxY) < w)  {
	    return medicine[i].ID;
	}
    } 
    return -1;
}


// returns -1 if nothing found, otherwise it gives index of the box.
function isThereMedicine(x,y) {
    if(findBox(x,y) !== -1)
	return true
    return false
}

// draws the area corresponding to a med box where info can be printed
function drawArea(element) {
    fill(element.r, element.g, element,b, 5);
    rect(element.borderLeft, 0, element.borderRight-element.borderLeft, height);
}

// draws a single medicine box
function drawMedicine(element) {
    var x = element.x;
    var y = element.y;
    var r = element.r;
    var g = element.g;
    var b = element.b;
    stroke(0);
    fill(r,g,b);
    rect(x,y,w,h);
}

// draws a picture of the medicine box
function drawPic(element) {
    var x = element.x;
    var y = element.y;
    var r = element.r;
    var g = element.g;
    var b = element.b;
    stroke(0);
    fill(r,g,b,20); // the pic is somewhat transparent
// add the two lines below in some way when we have fixed so we know how much space we
// have towards the next vertical line created by other medicine.
//    var newX = x - map(x,0,width,0,x);
//    var newY = (y - map(y,0,height,0,y))
    var newY = margin;
    var newX = margin;
    var picW = map(x,element.borderLeft,width,element.borderLeft,x)/10 + margin;
    var picH = map(x,0,width,0,x)/10 + margin;
    rect(newX,newY,picW,picH);
}


// draws a picture of the medicine box
function drawInfo1(element) {
    var x = element.x;
    var y = element.y;
    var r = element.r;
    var g = element.g;
    var b = element.b;
    stroke(0);
    fill(r,g,b,20); // the pic is somewhat transparent
// add the two lines below in some way when we have fixed so we know how much space we
// have towards the next vertical line created by other medicine.
//    var newX = x - map(x,0,width,0,x);
//    var newY = (y - map(y,0,height,0,y))
    var areaW = (x-element.borderLeft);
    var picW =  areaW*0.2 + 30;

//    var picW = map(x,element.borderLeft,width,element.borderLeft,x)/10 + margin;
    var picH = map(x,0,width,0,x)/10 + margin;

    var infoX = picW + margin*2;
    var infoY = margin;
    var infoW = x - infoX;
    var infoH = picH;
    
    if (infoW < 200) {
	infoW = infoW + infoX; // add the previous X-pos
	infoY = infoX; // infoY is previous x-pos
	infoX = margin; // new X is below pic
    }

    rect(infoX,infoY,infoW,infoH);
}

var medGlobalIndex = 0; // used to give every box a unique index

function createMed(x,y,r,g,b) {
    medGlobalIndex++;
    med = {x:x,
	    y:y,
	    r:r,
	    g:g,
	    b:b,
	    borderRight:x+margin, // specifies where its area ends to the right
	    borderLeft: -1, // obviously a bad number, but updateMed will fix this
	    ID: medGlobalIndex,
	    setX: function(x) { // if everybody uses .setX() instead of .x everything should be fine
		this.x = x;		
		updateMeds();
	    },
	    setY: function(y) {
		this.y = y;		
		updateMeds();
	    },
	   };
    return med;
}

function addMed(x,y,r,g,b) {
    medicine.push(createMed(x,y,r,g,b))
    updateMeds(); // make sure its correctly put in and that borderLeft is set
}

//a med has been updated so we need to make sure the medicine array is correctly sorted
function updateMeds() {
    // sort in acending order so leftmost element first.
    medicine.sort(function(a, b){
	// Compare the 2 x-positions
	if(a.x < b.x) return -1;
	if(a.x > b.x) return 1;
	return 0;
    });
//  console.log("updateMeds, this is all meds: ", medicine);
    for (var i in medicine) {
	if (i == 0)
	    medicine[i].borderLeft = 0; // TODO - this should be set to some margin instead so we dont hit the wall
	else
	    medicine[i].borderLeft = medicine[i-1].x + strokeW // + strokeW so we dont draw over previous lines;
    } // TODO FIX HERE - check if the fault is somewhere here
}


/* This function is used for getting a specific box from the medicine array. This is needed
since we sort the array frequently and as such the indexes cannot be trusted nor reused*/
function getBoxWithID(id) {
    for (var i in medicine) {
	if (medicine[i].ID === id)
	    return medicine[i];
    }
    return null;
}



// TODO
/* 
2: make sure every element can somehow figure out/know how far to the left it can go
3: split the x-position of the box from the line. That way we can have a "stop" on a min distance so that we are never too close to another border to the left. OR we might want to make the whole area disapear for a med if its too close to some other med to the left.


*/

