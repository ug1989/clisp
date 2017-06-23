// 界面颜色及尺寸
let _width; // 屏幕宽度
let ctx;    // 画布操作对象
let center; // 画布中心坐标
const strokeWidth = 10; // 绘图宽度
const allColors =  "Tomato,Turquoise,SteelBlue,Gold,BlueViolet,CornflowerBlue,Crimson,DarkCyan,DarkMagenta,DeepPink,DodgerBlue,ForestGreen,DarkOrange,LightSalmon,LightSeaGreen,Chocolate,MediumSlateBlue,Orange,OrangeRed,OliveDrab,Purple,PaleVioletRed,RoyalBlue,Salmon,SeaGreen,SandyBrown,SlateBlue,YellowGreen".split(','); // 可供选择的所有颜色
let colors = []; // 当前实际展示的颜色
const bgColor = '#ffffff';
const radiusScale = 0.7;  // 圆形区域尺寸所占比例

// 动画相关变量
let drawAnimation; // 动画定时器
let _angle = 0; // 当前旋转角度
let curColor;   // 当前指针颜色
let speed = 0;  // 当前旋转速度
let catchMatchColor; // 是否开始记录错失区域
let levelUpLimit = 3; // 成功 n+1 次升级
let direction = 1; // 旋转方向 1 顺时针 -1 逆时针
const initSpeed = 7;
const drawTimeStop = 16.666;

// 游戏数据
const actionData = [];
let gameStartTime;
let gameEndTime;
let mockPlaying;
let canStartGame = true;

// 游戏动画
function draw() {
  if (!ctx) return;
  
  const colorNum = colors.length;
  const arcAngle = _angle / 360 * Math.PI            // 旋转弧度
  const radius = center * radiusScale;               // 外圈半径
  const needleLength = radius * 3 / 4;               // 指针长度
  const spaceAngle = 10 / 360;                       // 外圈间隔
  const stepAngle = (2 * Math.PI) / colorNum;        // 外圈分布弧长
  let startAngle = 0 - (stepAngle / 2);              // 起点x轴对称

  // 设置绘图宽度
  ctx.setLineWidth(strokeWidth)

  // 背景圈
  ctx.beginPath()
  ctx.setFillStyle(bgColor)
  ctx.arc(center, center, radius, 0, Math.PI * 2)
  ctx.fill();

  // 画外圈
  let index = 0;
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
  ctx.setStrokeStyle(curColor)
  ctx.moveTo(center, center)
  ctx.lineTo(center + Math.cos(arcAngle) * needleLength, center + Math.sin(arcAngle) * needleLength)
  ctx.stroke()
  ctx.draw()

  // 计算当前指针位置对应外圈颜色序号
  let matchIndex = (Math.floor((arcAngle + stepAngle / 2) / stepAngle) % colorNum + colorNum) % colorNum;

  // 错过匹配颜色范围，停止转动
  if (catchMatchColor && colors[matchIndex] != curColor) speed = 0;

  // 当旋转到同色区域，开始捕获
  catchMatchColor = colors[matchIndex] == curColor

  // 旋转角递增
  _angle = (_angle + (direction * speed))
  
  // 停止动画
  if (!speed) {
    actionData.push({
      _angle: _angle,
      stop: true
    });
    endGame();
  };
}

function getNewColor(curColor) {
  const newColor = colors[Math.floor(Math.random() * colors.length)];
  if (curColor == newColor) {
    return getNewColor(curColor);
  }
  return newColor;
}

function startGame() {
  gameStartTime = +new Date;
  drawAnimation = setInterval(draw, drawTimeStop);
}

