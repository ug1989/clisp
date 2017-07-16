// 界面颜色及尺寸
let _width; // 屏幕宽度
let _height; // 屏幕宽度
let ctx;    // 画布操作对象
let center; // 画布中心坐标
let offsetTop;
const strokeWidth = 10; // 绘图宽度
const allColors = "Tomato,Turquoise,SteelBlue,Gold,BlueViolet,Orange,ForestGreen,CornflowerBlue,DeepPink,YellowGreen,Crimson,DodgerBlue,DarkMagenta,LightSeaGreen,Chocolate".split(','); // 可供选择的所有颜色
let colors = []; // 当前实际展示的颜色
const bgColor = '#ffffff';
const radiusScale = 0.7;  // 圆形区域尺寸所占比例

// 动画相关变量
let drawAnimation; // 动画定时器
let _gameLevel;
let _gameTap;
let _angle = 0; // 当前旋转角度
let curColor;   // 当前指针颜色
let speed = 0;  // 当前旋转速度
let catchMatchColor; // 是否开始记录错失区域
let levelUpLimit = 3; // 成功 n+1 次升级
let direction = 1; // 旋转方向 1 顺时针 -1 逆时针
const initSpeed = 6;
const drawTimeStop = 16.666;

// 游戏数据
const actionData = [];
let gameStartTime;
let gameEndTime;
let mockPlaying;
let endGameAction;
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
  ctx.arc(center, center + offsetTop, radius, 0, Math.PI * 2)
  ctx.fill();

  // 显示分数
  ctx.setFillStyle('#0a8888')
  ctx.setFontSize(15)
  ctx.setTextAlign('center')
  ctx.fillText(actionData.length + '', 20, 28)

  // 画外圈
  let index = 0;
  while (index < colorNum) {
    ctx.beginPath()
    ctx.setStrokeStyle(colors[index])
    ctx.arc(center, center + offsetTop, radius * 6 / 7, startAngle + spaceAngle, startAngle + stepAngle - spaceAngle)
    startAngle += stepAngle;

		// ctx.setFillStyle(colors[index])
    // ctx.fillRect(index * _width / colors.length, 0, _width / colors.length, 2 * strokeWidth)

    index += 1;
    ctx.stroke();
  }

  // 内部指针
  ctx.beginPath()
  ctx.setStrokeStyle(curColor)
  ctx.moveTo(center, center + offsetTop)
  ctx.lineTo(center + Math.cos(arcAngle) * needleLength, center + offsetTop + Math.sin(arcAngle) * needleLength)
  ctx.stroke()

  // 文字提示
  if (canStartGame) {
    ctx.setFillStyle(curColor)
    ctx.setFontSize(15)
    ctx.setTextAlign('center')
    ctx.fillText('Touch to start..', center, center - offsetTop * 1)
  }
  ctx.setFillStyle('#ffffff')
  ctx.setFontSize(15)
  ctx.setTextAlign('center')
  let infoText = mockPlaying ? '游戏画面重放' : '指针进入同色弧形区域时点击'
  ctx.fillText(infoText, center, 2 * center + offsetTop * 1.8)

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
    gameEndTime && actionData.push({
      _angle: _angle,
      stop: true
    })
    if (_angle) {
      let gameOverTextColor = getNewColor(curColor)
      ctx.setFillStyle(gameOverTextColor)
      ctx.setFontSize(15)
      ctx.setTextAlign('center')
      ctx.setShadow(0, 0, 3, '#ffffff')
      ctx.fillText('Oops, game over..', center, center - offsetTop * 2)
      ctx.fillText('Touch to restart..', center, center - offsetTop * 3.3)
    }
    endGame();
  }

  // 绘图  
  ctx.draw()
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
    !mockPlaying && endGameAction && endGameAction(+new Date - gameStartTime);
    gameStartTime = 0;
  }
  mockPlaying = false;
  actionData.length = 0;
  gameEndTime = +new Date;
  clearInterval(drawAnimation);
}

