let _width;
let ctx;
let center;
let _angle = 0;
let curColor;
let speed = 1;
const strokeWidth = 16;
const colors = ['#88ff00', '#ff0088', '#0088ff', '#ff8800', '#00ff88'];

var t = 0;
function drawOuter(colors) {
  if (!ctx) return;

  const radius = center * 0.75;

  const spaceAngle = 10 / 360;
  const stepAngle = (2 * Math.PI) / colors.length;
  let startAngle = 0 - (stepAngle / 2);
  let index = 0;

  ctx.setLineWidth(strokeWidth);

  while (index < colors.length) {
    ctx.beginPath()
    ctx.setStrokeStyle(colors[index])

    ctx.arc(center, center, radius, startAngle + spaceAngle, startAngle + stepAngle - spaceAngle)
    startAngle += stepAngle; 
    index += 1;
    ctx.stroke();
  }
}

function drawInner(colors, _color, step) {
  if (!ctx) return;

  const rectWidth = _width / 3.5
  const stepAngle = 360 / colors.length;

  _angle = (_angle + (step * speed)) % 360
  
  ctx.translate(center, center)
  ctx.rotate(_angle * Math.PI / 180)
  ctx.setFillStyle(_color)
  ctx.fillRect(0, - (strokeWidth / 2), rectWidth, strokeWidth)
  ctx.rotate(-_angle * Math.PI / 180)
  ctx.translate(-center, -center)
    
  // if (_color != colors[Math.floor((_angle + stepAngle / 2) % 360 / stepAngle)]) {
  //   speed = 0
  // }
}

wx.getSystemInfo({
  success: function(res) {
    _width = res.screenWidth;
    center = Math.floor(_width / 2);
  },
})

Page({
  data: {
    rStep: 1
  },
  start: function (e) {
    curColor = colors[Math.floor(Math.random() * colors.length)]
    // speed = 1;
    this.setData({
      rStep: this.data.rStep * -1
    })
  },
  move: function (e) { },
  end: function (e) { },
  onLoad: function () {
    ctx = wx.createCanvasContext('myCanvas')
    curColor = colors[0]
    const _this = this;
    setInterval(function () {
      ctx.clearRect(0, 0, _width, _width);
      drawOuter(colors)
      drawInner(colors, curColor, _this.data.rStep)
      ctx.draw(true)
    }, 16);
  }
})