function endGame() {
  if (gameStartTime) {
    console.log(+new Date - gameStartTime);
    gameStartTime = 0;
  }
  mockPlaying = false;
  clearInterval(drawAnimation)
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
    level: 1,
    tapTimes: 0
  },
  tap: function (e) {
    // 重现游戏中
    if (mockPlaying) return;
    // 点击开始游戏
    if (speed == 0 && canStartGame) {
      canStartGame = false
      return this.newGame()
    }
    // 点击在圆圈内有效
    // const touchPoint = e.touches[0];
    // const distance = Math.sqrt((center - touchPoint.x) * (center - touchPoint.x) + (center - touchPoint.y) * (center - touchPoint.y));
    // distance < center * radiusScale && this.reverse();
    this.reverse();
  },
  freeStart: function() {
    // 设置开始游戏准备,但不开始游戏
    canStartGame = true
    this.newGame()
    curColor = allColors[0]
    speed = 0
  },
  reverse: function() {
    if (!speed) return;

    // 非反转区域
    if (!catchMatchColor) return speed = 0;

    // 可以反向，重置部分变量
    catchMatchColor = false;
    curColor = getNewColor(curColor);

    // 达到升级次数设置升级，如果所有颜色都已经展示，无限计数点击次数
    if (this.data.tapTimes == levelUpLimit && this.data.level < allColors.length - 2) {
      this.data.level += 1;
      this.data.tapTimes = 0;
    } else {
      this.data.tapTimes += 1
    }

    // 升级增加外圈颜色，避免切换到同色
    if (this.data.tapTimes == 0) {
      const colorNum = this.data.level + 2;
      colors = allColors.slice(0, colorNum);
      const arcAngle = _angle / 360 * Math.PI
      const stepAngle = (2 * Math.PI) / colorNum;
      const matchIndex = ((Math.floor((arcAngle + stepAngle / 2) / stepAngle) % colorNum) + colorNum) % colorNum;
      curColor = getNewColor(colors[matchIndex]); // 排除指针在当前角度指向的新颜色
    }
    direction = direction * -1; // 改变旋转方向
    this.setData({
      tapTimes: this.data.tapTimes,
      level: this.data.level
    });
    // 记录游戏数据
    actionData.push({
      colors: JSON.parse(JSON.stringify(colors)),
      curColor: curColor,
      _angle: _angle
    });
  },
  newGame: function() {
    // 重置动画变量
    speed = initSpeed;
    _angle = 0;
    direction = 1;
    catchMatchColor = false;
    colors = allColors.slice(0, 3);
    curColor = getNewColor(colors[0]);
    mockPlaying = false;
    endGame();
    startGame();
    // 设置显示数据
    this.setData({
      tapTimes: 0,
      level: 1
    });
    // 记录游戏数据
    actionData.length = 0;
    actionData.push({
      colors: JSON.parse(JSON.stringify(colors)),
      curColor: curColor,
      _angle: _angle
    });
  },
  playShow() {
    const _this = this;
    if (actionData.length < 2) return;
    // 重置动画变量
    speed = initSpeed;
    _angle = 0;
    direction = 1;
    catchMatchColor = false;
    colors = actionData[0].colors;
    curColor = actionData[0].curColor;
    mockPlaying = true; // 阻止点击影响重现
    startGame();
    let mockIndex = 1;
    let mockPlay = setInterval(function () {
      const stopMock = actionData[mockIndex].stop;
      const matchAngle = _angle == actionData[mockIndex]._angle;
      // 模拟反转
      if (actionData[mockIndex] && matchAngle && !stopMock) {
        direction *= -1;
        catchMatchColor = false;
        colors = actionData[mockIndex].colors;
        curColor = actionData[mockIndex].curColor;
        mockIndex += 1;
      }
      // 模拟停止
      if (speed == 0 || matchAngle && stopMock) {
        speed = 0;
        clearInterval(mockPlay);
      }
    }, drawTimeStop);
    this.updateScore()
  },
  updateScore: function() {
    // 上传游戏得分
    const updateUrl = 'https://bala.so/wxapp/updateScore'
    const user = getApp().globalData.user
    user && wx.request({
      url: updateUrl,
      method: 'POST',
      data: {
        data: actionData,
        user: user
      }
    })
  },
  onLoad: function () {
    const _this = this
    const appInfo = getApp().globalData
    const shareTicket = appInfo.options.shareTicket
    // 获取进入wxapp标示,群聊的话获取群聊游戏排名
    shareTicket && wx.getShareInfo({
      shareTicket: shareTicket,
      success: function(res) {
        const uploadGroupUrl = 'https://bala.so/wxapp/saveGroupInfo'
        res.userId = appInfo.userId || appInfo.user._id
        wx.request({
          url: uploadGroupUrl,
          data: res,
          method: 'POST',
          success: function(res) {
            const openGId = res.data && res.data.openGId
            openGId && _this.setData({
              groupId: openGId
            })
          }
        })
      }
    })
    // 指定标记分享
    wx.showShareMenu && wx.showShareMenu({
      withShareTicket: true
    })
    // 初始化游戏数据
    ctx = wx.createCanvasContext('myCanvas')
    this.freeStart()
  },
  onShareAppMessage: function (res) {
    // 分享配置
    if (res.from === 'button') {
      console.log(res.target)
    }
    const user = getApp().globalData.user
    return {
      title: user.nickName + '邀你挑战《心灵手巧》',
			path: '/page/game/canvas?id=' + user._id,
      success: function (res) {
        const saveTicketUrl = 'https://bala.so/wxapp/saveShareTicket'
        const shareTicket = res.shareTickets[0]
        const user = getApp().globalData.user
        if (!shareTicket || !user) return
        wx.request({
          url: saveTicketUrl,
          method: 'POST',
          data: {
            userId: user._id,
            shareTicket: shareTicket
          },
          success: function(res) {
            // request ok
          }
        })
      },
      fail: function(res) { }
    }
  },
  onUnload: function() {
    ctx = null;
    endGame();
  },
  noop: function (e) { }
})