// 获取屏幕宽度
wx.getSystemInfo({
  success: (res) => {
    _width = res.screenWidth;
    _height = res.windowHeight;
    center = Math.floor(_width / 2);
    offsetTop = -0.04 * _width;
  },
});

const mockListScore = [
  {
    user: {
      nickName: '曹帅', avatarUrl: 'http://p1.music.126.net/PRSSBKKHVXqg9dEonAnwoQ==/109951162954605499.jpg?param=140y140', country: 'CN', province: 'Shanghai', city: 'Pudong', _id: 1
    },
    level: Math.floor(26 / (levelUpLimit + 1)),
    score: 26
  },
  {
    user: {
      nickName: '没撒的撒', avatarUrl: 'http://p1.music.126.net/lbJCfzq6Jm60K6kzP_LtlQ==/18953381439796470.jpg?param=140y140', country: 'CN', province: 'Jiangsu', city: 'Nanjing', _id: 2
    },
    level: Math.floor(22 / (levelUpLimit + 1)),
    score: 22
  },
  {
    user: {
      nickName: 'micks', avatarUrl: 'http://p1.music.126.net/LOEH8DU92vx2GJc0tX1xsA==/109951162971666277.jpg?param=140y140', country: 'CN', province: 'Hebei', city: 'Wuhan', _id: 3
    },
    level: Math.floor(20 / (levelUpLimit + 1)),
    score: 20
  },
  {
    user: {
      nickName: 'sadsaCC', avatarUrl: 'http://p1.music.126.net/ZM7Vn0K04_jtbpzwm05jGw==/19228259346767883.jpg?param=140y140', country: 'CN', province: 'Ningxia', city: 'Guyuan', _id: 4
    },
    level: Math.floor(19 / (levelUpLimit + 1)),
    score: 19
  }
]

