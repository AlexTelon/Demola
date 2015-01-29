function setup() {
    createCanvas(840, 480);
    background(50);
    strokeWeight(2);
    medicine = []; // array for all medecin placements
    r = 0;
    g = 255;
    b = 0;
    frameRate(10);
}

var w= 30; // width of medicine
var h = w; // height of medicine
var boxBeingDragged = false; // is a box being dragged right now
var currentBox = -1; // which box is being dragged right now
var boxLineMargin = 50;
var margin = 50;

function draw() {
    background(50);
    if (boxBeingDragged) {
	console.log("boxBeingDragged");
	medicine[currentBox].x = mouseX;
	medicine[currentBox].y = mouseY;
    }

    for (var i in medicine) {
	element = medicine[i];
	stroke(element.r,element.g,element.b);
	line(element.x+w+boxLineMargin, height, element.x+w+boxLineMargin, 0); 
	drawMedicine(element);
	drawPic(element);
	drawInfo1(element);
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
	medicine.push(createMed(x,y,r,g,b))
    } else {
	currentBox  = findBox(x,y);
	console.log("currentBox is:" + currentBox);
	boxBeingDragged = true;
	console.log(boxBeingDragged);
    }
}

function mouseReleased() {
    boxBeingDragged = false;
}

// returns -1 if it does not find anything, otherwise returns index
function findBox(x,y) {
    for (var i in medicine) {
	element = medicine[i];
	boxX = element.x;
	boxY = element.y;
	
	//approximative calculation on if we are at the current box
	if (dist(x, y, boxX, boxY) < w)  {
	    return i;
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

// draws a single medicine box
function drawMedicine(element) {
    var x = element.x;
    var y = element.y;
    var r = element.r;
    var g = element.g;
    var b = element.b;
    stroke(0);
    fill(r,g,b);
    console.log("x: ", x, "y: ", y);
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
    var picW = map(x,0,width,0,x)/10 + margin;
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
    var picW = map(x,0,width,0,x)/10 + margin;
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


// takes x,y and a color array = [r,g,b]
function createMed(x,y,color) {
    return {x:x,
	    y:y,
	    r:color[0],
	    g:color[1],
	    b:color[2]};
}

function createMed(x,y,r,g,b) {
    return {x:x,
	    y:y,
	    r:r,
	    g:g,
	    b:b,};
}




// TODO
/* 
1: make a struct out of the elements in the medicine array
2: make sure every element can somehow figure out/know how far too the left it can go
3: split the x-position of the box from the line. That way we can have a "stop" on a min distance so that we are never too close to another border to the left. OR we might want to make the whole area disapear for a med if its too close to some other med to the left.


*/

/*
create function that makes a thingie like this later
var person = {
    firstName:"John",
    lastName:"Doe",
    age:50,
    eyeColor:"blue"
}; */

