var x1 = 72;
var y1 = 72;

var padding = 3;

var stripeNumX = 3;
var stripeWidthX = [ 30, 10, 20 ];
var stripeStartX = [ 80, 150, 260 ];
var stripeDraggedX = -1, stripeDraggedStartX = -1, stripeDraggedWidthX = -1, dragStartX = -1;
var stripeRightEdgeDraggedX = -1;
var stripeLeftEdgeDraggedX = -1;
var repeatX = 500;

var stripeNumY = 2;
var stripeWidthY = [ 10, 30 ];
var stripeStartY = [ 20, 120 ];
var stripeDraggedY = -1, dragStartY = -1;
var repeatY = 500;

function arrow(x0, y0, x1, y1, size0, size1)
{
  var theta = atan2(y1 - y0, x1 - x0);
  line(x0, y0, x1, y1);
  line(x0, y0, x0 + size0 * cos(theta + PI / 4), y0 + size0 * sin(theta + PI / 4));
  line(x0, y0, x0 + size0 * cos(theta - PI / 4), y0 + size0 * sin(theta - PI / 4));
  line(x1, y1, x1 - size1 * cos(theta + PI / 4), y1 - size1 * sin(theta + PI / 4));
  line(x1, y1, x1 - size1 * cos(theta - PI / 4), y1 - size1 * sin(theta - PI / 4));
}

function setup()
{
  createCanvas(windowWidth, windowHeight);
  drawPlaid();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawPlaid();
}

function mouseClicked()
{
  print(mouseX + " " + mouseY);
  if (mouseX >= x1 + repeatX - 15 - 6 && mouseX <= x1 + repeatX - 15 + 6 && mouseY >= 15 - 6 && mouseY <= 15 + 6) {
    print("making new stripe");
    stripeWidthX.push(12);
    stripeStartX.push(repeatX - 15 - 6);
    stripeNumX++;
    drawPlaid();
  }
}

function mousePressed()
{
  dragStartX = -1; stripeDraggedX = -1; stripeRightEdgeDragged = -1; stripeLeftEdgeDragged = -1;
  dragStartX = mouseX - x1;
  if (mouseY <= y1 - 17 && mouseY >= y1 - 36) { // can only drag using the handles, not the whole stripe
    for (var count = 0; count < stripeNumX; count++) {
      if (dragStartX >= stripeStartX[count] + stripeWidthX[count] / 2 - 6 - padding && dragStartX < stripeStartX[count] + stripeWidthX[count] / 2 + 6 + padding) {
        stripeDraggedX = count;
        stripeDraggedStartX = stripeStartX[count];
        stripeDraggedWidthX = stripeWidthX[count];
      }
    }
    if (stripeDraggedX != -1) {
      stripeStartX.splice(stripeDraggedX, 1); stripeStartX.push(stripeDraggedStartX);
      stripeWidthX.splice(stripeDraggedX, 1); stripeWidthX.push(stripeDraggedWidthX);
      stripeDraggedX = stripeStartX.length - 1;
    }
  } else if (mouseY < y1 && mouseY > y1 - 17) { // can only drag using the handles, not the whole stripe
    for (var count = 0; count < stripeNumX; count++) {
      if(dragStartX <= stripeStartX[count] && dragStartX >= stripeStartX[count] - 10) {
        stripeLeftEdgeDraggedX = count;
        stripeRightEdgeDraggedX = -1;
        stripeDraggedWidthX = stripeWidthX[count];
        stripeDraggedStartX = stripeStartX[count];
      }
      if(dragStartX >= stripeStartX[count] + stripeWidthX[count] && dragStartX <= stripeStartX[count] + stripeWidthX[count] + 10) {
        stripeLeftEdgeDraggedX = -1;
        stripeRightEdgeDraggedX = count;
        stripeDraggedWidthX = stripeWidthX[count];
        stripeDraggedStartX = stripeStartX[count];
      }
    }
    if (stripeLeftEdgeDraggedX != -1) {
      stripeStartX.splice(stripeLeftEdgeDraggedX, 1); stripeStartX.push(stripeDraggedStartX);
      stripeWidthX.splice(stripeLeftEdgeDraggedX, 1); stripeWidthX.push(stripeDraggedWidthX);
      stripeLeftEdgeDraggedX = stripeStartX.length - 1;
    }
    if (stripeRightEdgeDraggedX != -1) {
      stripeStartX.splice(stripeRightEdgeDraggedX, 1); stripeStartX.push(stripeDraggedStartX);
      stripeWidthX.splice(stripeRightEdgeDraggedX, 1); stripeWidthX.push(stripeDraggedWidthX);
      stripeRightEdgeDraggedX = stripeStartX.length - 1;
    }
  }
}

