const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1000, 1000 ],
  encoding: 'image/jpeg',
//   encodingQuality: 0.75,
  animate: true,
};


let text = 'D';
let fontSize = 800;
let fontFamily = 'serif';
let grid_step = 25;

let gotBackgroundArray = false;
let circleRadius = 1;
let expansionVelocity = 0.03;





// basic element circle that grows until touches given boundry
class Agent {
  constructor(cx, cy, radius, expansion_velocity){
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.expansion_velocity = expansion_velocity;
    this.lineWidth = random.range(1,2);
  }
  draw(ctx){

    ctx.save();
    ctx.translate(this.cx,this.cy);
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.strokeStyle = 'white';// 'yellow';
    ctx.arc(0,0,this.radius, 0, 2*Math.PI);
    ctx.stroke();
    ctx.restore();
  }
  update(){
    this.radius = this.radius + this.expansion_velocity; 
    }
}

let backgroundArrayEdge, backgroundArrayFill;

const get_background_array_edge = (context, backgroundCtxEdge, width, height, draw_image) => {
  backgroundCtxEdge.fillStyle = 'white';
  backgroundCtxEdge.fillRect(0, 0, width, height);
  fontSize = width * 1.2;
  backgroundCtxEdge.fillStyle = 'black';
  backgroundCtxEdge.font = `${fontSize}px ${fontFamily}`;
  backgroundCtxEdge.textBaseline = 'top';
  
  const metrics = backgroundCtxEdge.measureText(text);
  const mx = metrics.actualBoundingBoxLeft * -1;
  const my = metrics.actualBoundingBoxAscent * -1;
  const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
  const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  const tx = (width - mw) * 0.5 - mx;
  const ty = (height - mh) * 0.5 - my;
  
  backgroundCtxEdge.save();
  backgroundCtxEdge.translate(tx, ty);
  backgroundCtxEdge.beginPath();
  backgroundCtxEdge.lineWidth = 3;
  backgroundCtxEdge.strokeText(text, 0, 0);
  backgroundCtxEdge.stroke();
  backgroundCtxEdge.restore();

  backgroundDataEdge = backgroundCtxEdge.getImageData(0, 0, width, height).data;
  
  if (draw_image) {  context.drawImage(backgroundCanvasEdge, 0, 0);}

  return backgroundDataEdge
}

const get_background_array_fill = (context, backgroundCtxFill, width, height, draw_image) => {
  backgroundCtxFill.fillStyle = 'white';
  backgroundCtxFill.fillRect(0, 0, width, height);
  fontSize = width * 1.2;
  backgroundCtxFill.fillStyle = 'black';
  backgroundCtxFill.font = `${fontSize}px ${fontFamily}`;
  backgroundCtxFill.textBaseline = 'top';
  
  const metrics = backgroundCtxFill.measureText(text);
  const mx = metrics.actualBoundingBoxLeft * -1;
  const my = metrics.actualBoundingBoxAscent * -1;
  const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
  const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  const tx = (width - mw) * 0.5 - mx;
  const ty = (height - mh) * 0.5 - my;
  
  
  backgroundData = backgroundCtxFill.getImageData(0, 0, width, height).data;
  
  backgroundCtxFill.save();
  backgroundCtxFill.fillStyle = 'black';

  backgroundCtxFill.translate(tx, ty);
  backgroundCtxFill.beginPath();
  backgroundCtxFill.lineWidth = 10;
  backgroundCtxFill.fillText(text, 0, 0);
  backgroundCtxFill.stroke();
  backgroundCtxFill.restore();
 

  backgroundDataFilled = backgroundCtxFill.getImageData(0, 0, width, height).data;
  if (draw_image) {  context.drawImage(backgroundCanvasFill, 0, 0);}

  return backgroundDataFilled
}
 

const touch_detected = async (agent, background_array) => {

  for (let dx=-Math.round(agent.radius,0); dx<Math.round(agent.radius,0)+1; dx++){
    for (let dy=-Math.round(agent.radius,0); dy<Math.round(agent.radius,0)+1; dy++){
      x = agent.cx + dx;
      y = agent.cy + dy;
      idx = (y * settings.dimensions[0] + x) * 4;
      if (background_array[idx] < 250) { return 1 };      
    }
  }
  return 0
}


const backgroundCanvasEdge = document.createElement('canvas');
const backgroundContextEdge = backgroundCanvasEdge.getContext('2d');

const backgroundCanvasFill = document.createElement('canvas');
const backgroundContextFill = backgroundCanvasFill.getContext('2d');


let agentsPlaced = false;
let agents = [];


const checkDetectionUpdate = async (agents, backgroundArray, context) => {
  for (const agent of agents) {
    agent.draw(context);
    let x = await touch_detected(agent, backgroundArray);
    if (!x) { agent.update(); }
  }
}


const place_agents = (agents, context, backgroundArrayFill) => {
  
  for (let x=0; x<settings.dimensions[0]; x += grid_step){
    for (let y=0; y<settings.dimensions[1]; y += grid_step){
      xi = Math.round(x + random.range(-grid_step/3, grid_step/3),0);
      yi = Math.round(y + random.range(-grid_step/3, grid_step/3),0);
      idx = (yi * settings.dimensions[0] + xi) * 4;
      if (backgroundArrayFill[idx] < 128) {
         agents.push(new Agent(xi,yi,circleRadius,expansionVelocity)); 
      };
    }
  }
}

const sketch = async (context, width, height, frame) => {

  backgroundCanvasEdge.width = settings.dimensions[0];
  backgroundCanvasEdge.height = settings.dimensions[1];

  backgroundCanvasFill.width = settings.dimensions[0];
  backgroundCanvasFill.height = settings.dimensions[1];



  return async ({ context, width, height, frame }) => {
    context.fillStyle = 'black'; // 'blue';
    context.fillRect(0, 0, width, height);

    if (!gotBackgroundArray) {
    // redo as filled text only
    backgroundArrayFill = await get_background_array_fill(context, backgroundContextFill, width, height, 0);
    
    // redo as edge only
    backgroundArrayEdge = await get_background_array_edge(context, backgroundContextEdge, width, height, 1);
    gotBackgroundArray = true;
    
    }
    if (!agentsPlaced) {
        place_agents(agents, context, backgroundArrayFill);
        agentsPlaced = true;
    }
    checkDetectionUpdate(agents, backgroundArrayEdge, context);
    };
  };


canvasSketch(sketch, settings);

