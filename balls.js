function SvgElement(str,obj) {
  let output=document.createElementNS("http://www.w3.org/2000/svg",str);
  for(prop in obj) {
    output.setAttribute(prop, obj[prop]);
  }
  return output;
}
function svgChgProp(target,obj) {
  for(prop in obj) {
    target.setAttribute(prop, obj[prop]);
  }
}    
function calcDirection(dx,dy) {
  if(dx==0&&dy==0) {
    return 0;
  }
  if(dx>=0&&dy>=0) {
    return Math.PI-Math.atan(Math.abs(dx/dy));
  }
  if(dx>=0&&dy<0) {
    return Math.atan(Math.abs(dx/dy));
  }
  if(dx<0&&dy<0) {
    return 2*Math.PI-Math.atan(Math.abs(dx/dy));
  }
  if(dx<0&&dy>=0) {
    return Math.PI+Math.atan(Math.abs(dx/dy));
  }
}     
function Surface() {
  this.g=0.1;
  this.ball=[];
  this.svg=new SvgElement("svg",{
    width: innerWidth ,
    height: innerHeight
  })
  document.body.appendChild(this.svg);
  this.svg.style.position="absolute"
  this.svg.style.left=0;
  this.svg.style.top=0;
  this.rect1=new SvgElement("rect",{
    x: 0,
    y: innerHeight-15,
    width: innerWidth,
    height: 10,
    fill: "black"
  }) 
  this.svg.appendChild(this.rect1);
    this.rect2=new SvgElement("rect",{
    x: 0,
    y: 15,
    width: 10,
    height: innerHeight-25,
    fill: "black"
  }) 
  this.svg.appendChild(this.rect2);
    this.rect3=new SvgElement("rect",{
    x: innerWidth-10,
    y: 15,
    width: 10,
    height: innerHeight-25,
    fill: "black"
  }) 
  this.svg.appendChild(this.rect3);
  this.handleEvent=function() {
    switch(event.type) {
      case "click":
        if(event.target!="[object SVGCircleElement]") {
          let x=event.clientX;
          let y=event.clientY;
          this.ball.push(new Ball(x,y));
          this.svg.appendChild(this.ball[this.ball.length-1].circle);
        }
      break;
    }
  }
  this.svg.addEventListener("click",this);
  this.start=function() {
    this.t1=setInterval(this.running.bind(this),20);
  }
  this.running=function() {
    for(let ball of this.ball) {
      ball.move(this.g,this.ball);  
    }
  }
}
function Ball(x,y) {
  this.falling=true;
  this.stop=false;
  this.x=x;
  this.y=y;
  this.vy=0;
  this.vx=0;
  this.v=0;
  this.r=15;
  this.circle=new SvgElement("circle",{
    cx: x,
    cy: y,
    r: this.r,
    fill: color[Math.floor(Math.random()*5)]
  });
  this.move=function(g,balls) {
    for(let ball of balls) {
      if(this !== ball) {
        if(((this.x - ball.x) ** 2 + (this.y - ball.y) ** 2) ** 0.5 <= this.r * 2) {
          this.collide(ball);
        }
        if(((this.x-ball.x)**2+(this.y-ball.y)**2)**0.5<= this.r + ball.r - 3) {
          this.x += (3 * Math.sin(calcDirection(this.x - ball.x, ball.y - this.y))) / 2;
          this.y += (3 * Math.cos(calcDirection(this.x - ball.x, ball.y - this.y))) / 2;
          ball.x += (3 * Math.sin(calcDirection(ball.x - this.x, ball.y - this.y))) / 2;
          ball.y += (3 *  Math.cos(calcDirection(ball.x - this.x, ball.y - this.y))) / 2;
        }
      }
    }    
    this.vy += g;;
    this.y += this.vy;
    this.x += this.vx;
    this.v = (this.vy ** 2 + this.vx ** 2) ** 0.5;
    this.contactBorder();
    svgChgProp(this.circle,{
      cx: this.x,
      cy: this.y
    })
  }
  this.handleEvent=function() {
    switch(event.type) {
      case "touchstart":
        this.vy=-5;
      break;
    }
  }
  this.circle.addEventListener("touchstart",this);
  this.collide = function(ball) {
    this.vx = this.v * Math.sin(calcDirection(this.x - ball.x, ball.y - this.y)) * 0.5;
    this.vy = this.v * Math.cos(calcDirection(this.x - ball.x, ball.y - this.y)) * 0.5;    
    ball.vx = ball.v * Math.sin(calcDirection(ball.x - this.x, this.y - ball.y)) * 0.5;
    ball.vy = ball.v * Math.cos(calcDirection(ball.x - this.x, this.y - ball.y)) * 0.5;         
               
  }
  this.contact = function() {
      
  }
  this.contactBorder = function() {
    this.x <= 10 + this.r - 1 ? this.x = this.r + 10 : null;
    this.x >= innerWidth - (this.r + 9) ? this.x = innerWidth - (this.r + 10) : null;  
    if(this.x <= this.r + 10 || this.x >= innerWidth - (this.r + 10)) {
      this.vx *= -1; 
    }
    this.y > innerHeight - (this.r + 15 - 0.02) ? this.y = innerHeight - (this.r + 15 - 0.01) : null;
    if(this.y > innerHeight - (this.r + 15)) {
      this.vy *= -0.9;
    }     
  }
}
const color=["red","blue","orange","green","purple"];