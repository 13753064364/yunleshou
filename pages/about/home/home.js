Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    day: '',
        year: '',
        month: '',
        date: '2017-01',
        today: '',
        time:'',
        
        lastMonth:'',
        nextMonth:'',
        
        week: ['日', '一', '二', '三', '四', '五', '六'],
        calendar: {
          first: [],
          second: [],
          third: [],
          fourth: []
        },
        swiperMap: ['first', 'second', 'third', 'fourth'],
        swiperIndex: 1,
        showCaldenlar: false,


  },

  onChooseAvatar(e) {
    console.log(e.detail.avatarUrl)
  },
  getinit() { //初始化
    const date = new Date()
      , month = this.formatMonth(date.getMonth() + 1)
      , year = date.getFullYear()
      , day = this.formatDay(date.getDate())
      , today = `${year}-${month}-${day}`
      
    let calendar = this.generateThreeMonths(year, month)
    // console.log(calendar)
    
    // 上月
    let lastMonth=this.formatMonth(date.getMonth())
    // 下月
    let nextMonth=this.formatMonth(date.getMonth() + 2)

    this.setData({
      calendar,
      month,
      year,
      day,
      today,
      beSelectDate: today,
      date: `${year}-${month}`,
      
      lastMonth,
      nextMonth
    })
  },
  generateThreeMonths(year, month) {
    let { swiperIndex, swiperMap, calendar } = this.data
      , thisKey = swiperMap[swiperIndex]
      , lastKey = swiperMap[swiperIndex - 1 === -1 ? 3 : swiperIndex - 1]
      , nextKey = swiperMap[swiperIndex + 1 === 4 ? 0 : swiperIndex + 1]
      , time = this.countMonth(year, month)
    delete calendar[lastKey]
    calendar[lastKey] = this.generateAllDays(time.lastMonth.year, time.lastMonth.month)
    delete calendar[thisKey]
    calendar[thisKey] = this.generateAllDays(time.thisMonth.year, time.thisMonth.month)
    delete calendar[nextKey]
    calendar[nextKey] = this.generateAllDays(time.nextMonth.year, time.nextMonth.month)
    return calendar
  },
  bindDayTap(e) {
    let { month, year } = this.data
      , time = this.countMonth(year, month)
      , tapMon = e.currentTarget.dataset.month
      , day = e.currentTarget.dataset.day
    if (tapMon == time.lastMonth.month) {
      this.changeDate(time.lastMonth.year, time.lastMonth.month)
    } else if (tapMon == time.nextMonth.month) {
      this.changeDate(time.nextMonth.year, time.nextMonth.month)
    } else {
      this.setData({
        day
      })
    }
    // 回今天
    let bindDayTap = year + '-' + month + '-' + day;
    
    //发送事件监听
    this.triggerEvent('bindDayTap', bindDayTap);
    console.log(bindDayTap);


    let beSelectDate = e.currentTarget.dataset.date;
    this.setData({
      beSelectDate,
      showCaldenlar: false,
      bindDayTap
    })
    // console.log(beSelectDate)
  },
  bindDateChange(e) {
    if (e.detail.value === this.data.date) {
      return
    }

    const month = e.detail.value.slice(-2)
      , year = e.detail.value.slice(0, 4)

    this.changeDate(year, month)
  },
  prevMonth(e) {
    let { year, month } = this.data
      , time = this.countMonth(year, month)
    this.changeDate(time.lastMonth.year, time.lastMonth.month)
  },
  nextMonth(e) {
    let { year, month } = this.data
      , time = this.countMonth(year, month)
    this.changeDate(time.nextMonth.year, time.nextMonth.month)
  },
  /**
   * 
   * 直接改变日期
   * @param {any} year 
   * @param {any} month 
   */
  changeDate(year, month) {
    let { day, today } = this.data
      , calendar = this.generateThreeMonths(year, month)
      , date = `${year}-${month}`
    date.indexOf(today) === -1
      ? day = '01'
      : day = today.slice(-2)

    this.setData({
      calendar,
      day,
      date,
      month,
      year,
    })
  },
  /**
   * 
   * 月份处理
   * @param {any} year 
   * @param {any} month 
   * @returns 
   */
  countMonth(year, month) {
    let lastMonth = {
      month: this.formatMonth(parseInt(month) - 1)
    }
      , thisMonth = {
        year,
        month,
        num: this.getNumOfDays(year, month)
      }
      , nextMonth = {
        month: this.formatMonth(parseInt(month) + 1)
      }

    lastMonth.year = parseInt(month) === 1 && parseInt(lastMonth.month) === 12
      ? `${parseInt(year) - 1}`
      : year + ''
    lastMonth.num = this.getNumOfDays(lastMonth.year, lastMonth.month)
    nextMonth.year = parseInt(month) === 12 && parseInt(nextMonth.month) === 1
      ? `${parseInt(year) + 1}`
      : year + ''
    nextMonth.num = this.getNumOfDays(nextMonth.year, nextMonth.month)
    // console.log(nextMonth.month);
    return {
      lastMonth,
      thisMonth,
      nextMonth
    }
  },
  currentMonthDays(year, month) {
    const numOfDays = this.getNumOfDays(year, month)
    return this.generateDays(year, month, numOfDays)
  },
  /**
   * 生成上个月应显示的天
   * @param {any} year 
   * @param {any} month 
   * @returns 
   */
  lastMonthDays(year, month) {
    const lastMonth = this.formatMonth(parseInt(month) - 1)
      , lastMonthYear = parseInt(month) === 1 && parseInt(lastMonth) === 12
        ? `${parseInt(year) - 1}`
        : year
      , lastNum = this.getNumOfDays(lastMonthYear, lastMonth) //上月天数
    let startWeek = this.getWeekOfDate(year, month - 1, 1) //本月1号是周几
      , days = []
    if (startWeek == 7) {
      return days
    }

    const startDay = lastNum - startWeek

    return this.generateDays(lastMonthYear, lastMonth, lastNum, { startNum: startDay, notCurrent: true })
  },
  /**
   * 生成下个月应显示天
   * @param {any} year 
   * @param {any} month
   * @returns 
   */
  nextMonthDays(year, month) {
    const nextMonth = this.formatMonth(parseInt(month) + 1)
      , nextMonthYear = parseInt(month) === 12 && parseInt(nextMonth) === 1
        ? `${parseInt(year) + 1}`
        : year
      , nextNum = this.getNumOfDays(nextMonthYear, nextMonth)  //下月天数
    let endWeek = this.getWeekOfDate(year, month)						 //本月最后一天是周几
      , days = []
      , daysNum = 14
    // if (endWeek == 6) {
    //   return days
    // } else if (endWeek == 7) {
    //   daysNum = 6
    // } else {
    //   daysNum = 6 - endWeek
    // }
    return this.generateDays(nextMonthYear, nextMonth, daysNum, { startNum: 1, notCurrent: true })
  },
  /**
   * 
   * 生成一个月的日历
   * @param {any} year 
   * @param {any} month 
   * @returns Array
   */
  generateAllDays(year, month) {
    let lastMonth = this.lastMonthDays(year, month)
      , thisMonth = this.currentMonthDays(year, month)
      , nextMonth = this.nextMonthDays(year, month)
      , days = [].concat(lastMonth, thisMonth, nextMonth)
    // console.log("jin")
    // console.log(year, month, days)
    return days
  },
  /**
   * 
   * 生成日详情
   * @param {any} year 
   * @param {any} month 
   * @param {any} daysNum 
   * @param {boolean} [option={
   * 		startNum:1,
   * 		grey: false
   * 	}] 
   * @returns Array 日期对象数组
   */
  generateDays(year, month, daysNum, option = {
    startNum: 1,
    notCurrent: false
  }) {
    const weekMap = ['一', '二', '三', '四', '五', '六', '日']
    let days = []
    for (let i = option.startNum; i <= daysNum; i++) {
      let week = weekMap[new Date(year, month - 1, i).getUTCDay()]
      let day = this.formatDay(i)
      days.push({
        date: `${year}-${month}-${day}`,
        event: false,
        day,
        week,
        month,
        year
      })
    }
    return days
  },
  /**
   * 
   * 获取指定月第n天是周几		|
   * 9月第1天： 2017, 08, 1 |
   * 9月第31天：2017, 09, 0 
   * @param {any} year 
   * @param {any} month 
   * @param {number} [day=0] 0为最后一天，1为第一天
   * @returns number 周 1-7, 
   */
  getWeekOfDate(year, month, day = 0) {
    let dateOfMonth = new Date(year, month, 0).getUTCDay() + 1;
    dateOfMonth == 7 ? dateOfMonth = 0 : '';
    return dateOfMonth;
  },
  /**
   * 
   * 获取本月天数
   * @param {number} year 
   * @param {number} month 
   * @param {number} [day=0] 0为本月0最后一天的
   * @returns number 1-31
   */
  getNumOfDays(year, month, day = 0) {
    return new Date(year, month, day).getDate()
  },
  /**
   * 
   * 月份处理
   * @param {number} month 
   * @returns format month MM 1-12
   */
  formatMonth(month) {
    let monthStr = ''
    if (month > 12 || month < 1) {
      monthStr = Math.abs(month - 12) + ''
    } else {
      monthStr = month + ''
    }
    monthStr = `${monthStr.length > 1 ? '' : '0'}${monthStr}`
    return monthStr
  },
  formatDay(day) {
    return `${(day + '').length > 1 ? '' : '0'}${day}`
  },
  onReady: function () {
    this.getinit()
},

  





  methods: {
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      return e
    },
    CopyLink(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: res => {
          wx.showToast({
            title: '已复制',
            duration: 1000,
          })
        }
      })
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    //显示对话框
 showModal: function () {
  // 显示遮罩层
  var animation = wx.createAnimation({
   duration: 200,
   timingFunction: "linear",
   delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
   animationData: animation.export(),
   showModalStatus: true
  })
  setTimeout(function () {
   animation.translateY(0).step()
   this.setData({
   animationData: animation.export()
   })
  }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
  // 隐藏遮罩层
  var animation = wx.createAnimation({
   duration: 200,
   timingFunction: "linear",
   delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
   animationData: animation.export(),
  })
  setTimeout(function () {
   animation.translateY(0).step()
   this.setData({
   animationData: animation.export(),
   showModalStatus: false
   })
  }.bind(this), 200)
  }
 
, 
    showQrcode() {
      wx.previewImage({
        urls: ['https://image.weilanwl.com/color2.0/zanCode.jpg'],
        current: 'https://image.weilanwl.com/color2.0/zanCode.jpg' // 当前显示图片的http链接      
      })
    },
  }
})