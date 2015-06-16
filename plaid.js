var diameter = 15;
var margin = 3;

var dx = (diameter + margin);
var dy = (diameter + margin);
var x0 = dx * 2, x1 = x0 + dx * 2;
var y0 = dy * 2, y1 = y0 + dy * 2;

var stripeNumX = 3;
var stripeWidthX = [ 30, 10, 20 ];
var stripeMarginX = [ 80, 50, 60 ];
var stripeCenterX = [], stripeRepeatX;
var stripeDraggedX = -1, stripeDraggedMarginX = -1, stripeDraggedWidthX = -1, dragStartX = -1;
var stripeRightEdgeDraggedX = -1;
var stripeLeftEdgeDraggedX = -1;

var stripeNumY = 2;
var stripeWidthY = [ 10, 30 ];
var stripeMarginY = [ 20, 20 ];
var stripeStartY = [], stripeEndY = [], stripeRepeatY;
var stripeDraggedY = -1, stripeDraggedMarginY = -1, dragStartY = -1;

function setup()
{
  createCanvas(windowWidth, windowHeight);
  drawPlaid();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawPlaid();
}

function mousePressed()
{
  dragStartX = -1; stripeDraggedX = -1; stripeRightEdgeDragged = -1; stripeLeftEdgeDragged = -1;
  if (mouseY < y1) { // can only drag using the handles, not the whole stripe
    dragStartX = mouseX;
    for (var count = 0; count < stripeNumX; count++) {
      if (dragStartX >= stripeStartX[count] && dragStartX < stripeStartX[count] + stripeWidthX[count]) {
        stripeDraggedX = count;
        stripeDraggedMarginX = stripeMarginX[count];
      }
      if(dragStartX <= stripeStartX[count] && dragStartX >= stripeStartX[count] - 6) {
        stripeLeftEdgeDraggedX = count;
        stripeDraggedWidthX = stripeWidthX[count];
        stripeDraggedMarginX = stripeMarginX[count];
      }
      if(dragStartX >= stripeStartX[count] + stripeWidthX[count] && dragStartX <= stripeStartX[count] + stripeWidthX[count] + 6) {
        stripeRightEdgeDraggedX = count;
        stripeDraggedWidthX = stripeWidthX[count];
        stripeDraggedMarginX = stripeMarginX[(count + 1) % stripeNumX];
      }
    }
  }

  dragStartY = -1; stripeDraggedY = -1;
  if (mouseX < x1) { // can only drag using the handles, not the whole stripe
    dragStartY = mouseY;
    for (var count = 0; count < stripeNumY; count++) {
      if (dragStartY >= stripeStartY[count] && dragStartY < stripeStartY[count] + stripeWidthY[count]) {
        stripeDraggedY = count;
        stripeDraggedMarginY = stripeMarginY[count];
      }
    }
  }
}

function mouseDragged()
{
  if (stripeDraggedX != -1) {
    var prevstripeMarginX = stripeMarginX[stripeDraggedX];
    stripeMarginX[stripeDraggedX] = stripeDraggedMarginX + (mouseX - dragStartX);
    if (stripeMarginX[stripeDraggedX] < 0) stripeMarginX[stripeDraggedX] = 0;
    if (prevstripeMarginX != stripeMarginX[stripeDraggedX]) drawPlaid();
  }

  if (stripeLeftEdgeDraggedX != -1) {
    var prevstripeWidthX = stripeWidthX[stripeLeftEdgeDraggedX];
    var prevstripeMarginX = stripeMarginX[stripeDraggedX];
    print(mouseX - dragStartX + " " + stripeWidthX[stripeLeftEdgeDraggedX] + " " + stripeMarginX[stripeLeftEdgeDraggedX]);
    var delta = (mouseX - dragStartX > 0) ?
      min(mouseX - dragStartX, stripeDraggedWidthX) :
      max(mouseX - dragStartX, -stripeDraggedMarginX);
    print(delta);
    stripeWidthX[stripeLeftEdgeDraggedX] = stripeDraggedWidthX - delta;
    stripeMarginX[stripeLeftEdgeDraggedX] = stripeDraggedMarginX + delta;
    if (delta != 0) drawPlaid();
  }

  if (stripeRightEdgeDraggedX != -1) {
    var prevstripeWidthX = stripeWidthX[stripeRightEdgeDraggedX];
    var prevstripeMarginX = stripeMarginX[(stripeRightEdgeDraggedX + 1) % stripeNumX];
    var delta = (mouseX - dragStartX < 0) ?
      max(mouseX - dragStartX, -stripeDraggedWidthX) :
      min(mouseX - dragStartX, stripeDraggedMarginX);
    print(delta);
    stripeWidthX[stripeRightEdgeDraggedX] = stripeDraggedWidthX + delta;
    stripeMarginX[(stripeRightEdgeDraggedX + 1) % stripeNumX] = stripeDraggedMarginX - delta;
    if (delta != 0) drawPlaid();
  }

  if (stripeDraggedY != -1) {
    var prevstripeMarginY = stripeMarginY[stripeDraggedY];
    stripeMarginY[stripeDraggedY] = stripeDraggedMarginY + (mouseY - dragStartY);
    if (stripeMarginY[stripeDraggedY] < 0) stripeMarginY[stripeDraggedY] = 0;
    if (prevstripeMarginY != stripeMarginY[stripeDraggedY]) drawPlaid();
  }
}

