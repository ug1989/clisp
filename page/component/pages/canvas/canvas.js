let _width;
let ctx;
let center;
let _angle = 0;
let curColor;
let speed = 1;
const strokeWidth = 16;
const colors = ['#88ff00', '#ff0088', '#0088ff', '#ff8800'];

function draw(colors, _color, step) {
  if (!ctx) return;

  _angle = (_angle + (step * speed))
  const needleLength = _width / 3.5
  const arcAngle = _angle / 360 * Math.PI
  const radius = center * 0.75;
  const spaceAngle = 10 / 360;
  const stepAngle = (2 * Math.PI) / colors.length;
  let startAngle = 0 - (stepAngle / 2);
  let index = 0;

  while (index < colors.length) {
    ctx.beginPath()
    ctx.setStrokeStyle(colors[index])
    ctx.arc(center, center, radius, startAngle + spaceAngle, startAngle + stepAngle - spaceAngle)
    startAngle += stepAngle;
    index += 1;
    ctx.stroke();
  }

  ctx.beginPath()
  ctx.setStrokeStyle(_color)
  ctx.moveTo(center, center)
  ctx.setLineWidth(strokeWidth)
  ctx.lineTo(center + Math.sin(arcAngle) * needleLength, center - Math.cos(arcAngle) * needleLength)
  ctx.stroke()
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
    speed = (speed + 1) % 5
    console.log(speed);
    this.setData({
      rStep: this.data.rStep * -1
    })
  },
  move: function (e) { },
  end: function (e) { },
  onLoad: function () {
    ctx = wx.createCanvasContext('myCanvas')
    ctx.setLineWidth(strokeWidth)
    curColor = colors[0]
    const _this = this;
    setInterval(function () {
      draw(colors, curColor, _this.data.rStep)
      ctx.draw()
    }, 17);
  }
})
