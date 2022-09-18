const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

// const degToRad = (degrees) => {
//   return degrees / 180 * Math.PI;
// };

// const randomRange = (min, max) => {
//   return Math.random() * (max - min) + min;
// }

const sketch = ({ context, width, height }) => {

  const num = 40;
  const slice = math.degToRad(360 / num);
  const radius = width * 0.3;
  const cx = width  * 0.5;
  const cy = height * 0.5;
  
  const w = width  * 0.01;
  const h = height * 0.1;


  // initiate arcs
  const arcs = [];
  const rects = [];

  for (let i = 0; i < num; i++) {      
    const angle = slice * i;
    arcs.push(new Arc(angle, radius, slice));
    rects.push(new DigitRect(angle, radius, cx, cy, w, h))
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';

    for (let i = 0; i < num; i++) {      
     
      // clock part
      const digitRectI = rects[i];
      digitRectI.draw(context);
      
      // arcs part
      const arcI = arcs[i];
      arcI.draw(context,cx,cy);
      arcI.update();
    }
  };
};

canvasSketch(sketch, settings);


class DigitRect {
  constructor(angle, radius, cx, cy, w, h){
    this.x = cx + radius * Math.sin(angle);
    this.y = cy + radius * Math.cos(angle);
    this.angle = angle;
    this.rect_x = -w * 0.5;
    this.rect_y = random.range(0, -h * 0.5);
    this.w = w;
    this.h = h;
    this.scale_x = random.range(0.1, 2);
    this.scale_y = random.range(0.2,0.5);
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(-this.angle);
    context.scale(this.scale_x, this.scale_y);
      
    context.beginPath();
    context.rect(this.rect_x, this.rect_y, this.w, this.h);
    context.fill();
    context.restore();

  }
}

class Arc {
  constructor(angle, radius, slice){
    this.angle = angle;
    this.lineWidth = random.range(5,20);
    this.radius = radius * random.range(0.7, 1.3);
    this.angle_start = slice * random.range(1,-8);
    this.angle_end = slice * random.range(0, 5);
    this.circular_velocity = random.range(-0.0125, 0.0125); 
  }
  draw(context, cx, cy){
    // arcs part
    context.save();
    context.translate(cx,cy);
    context.rotate(-this.angle);
    
    context.lineWidth = this.lineWidth;
    context.beginPath();
    context.arc(0,0,this.radius, this.angle_start, this.angle_end);
    context.stroke();
    context.restore();
  }
  update(){
    this.angle_start += this.circular_velocity;
    this.angle_end += this.circular_velocity;
  }
}

