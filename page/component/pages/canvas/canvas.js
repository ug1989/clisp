// 画图
let _width; // 屏幕宽度
let ctx;    // 画布操作对象
let center; // 画布中心坐标
const strokeWidth = 10; // 绘图宽度
const allColors = "Tomato,Turquoise,SteelBlue,Yellow,Aqua,Bisque,BlueViolet,Brown,CadetBlue,Chartreuse,Chocolate,CornflowerBlue,Crimson,Cyan,DarkCyan,DarkGoldenRod,DarkGreen,DarkMagenta,DarkOliveGreen,DarkOrange,DeepPink,DodgerBlue,ForestGreen,Gold,GoldenRod,GreenYellow,LightSalmon,LightSeaGreen,MediumSeaGreen,MediumSpringGreen,MediumSlateBlue,NavajoWhite,Orange,OrangeRed,OliveDrab,PaleGreen,Peru,Purple,PaleVioletRed,RoyalBlue,Salmon,SeaGreen,SandyBrown,SlateBlue,YellowGreen".split(','); // 可供选择的所有颜色
// allColors.length = 5;
let colors = []; // 当前实际展示的颜色
const bgColor = '#ffffff';
const sizeScale = 0.7;

// 动画
let _angle = 0; // 当前旋转角度
let curColor;   // 当前指针颜色
let speed = 8;  // 当前旋转速度
let catchMatchColor; // 是否开始记录错失区域
let levelUpLimit = 3; // 成功 n+1 次升级

// 游戏动画
function draw(colors, matchColor, direction) {
  if (!ctx) return;
  ctx.setLineWidth(strokeWidth)
  const colorNum = colors.length;
  const arcAngle = _angle / 360 * Math.PI            // 旋转弧度
  const radius = center * sizeScale;                 // 外圈半径
  const needleLength = radius * 3 / 4;                    // 指针长度
  const spaceAngle = 10 / 360;                       // 外圈间隔
  const stepAngle = (2 * Math.PI) / colorNum;        // 外圈分布弧长
  let startAngle = 0 - (stepAngle / 2);              // 起点x轴对称
  let index = 0;

  // 背景圈
  ctx.beginPath()
  ctx.setFillStyle(bgColor)
  ctx.arc(center, center, radius, 0, Math.PI * 2)
  ctx.fill();

  // 画外圈
  while (index < colorNum) {
    ctx.beginPath()
    ctx.setStrokeStyle(colors[index])
    ctx.arc(center, center, radius * 6 / 7, startAngle + spaceAngle, startAngle + stepAngle - spaceAngle)
    startAngle += stepAngle;
    index += 1;
    ctx.stroke();
  }

  // 内部指针
  ctx.beginPath()
  ctx.setStrokeStyle(matchColor)
  ctx.moveTo(center, center)
  ctx.lineTo(center + Math.cos(arcAngle) * needleLength, center + Math.sin(arcAngle) * needleLength)
  ctx.stroke()
  ctx.draw()

  // 计算当前位置对应外圈位置
  let matchIndex = Math.floor((arcAngle + stepAngle / 2) / stepAngle) % colorNum
  matchIndex = (matchIndex + colorNum) % colorNum;

  // 错过匹配颜色范围，停止
  if (catchMatchColor && colors[matchIndex] != curColor) {
    speed = 0
  }

  // 当旋转到同色区域，开始捕获
  catchMatchColor = colors[matchIndex] == curColor

  // 旋转角递增
  _angle = (_angle + (direction * speed))                 // 更新旋转角度
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
    direction: 1,
    level: 1,
    tapTimes: 0
  },
  start: function (e) {
    if (!speed) return;
    if (!catchMatchColor) {
      speed = 0;
      return;
    }
    curColor = getNewColor(curColor);
    catchMatchColor = false;
    // speed = (speed - 1) % 17 || 16
    if (this.data.tapTimes == levelUpLimit && this.data.level < allColors.length - 2) {
      this.data.level += 1;
      this.data.tapTimes = 0;
      // 避免切换到同色
      const colorNum = this.data.level + 2;
      const arcAngle = _angle / 360 * Math.PI
      const stepAngle = (2 * Math.PI) / colorNum;
      colors = allColors.slice(0, colorNum);
      const matchIndex = ((Math.floor((arcAngle + stepAngle / 2) / stepAngle) % colorNum) + colorNum) % colorNum;
      curColor = getNewColor(colors[matchIndex]);
      // console.log(colors[matchIndex], curColor);
    } else {
      this.data.tapTimes += 1
    }
    this.setData({
      direction: this.data.direction * -1, // 改变旋转方向
      tapTimes: this.data.tapTimes,
      level: this.data.level
    })
  },
  move: function (e) { },
  end: function (e) { },
  reset: function() {
    _angle = 0
    speed = 6
    catchMatchColor = false
    colors = allColors.slice(0, 3)
    curColor = getNewColor(colors[0])
    this.setData({
      direction: 1,
      tapTimes: 0,
      level: 1
    })
  },
  onLoad: function () {
    const _this = this;
    ctx = wx.createCanvasContext('myCanvas')
    this.reset()
    this.runDraw = setInterval(function () {
      draw(colors, curColor, _this.data.direction)
    }, 17);
  },
  onUnload: function() {
    ctx = null;
    clearInterval(this.runDraw);
  }
})
