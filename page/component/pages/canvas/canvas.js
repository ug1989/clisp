let _width; // 屏幕宽度
let ctx;    // 画布操作对象
let center; // 画布中心坐标
let _angle = 0; // 当前旋转角度
let curColor;   // 当前指针颜色
let speed = 7;  // 当前旋转速度
let catchMatchColor; // 是否匹配对应颜色标记
const strokeWidth = 12; // 绘图宽度
// const colors = ['red', 'blue', 'yellow', 'Moccasin', 'Aquamarine', 'BlueViolet', 'DarkSeaGreen']
const colors = ['red', 'blue', 'yellow', 'Moccasin'];

function draw(colors, _color, step) {
  if (!ctx) return;
  const colorNum = colors.length;
  const arcAngle = _angle / 360 * Math.PI            // 旋转弧度
  const needleLength = _width / 3.5                  // 指针长度
  const radius = center * 0.75;                      // 外圈半径
  const spaceAngle = 10 / 360;                       // 外圈间隔
  const stepAngle = (2 * Math.PI) / colorNum;   // 外圈分布弧长
  let startAngle = 0 - (stepAngle / 2);              // 起点x轴对称
  let index = 0;

  // 是否开始拦截
  let matchIndex = Math.floor((arcAngle + stepAngle / 2) / stepAngle) % colorNum
  matchIndex = (matchIndex + colorNum) % colorNum;
  if (catchMatchColor && colors[matchIndex] != curColor) {
    console.error('!!!!!');
    speed = 0;
  }
  catchMatchColor = colors[matchIndex] == curColor

  // 画外圈
  while (index < colorNum) {
    ctx.beginPath()
    ctx.setStrokeStyle(colors[index])
    ctx.arc(center, center, radius, startAngle + spaceAngle, startAngle + stepAngle - spaceAngle)
    startAngle += stepAngle;
    index += 1;
    ctx.stroke();
  }

  // 内部指针
  ctx.beginPath()
  ctx.setStrokeStyle(_color)
  ctx.moveTo(center, center)
  ctx.lineTo(center + Math.cos(arcAngle) * needleLength, center + Math.sin(arcAngle) * needleLength)
  ctx.stroke()
  ctx.draw()

  _angle = (_angle + (step * speed))                 // 更新旋转角度
}

function getNewColor(curColor) {
  const newColor = colors[Math.floor(Math.random() * colors.length)];
  if (curColor == newColor) {
    return getNewColor(curColor);
  }
  return newColor;
}

// 获取屏幕宽度
wx.getSystemInfo({
  success: function(res) {
    _width = res.screenWidth;
    center = Math.floor(_width / 2);
  },
})

// 定义页面内容
Page({
  data: {
    rStep: 1
  },
  start: function (e) {
    curColor = getNewColor(curColor);
    catchMatchColor = false;
    // speed = (speed - 1) % 17 || 16
    console.log(speed);
    this.setData({
      rStep: this.data.rStep * -1 // 改变旋转方向
    })
  },
  move: function (e) { },
  end: function (e) { },
  onLoad: function () {
    const _this = this;
    curColor = getNewColor(colors[0])
    ctx = wx.createCanvasContext('myCanvas')
    ctx.setLineWidth(strokeWidth)
    setInterval(function () {
      draw(colors, curColor, _this.data.rStep)
    }, 17);
  }
})