function mouseReleased()
{
  stripeDraggedX = -1; stripeLeftEdgeDraggedX = -1; stripeRightEdgeDraggedX = -1;
  stripeDraggedY = -1;
}

function drawPlaid()
{
  var i, j, stripe;

  background(0);
  noStroke();

  i = x1; first = true;
  stripeStartX = []; 
  while (i < width) {
    for (stripe = 0; stripe < stripeNumX; stripe++) {
      i += stripeMarginX[stripe];
      if (first) stripeStartX.push(i);
      noStroke();
      fill(255);
      rectMode(CORNER);
      rect(i, y1, stripeWidthX[stripe], height);
      if (first) {
        translate(i, y1);

        noStroke();
        fill(128);
        rectMode(CORNER);
        rect(0, -25, stripeWidthX[stripe], 11);

        stroke(0);
        line(0, -20, stripeWidthX[stripe], -20);
        line(0, -20, 3, -20 + 3);
        line(0, -20, 3, -20 - 3);
        line(stripeWidthX[stripe], -20, stripeWidthX[stripe] - 3, -20 + 3);
        line(stripeWidthX[stripe], -20, stripeWidthX[stripe] - 3, -20 - 3);

        stroke(128);

        line(0, -2, 0, -8);
        line(0, -5, -6, -5);
        line(-6, -5, -6 + 3, -5 + 3);
        line(-6, -5, -6 + 3, -5 - 3);

        line(stripeWidthX[stripe], -2, stripeWidthX[stripe], -8);
        line(stripeWidthX[stripe], -5, stripeWidthX[stripe] + 6, -5);
        line(stripeWidthX[stripe] + 6, -5, stripeWidthX[stripe] + 6 - 3, -5 + 3);
        line(stripeWidthX[stripe] + 6, -5, stripeWidthX[stripe] + 6 - 3, -5 - 3);

        translate(-i, -y1);
      }
      i += stripeWidthX[stripe];
    }
    if (first) stripeRepeatX = i;
    first = false;
  }

  j = y1; first = true;
  stripeStartY = []; 
  while (j < height) {
    for (stripe = 0; stripe < stripeNumY; stripe++) {
      j += stripeMarginY[stripe];
      if (first) stripeStartY.push(j);
      noStroke();
      fill(255);
      rectMode(CORNER);
      rect(x1, j, width, stripeWidthY[stripe]);
      if (first) {
        translate(x1, j);

        noStroke();
        fill(128);
        rectMode(CORNER);
        rect(-27, 0, 15, stripeWidthY[stripe]);

        stroke(0);
        line(-20, 0, -20, stripeWidthY[stripe]);
        line(-20, 0, -20 + 3, 3);
        line(-20, 0, -20 - 3, 3);
        line(-20, stripeWidthY[stripe], -20 + 3, stripeWidthY[stripe] - 3);
        line(-20, stripeWidthY[stripe], -20 - 3, stripeWidthY[stripe] - 3);

        translate(-x1, -j);
      }
      j += stripeWidthY[stripe];
    }
    if (first) stripeRepeatX = j;
    first = false;
  }
}
