// Get canvas elements
const leftCanvas = document.getElementById('left-canvas');
const rightCanvas = document.getElementById('right-canvas');
const resetButton = document.getElementById('reset-button');

// Set the canvas resolution
leftCanvas.width = 50;
leftCanvas.height = 50;


// Get canvas contexts
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');


// Set default color
leftCtx.fillStyle = '#000'; // Black
leftCtx.fillRect(0, 0, leftCanvas.width, leftCanvas.height);

// Initialize painting variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Set drawing color
leftCtx.strokeStyle = '#fff'; // White

// Set the middle 1 pixel to white
leftCtx.fillStyle = '#fff'; // White
leftCtx.fillRect(leftCanvas.width / 2, leftCanvas.height / 2, 1, 1);

leftCtx.lineWidth = 2; // Set the line width to 5 pixels
leftCtx.lineHeight = 2; // Set the line width to 5 pixels
leftCtx.strokeStyle = 'white'
// Event listeners for painting on the left canvas
leftCanvas.addEventListener('mousedown', startDrawing);
leftCanvas.addEventListener('mousemove', draw);
leftCanvas.addEventListener('mouseup', stopDrawing);
leftCanvas.addEventListener('mouseout', stopDrawing);

// Event listener for reset button
resetButton.addEventListener('click', resetCanvas);

// Painting functions
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    const [currentX, currentY] = [e.offsetX, e.offsetY];

      // Perform line smoothing
    const points = getPointsOnLine(lastX, lastY, currentX, currentY);
    for (let i = 1; i < points.length; i++) {
        const { x, y } = points[i];
        const { x: prevX, y: prevY } = points[i - 1];

        // Draw on the left canvas
        leftCtx.beginPath();
        leftCtx.moveTo(prevX, prevY);
        leftCtx.lineTo(x, y);
        leftCtx.stroke();
    }


    // Update the last position
    [lastX, lastY] = [currentX, currentY];
}

function getPointsOnLine(x1, y1, x2, y2) {
    const points = [];
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
  
    while (true) {
      points.push({ x: x1, y: y1 });
  
      if (x1 === x2 && y1 === y2) break;
  
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
  
    return points;
  }
  
function stopDrawing() {
    isDrawing = false;
    updateRightCanvas();
}

function getLeftCanvasMatrix() {
    const imageData = leftCtx.getImageData(0, 0, leftCanvas.width, leftCanvas.height);
    const data = imageData.data;
    const matrix = [];

    for (let y = 0; y < leftCanvas.height; y++) {
        const row = [];

        for (let x = 0; x < leftCanvas.width; x++) {
            const pixelIndex = (y * leftCanvas.width + x) * 4;
            const [red, green, blue, alpha] = [
                data[pixelIndex],
                data[pixelIndex + 1],
                data[pixelIndex + 2],
                data[pixelIndex + 3]
            ];

            // Store the pixel values in the row
            row.push([red, green, blue, alpha]);
        }

        // Store the row in the matrix
        matrix.push(row);
    }

    return matrix;
}

function updateRightCanvas() {


    fourier = pyscript.interpreter.globals.get('perform_2d_fourier_transform');
    fourier_result = fourier(getLeftCanvasMatrix());

    // Create an image element
    const image = new Image();

    // Set the source of the image to the canvas image data
    image.src = fourier_result;

    // When the image has loaded, draw it on the right canvas
    image.onload = () => {
        // Clear the right canvas
        rightCtx.clearRect(0, 0, rightCanvas.width, rightCanvas.height);

        // Draw the image on the right canvas
        rightCtx.drawImage(image, 0, 0);
    };
}

function resetCanvas() {

    leftCtx.fillStyle = '#000'; // Black
    leftCtx.fillRect(0, 0, leftCanvas.width, leftCanvas.height);

    // Initialize painting variables
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Set drawing color
    leftCtx.strokeStyle = '#fff'; // White

    // Set the middle 1 pixel to white
    leftCtx.fillStyle = '#fff'; // White
    leftCtx.fillRect(leftCanvas.width / 2, leftCanvas.height / 2, 1, 1);
  }