// 定义页面内容
Page({
  data: {
    level: 1,
    tapTimes: 0,
    hideShare: true,
    allColors: allColors,
    listScore: [] || mockListScore,
    scrollHeight: _height - _width,
    coverView: wx.canIUse('cover-view')
  },
  tap (e) {
    // 重现游戏中
    if (mockPlaying) return;
    // 点击开始游戏
    if (speed == 0 && canStartGame) {
      canStartGame = false
      return this.newGame()
    }
    // 准备重新开始
    if (speed == 0 && !canStartGame && +new Date - gameEndTime > 1000) {
      this.freeStart();
    }
    // 点击在圆圈内有效
    // const touchPoint = e.touches[0];
    // const distance = Math.sqrt((center - touchPoint.x) * (center - touchPoint.x) + (center - touchPoint.y) * (center - touchPoint.y));
    // distance < center * radiusScale && this.reverse();
    this.reverse();
  },
  freeStart () {
    // 设置开始游戏准备,但不开始游戏
    canStartGame = true
    this.newGame()
    curColor = allColors[0]
    speed = 0
  },
  reverse () {
    if (!speed) return;

    // 非反转区域
		if (!catchMatchColor) {
				this.updateScore();
				speed = 0;
				return
		}

    // 可以反向，重置部分变量
    catchMatchColor = false;
    curColor = getNewColor(curColor);

    // 达到升级次数设置升级，如果所有颜色都已经展示，无限计数点击次数
    if (this.data.tapTimes == levelUpLimit && this.data.level < allColors.length - 2) {
      _gameLevel = this.data.level += 1;
      _gameTap = this.data.tapTimes = 0;
    } else {
      _gameTap = this.data.tapTimes += 1
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

    // 记录游戏数据
    actionData.push({
      colors: JSON.parse(JSON.stringify(colors)),
      curColor: curColor,
      _angle: _angle
    });
  },
  newGame () {
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
    _gameLevel = 1;
    _gameTap = 0;
    this.data.tapTimes = 0;
    this.data.level = 1;
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
    const bestScoreStr = wx.getStorageSync('bestScore');
    const _actionData = bestScoreStr && JSON.parse(bestScoreStr) || [];
    actionData.length = 0;
    _actionData.map(_ => actionData.push(_));
    if (actionData.length < 2 || speed) return;
    // 重置动画变量
    speed = initSpeed;
    _angle = 0;
    direction = 1;
    catchMatchColor = false;
    colors = actionData[0].colors;
    curColor = actionData[0].curColor;
    mockPlaying = true; // 阻止点击影响重现
    clearInterval(mockPlay);
    startGame();
    _gameLevel = 1;
    _gameTap = 0;
    let mockIndex = 1;
    let mockPlay = setInterval(() => {
      if (!actionData[mockIndex]) {
        clearInterval(mockPlay);
        return
      }
      const stopMock = actionData[mockIndex].stop;
      const matchAngle = _angle == actionData[mockIndex]._angle;
      // 模拟反转
      if (actionData[mockIndex] && matchAngle && !stopMock) {
        direction *= -1;
        catchMatchColor = false;
        colors = actionData[mockIndex].colors;
        curColor = actionData[mockIndex].curColor;
        _gameLevel = Math.floor(mockIndex / (levelUpLimit + 1)) + 1;
        _gameTap = mockIndex % (levelUpLimit + 1);
        mockIndex += 1;
      }
      // 模拟停止
      if (speed == 0 || matchAngle && stopMock) {
        speed = 0;
				endGame();
        clearInterval(mockPlay);
      }
    }, drawTimeStop);
  },
  updateScore (timeTake) {
    const lastScore = wx.getStorageSync('score')
    const appInfo = getApp().globalData
    this.setData({ hideShare: actionData.length < 5 });
    if (actionData.length < Math.max(lastScore, 5)) {
      _angle && appInfo.openGId && this.getGroupScore(appInfo.openGId);
      return;
    }
    // 记录最新成绩
    wx.setStorageSync('score', actionData.length)
    // 上传游戏得分
    const updateUrl = 'https://bala.so/wxapp/updateScore'
    const user = appInfo.user
    user && wx.request({
      url: updateUrl,
      method: 'POST',
      data: {
        data: actionData,
        user: user
      },
      success: (res) => {
        wx.setStorage({
          key: 'bestScore',
          data: JSON.stringify(res.data.data),
        })
        appInfo.bestScore = res.data.data
      },
      complete: () => {
        const appInfo = getApp().globalData
        appInfo.openGId && this.getGroupScore(appInfo.openGId)
        !appInfo.openGId && this.data.shareUserId && this.getShareInfo(this.data.shareUserId)
      }
    });
    user && wx.showToast({
      title: 'New Record !!',
      duration: 2000
    });
    user && !this.data.shareUserId && this.setData({
      listScore: [this.getCurUserScore()]
    });
    !user && wx.showToast({
      title: "　　获取认证信息失败，删除小程序后重新打开可进行授权。　",
      duration: 5000,
      image: '../../image/fe.png',
      mask: true
    });
  },
  getCurUserScore() {
    const appInfo = getApp().globalData
    const lastScore = wx.getStorageSync('score')
    const mockUserScore = {
      user: appInfo.user,
      level: lastScore && (2 + Math.floor((lastScore - 2) / (levelUpLimit + 1))),
      score: lastScore
    }
    return appInfo.user ? mockUserScore : null
  },
  onLoad(option) {
    const appInfo = getApp().globalData
    const shareUserId = option && option.id
    this.data.shareUserId = shareUserId
    this.data.openGId = appInfo.openGId
    shareUserId ? this.getShareInfo(shareUserId) : appInfo.user && this.setData({
      listScore: [this.getCurUserScore()]
    })
    // bind updateScore when endGame
    endGameAction = this.updateScore && this.updateScore.bind(this)
    // openGId 直接获取，不然等到获取信息后在获取
    appInfo.openGId
      ? this.getGroupScore(appInfo.openGId)
      : appInfo.getInfoWithGId = this.getGroupScore.bind(this)
    // 指定标记分享
    wx.showShareMenu && wx.showShareMenu({
      withShareTicket: true
    })
    // 初始化游戏数据
    ctx = wx.createCanvasContext('myCanvas')
    this.freeStart()
  },
  // 根据shareUserID获取分享人的分数
  getShareInfo(id) {
    const reqUrl = 'https://bala.so/wxapp/getScoreByUser?userId=' + id
    wx.request({
      url: reqUrl,
      success: (res) => {
        const _this = this;
        let _endGameAction = endGameAction
        if (!res.data) return;
        if (gameStartTime) {
          // 防止游戏过程中渲染页面，导致卡顿
          endGameAction = () => {
            _endGameAction && _endGameAction();
            showShareScore();
            endGameAction = _endGameAction;
          }
        } else {
          showShareScore();
        }

        function showShareScore() {
          const curUserScore = _this.getCurUserScore()
          const diffUser = curUserScore && curUserScore.user._id != res.data.user._id
          res.data.user && (res.data.level = 2 + Math.floor((res.data.score - 2) / (levelUpLimit + 1)))
          const listScores = [res.data];
          diffUser && listScores.push(curUserScore);
          listScores.map(_ => {
            _.user && (_.level = 2 + Math.floor((_.score - 2) / (levelUpLimit + 1)))
          });
          listScores.sort((b, a) => {
            return a.score - b.score > 0 ? 1 : -1
          });
          !_this.data.openGId && _this.setData({
            listScore: listScores
          });
        }
      }
    })
  },
  // 根据openId获取群聊游戏成绩
  getGroupScore (groupId) {
    const lastReqTime = this.getGroupScore.lastReqTime;
    if (+new Date - lastReqTime < 15 * 1000) return;
    this.getGroupScore.lastReqTime = +new Date;
    const reqUrl = 'https://bala.so/wxapp/getScoreByGroup?groupId=' + groupId
    wx.request({
      url: reqUrl,
      success: (res) => {
        if (!res.data || !res.data.length) return;
        const _this = this;
        let _endGameAction = endGameAction
        if (gameStartTime) {
          // 防止游戏过程中渲染页面，导致卡顿
          endGameAction = () => {
            _endGameAction && _endGameAction();
            showGroupScores();
            endGameAction = _endGameAction;
          }
        } else {
          showGroupScores();
        }

        function showGroupScores() {
          const sortList = res.data.sort((b, a) => {
            return a.score - b.score > 0 ? 1 : -1
          });
          sortList.map(_ => {
            _.user && (_.level = 2 + Math.floor((_.score - 2) / (levelUpLimit + 1)))
          });
          _this.setData({
            listScore: sortList 
          });
        }
      }
    })
  },
  onShareAppMessage (res) {
    let _shareId, _shareUser
    if (res.from === 'button') {
      _shareId = res.target && res.target.id
      _shareId && this.data.listScore.map(_ => {
        _.user && _.user._id == _shareId && (_shareUser = _.user);
      })
    }
    const user = getApp().globalData.user
    return {
      title: (_shareUser && user._id != _shareUser._id ? user.nickName + '携手' + _shareUser.nickName : user.nickName) + '邀你一起《眼疾手快》',
			path: '/page/game/canvas?id=' + user._id,
      success: (res) => {
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
          success: (res) => {}
        })
      },
      fail: (res) => { }
    }
  },
  sharePrevent() {
    if (wx.canIUse('button.open-type.share')) return
    wx.showModal({
      title: '温馨提示',
      content: '　　你所使用微信版本暂不支持直接分享，请点击右上角分享或更新微信。',
      showCancel: false
    });
  },
  onUnload() {
    ctx = null;
    endGameAction = null;
    endGame();
  },
  noop(e) { }
})