function mouseDragged()
{
  var mx = mouseX - x1;
  if (stripeDraggedX != -1) {
    var prevstripeStartX = stripeStartX[stripeDraggedX];
    stripeStartX[stripeDraggedX] = stripeDraggedStartX + (mx - dragStartX);
    if (stripeStartX[stripeDraggedX] < 0) stripeStartX[stripeDraggedX] = 0;
    if (stripeStartX[stripeDraggedX] >= repeatX - stripeWidthX[stripeDraggedX]) stripeStartX[stripeDraggedX] = repeatX - stripeWidthX[stripeDraggedX] - 1;
    if (prevstripeStartX != stripeStartX[stripeDraggedX]) drawPlaid();
  }

  if (stripeLeftEdgeDraggedX != -1) {
    var prevstripeWidthX = stripeWidthX[stripeLeftEdgeDraggedX];
    var prevstripeStartX = stripeStartX[stripeDraggedX];
    var delta = (mx - dragStartX > 0) ? // if making the stripe smaller
      min(mx - dragStartX, stripeDraggedWidthX) : // don't let it get smaller than 0
      max(mx - dragStartX, -stripeDraggedStartX); // else, don't let it go off the edge
    stripeWidthX[stripeLeftEdgeDraggedX] = stripeDraggedWidthX - delta;
    stripeStartX[stripeLeftEdgeDraggedX] = stripeDraggedStartX + delta;
    if (delta != 0) drawPlaid();
  }

  if (stripeRightEdgeDraggedX != -1) {
    var prevstripeWidthX = stripeWidthX[stripeRightEdgeDraggedX];
    var prevstripeStartX = stripeStartX[stripeRightEdgeDraggedX];
    var delta = (mx - dragStartX < 0) ? // if making the stripe smaller
      max(mx - dragStartX, -stripeDraggedWidthX) : // don't let it get smaller than 0
      min(mx - dragStartX, repeatX - stripeDraggedStartX - stripeDraggedWidthX);  // else, don't let it go off screen
    stripeWidthX[stripeRightEdgeDraggedX] = stripeDraggedWidthX + delta;
    if (delta != 0) drawPlaid();
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
  while (i < width) {
    for (stripe = 0; stripe < stripeNumX; stripe++) {
      i += stripeStartX[stripe];
      noStroke();
      fill(255);
      rectMode(CORNER);
      rect(i, y1, stripeWidthX[stripe], height);
      if (first) {
        translate(i, y1);

        stroke(0);
        fill(128);
        ellipseMode(CORNER);
        ellipse(stripeWidthX[stripe] / 2 - 6 - padding, -28 - 6 - padding, 2 * (6 + padding), 2 * (6 + padding));

        stroke(0);
        arrow(stripeWidthX[stripe] / 2 - 6, -28, stripeWidthX[stripe] / 2 + 6, -28, 4, 4);

        fill(128);
        ellipseMode(CENTER);
        ellipse(-3, -10, 2 * (4 + padding), 2 * (4 + padding));
        ellipse(stripeWidthX[stripe] + 3, -10, 2 * (4 + padding), 2 * (4 + padding));

        stroke(0);
        line(0, -7, 0, -13);
        line(0, -10, -6, -10);
        line(-6, -10, -6 + 3, -10 + 3);
        line(-6, -10, -6 + 3, -10 - 3);
        line(stripeWidthX[stripe], -7, stripeWidthX[stripe], -13);
        line(stripeWidthX[stripe], -10, stripeWidthX[stripe] + 6, -10);
        line(stripeWidthX[stripe] + 6, -10, stripeWidthX[stripe] + 6 - 3, -10 + 3);
        line(stripeWidthX[stripe] + 6, -10, stripeWidthX[stripe] + 6 - 3, -10 - 3);

        translate(-i, -y1);
      }
      i -= stripeStartX[stripe];
    }
    i += repeatX;
    first = false;
  }

  j = y1; first = true;
  while (j < height) {
    for (stripe = 0; stripe < stripeNumY; stripe++) {
      j += stripeStartY[stripe];
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
      j -= stripeStartY[stripe];
    }
    j += repeatY;
    first = false;
  }

  stroke(128);
  line(x1, y1, x1, y1 + repeatY);
  line(x1 + repeatX, y1, x1 + repeatX, y1 + repeatY);
  line(x1, y1, x1 + repeatX, y1);
  line(x1, y1 + repeatY, x1 + repeatX, y1 + repeatY);

  fill(128);
  noStroke();
  rectMode(CORNERS);
  rect(x1 + repeatX - 15 - 6, 15 - 6, x1 + repeatX - 15 + 6, 15 + 6);
  stroke(0);
  line(x1 + repeatX - 15 - 3, 15, x1 + repeatX - 15 + 3, 15);
  line(x1 + repeatX - 15, 15 - 3, x1 + repeatX - 15, 15 + 3);
}