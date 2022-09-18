const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const tweakpane = require('tweakpane');

const settings = {
  dimensions: [1080, 1080]
};

// let text = 'A';
let fontSize = 800;
let fontFamily = 'serif';
const cell = 8;
let manager;
let img;

const params = {
  text: "A",
  glyphs_str: "_=/",
};

const imgCanvas = document.createElement('canvas');
const imgContext = imgCanvas.getContext('2d');

// const url = 'https://picsum.photos/200'
// const url = 'https://picsum.photos/id/121/1600/1067?grayscale'
// const url = 'https://en.wikipedia.org/wiki/Black_and_white#/media/File:Breadfruit.jpg'
const url ='https://picsum.photos/200/300?grayscale'

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
};


const sketch = ({ context, width, height }) => {
 

  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  img_width = img.width
  img_height = img.height
  imgCanvas.width = img_width;
  imgCanvas.height = img_height;
  imgContext.drawImage(img, 0, 0, img_width, img_height, 0,0, cols, rows);

  return ({ context, width, height }) => {
    
    const imgData = imgContext.getImageData(0, 0, cols, rows).data;
    context.getImageData(0,0,cols, rows)
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    // context.drawImage(imgCanvas, 0, 0);
  
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cell;
      const y = row * cell;

      const r = imgData[i * 4 + 0];
      const g = imgData[i * 4 + 1];
      const b = imgData[i * 4 + 2];
      const a = imgData[i * 4 + 3];


      context.fillStyle = 'white';
      
      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);
      context.beginPath();
      context.arc(0,0, r / 255 * cell / 2, 0,2*Math.PI);
      context.stroke();
      context.fill();
      context.restore();

    }

  };
};


const start = async () => {
  img = await loadImage(url);
  manager = await canvasSketch(sketch, settings);
  manager.render();
};



start();
