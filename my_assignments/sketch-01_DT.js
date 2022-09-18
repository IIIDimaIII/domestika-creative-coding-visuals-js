const canvasSketch = require('canvas-sketch');
const tweakpane = require('tweakpane');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate:true
};

const params = {
  cols:5,
  rows:5,
  background: {r:255, g:255, b:255},
  primary: '#1b1b1b',
  frame:0,
  n:-1,
  lineWidth:10.8,
}

const sketch = () => {
  return ({ context, width, height}) => {
    context.fillStyle =  'rgba(' + params.background.r + ', ' + params.background.g+ ', ' + params.background.b+ ')';
    context.fillRect(0, 0, width, height);
    context.lineWidth = params.lineWidth;
    context.strokeStyle = 'white';

    const w = width * 0.1 / params.cols * 5;
    const h = height * 0.1 / params.rows * 5;
    const gap = width * 0.03;
    const ix = width * 0.17;
    const iy = height * 0.17;

    const off = width * 0.02;

    let x, y;
 
    params.n = random.noise2D(params.cols, params.rows);

    for (let i = 0; i < params.cols; i++) {
        for (let j = 0; j < params.rows; j++) {
            x = ix + (w + gap) * i;
            y = iy + (h + gap) * j;

            context.beginPath();
            context.rect(x, y, w, h);
            context.strokeStyle = params.primary;
            context.stroke();
            
            n = random.noise2D(params.cols+i, params.rows+j)
            if (n > 0) {
                context.beginPath();
                context.rect(x + off / 2, y + off / 2,w - off, h-off );
                context.strokeStyle = params.primary;
                context.stroke();
            }
        }
    }


  };
};

const createPane = () => {
  const pane = new tweakpane.Pane();
  let folder;

  folder = pane.addFolder({title: 'Grid'});
  folder.addInput(params, 'background');
  folder.addInput(params, 'primary');
  folder.addInput(params, 'cols', {min:2, max:50, step:1});
  folder.addInput(params, 'rows', {min:2, max:50, step:1});
  folder.addInput(params, 'lineWidth', {min:1, max:15});
  // pane.on('change', (ev) => {
  //   console.log('changed: ' + ev);    
  // });
}


createPane();
canvasSketch(sketch, settings);
