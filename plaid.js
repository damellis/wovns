var diameter = 15;
var margin = 3;
var dx = (diameter + margin);
var dy = (diameter + margin);
var x0 = dx * 2, x1 = x0 + dx * 2;
var y0 = dy * 2, y1 = y0 + dy * 2;

var stripeNumX = 3;
var stripeWidthX = [ 3, 1, 2 ];
var stripeMarginX = [ 8, 5, 6 ];
var stripeStartX = [], stripeEndX = [], stripeRepeatX;
var shapeDraggedX = -1, stripeDraggedX = -1, stripeDraggedMarginX = -1;

var stripeNumY = 2;
var stripeWidthY = [ 1, 3 ];
var stripeMarginY = [ 2, 2 ];
var stripeStartY = [], stripeEndY = [], stripeRepeatY;
var shapeDraggedY = -1, stripeDraggedY = -1, stripeDraggedMarginY = -1;

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
  shapeDraggedX = -1; stripeDraggedX = -1;
  if (mouseY < y1) { // can only drag using the handles, not the whole stripe
    shapeDraggedX = Math.floor((mouseX - x1 + dx / 2) / dx); // convert mouse coordinates to shape coordinates
    for (var count = 0; count < stripeNumX; count++) {
      if (shapeDraggedX >= stripeStartX[count] && shapeDraggedX < stripeEndX[count]) {
        stripeDraggedX = count;
        stripeDraggedMarginX = stripeMarginX[count];
      }
    }
  }

  shapeDraggedY = -1; stripeDraggedY = -1;
  if (mouseX < x1) { // can only drag using the handles, not the whole stripe
    shapeDraggedY = Math.floor((mouseY - y1 + dy / 2) / dy); // convert mouse coordinates to shape coordinates
    for (var count = 0; count < stripeNumY; count++) {
      if (shapeDraggedY >= stripeStartY[count] && shapeDraggedY < stripeEndY[count]) {
        stripeDraggedY = count;
        stripeDraggedMarginY = stripeMarginY[count];
      }
    }
  }
}

function mouseDragged()
{
  if (stripeDraggedX != -1) {
    var shapeX = Math.floor((mouseX - x1 + dx / 2) / dx); // convert mouse coordinates to shape coordinates
    var prevstripeMarginX = stripeMarginX[stripeDraggedX];
    stripeMarginX[stripeDraggedX] = stripeDraggedMarginX + (shapeX - shapeDraggedX);
    if (stripeMarginX[stripeDraggedX] < 1) stripeMarginX[stripeDraggedX] = 1;
    if (prevstripeMarginX != stripeMarginX[stripeDraggedX]) drawPlaid();
  }

  if (stripeDraggedY != -1) {
    var shapeY = Math.floor((mouseY - y1 + dy / 2) / dy); // convert mouse coordinates to shape coordinates
    var prevstripeMarginY = stripeMarginY[stripeDraggedY];
    stripeMarginY[stripeDraggedY] = stripeDraggedMarginY + (shapeY - shapeDraggedY);
    if (stripeMarginY[stripeDraggedY] < 1) stripeMarginY[stripeDraggedY] = 1;
    if (prevstripeMarginY != stripeMarginY[stripeDraggedY]) drawPlaid();
  }
}

function mouseReleased()
{
  shapeDraggedX = -1;
  stripeDraggedX = -1;

  shapeDraggedY = -1;
  stripeDraggedY = -1;
}

function mouseClicked()
{
  var redraw = false;

  if (mouseY < y1) {
    var shapeX = (mouseX - x1 + dx / 2) / dx;
    for (var count = 0; count < stripeNumX; count++) {
      if (shapeX >= stripeStartX[count] - 0.25 && shapeX < stripeStartX[count] + 0.25) {
        if (stripeWidthX[count] > 1) {
          stripeWidthX[count]--;
          redraw = true;
        }
      }
      if (shapeX >= stripeStartX[count] + 0.75 && shapeX < stripeStartX[count] + 1.25) {
        stripeWidthX[count]++;
        redraw = true;
      }
    }
  }

  if (mouseX < x1) {
    var shapeY = (mouseY - y1 + dy / 2) / dy;
    for (var count = 0; count < stripeNumY; count++) {
      if (shapeY >= stripeStartY[count] - 0.5 && shapeY < stripeStartY[count]) {
        if (stripeWidthY[count] > 1) {
          stripeWidthY[count]--;
          redraw = true;
        }
      }
      if (shapeY >= stripeStartY[count] + .75 && shapeY < stripeStartY[count] + 1.25) {
        stripeWidthY[count]++;
        redraw = true;
      }
    }
  }

  if (redraw) drawPlaid();
}

function drawPlaid()
{
  var i, j, stripe;

  background(0);
  noStroke();

  i = 0; first = true;
  stripeStartX = []; stripeEndX = [];
  while (i < width / dx) {
    for (stripe = 0; stripe < stripeNumX; stripe++) {
      i += stripeMarginX[stripe];
      if (first) stripeStartX.push(i);
      if (first) {
        stroke('gray');
        strokeWeight(2);
        strokeCap(ROUND);
        line(x1 + i * dx - 3 * dx / 4 + 1, y0 - 3 * dy / 4, x1 + i * dx - dx / 4 - 1, y0 - 3 * dy / 4);
        line(x1 + i * dx + dx / 4 + 1, y0 - 3 * dy / 4, x1 + i * dx + 3 * dx / 4 - 1, y0 - 3 * dy / 4);
        line(x1 + i * dx + dx / 2, y0 - dy + 1, x1 + i * dx + dx / 2, y0 - dy / 2 - 1);
        noStroke();
      }
      for (var count = 0; count < stripeWidthX[stripe]; count++) {
        if (first) ellipse(i * dx + x1, y0, diameter, diameter);
        for (j = 0; j < height / dy; j++) {
          ellipse(x1 + i * dx, y1 + j * dy, diameter, diameter);
        }
        i++;
      }
      if (first) stripeEndX.push(i);
    }
    if (first) stripeRepeatX = i;
    first = false;
  }

  j = 0; first = true;
  stripeStartY = []; stripeEndY = [];
  while (j < height / dy) {
    for (stripe = 0; stripe < stripeNumY; stripe++) {
      j += stripeMarginY[stripe];
      if (first) stripeStartY.push(j);
      if (first) {
        stroke('gray');
        strokeWeight(2);
        strokeCap(ROUND);
        line(x0 - dx + 1, y1 + j * dy - dy * 3 / 4, x0 - dx / 2 - 1, y1 + j * dy - dy * 3 / 4);
        line(x0 - dx + 1, y1 + j * dy + dy * 1 / 2, x0 - dx / 2 - 1, y1 + j * dy + dy * 1 / 2);
        line(x0 - 3 * dx / 4, y1 + j * dy + dy / 4 + 1, x0 - 3 * dx / 4, y1 + j * dy + 3 * dy / 4 - 1);
        noStroke();
      }
      for (var count = 0; count < stripeWidthY[stripe]; count++) {
        if (first) ellipse(x0, j * dy + y1, diameter, diameter);
        for (i = 0; i < width / dx; i++) {
          ellipse(x1 + i * dx, y1 + j * dy, diameter, diameter);
        }
        j++;
      }
      if (first) stripeEndY.push(j);
    }
    if (first) stripeRepeatY = j;
    first = false;
  }
}
