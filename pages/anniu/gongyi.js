// pages/anniu/gongyi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: [
      'https://img0.baidu.com/it/u=2996731266,899583216&fm=253&fmt=auto&app=138&f=JPEG?w=991&h=437',
      'https://img0.baidu.com/it/u=2904789857,2237279494&fm=253&fmt=auto&app=138&f=JPEG?w=499&h=234',
      'https://img2.baidu.com/it/u=1306784319,3324381979&fm=253&fmt=auto&app=120&f=JPEG?w=640&h=321'


    ], //轮播图
    dateList: [],
        // 累计打卡
        accumulate: 0,
        // 连续打卡
        continuous: 0,
        // 日历天数
        days: [],
        date: {}

  },





  onLoad() {
    let date = this.getDate()
    this.setData({
        days: this.initCalendar(date),
        date
    })
},
/**
 * 初始化日历【核心方法】
 * @param {Date} date 日期参数
 */
initCalendar(yearMonth) {
    let days = []; // 用于保存最后生成的日历
    // 得到参数 date 的1号是星期几
    let firstDayOfWeek = this.getDayOfWeek(yearMonth.year, yearMonth.month, 1)
    console.log(firstDayOfWeek);
    // 得到当前月的天数
    let toMonthDays = this.getMonthDays(yearMonth.year, yearMonth.month)

    // 处理上月的年月日 以及 格子数
    if (firstDayOfWeek > 0) {
        let y = yearMonth.year
        let m = yearMonth.month
        if (m == 1) {
            y -= 1
            m = 12
        } else {
            m--
        }

        let upMonthDays = this.getMonthDays(y, m) // 得到上个月的天数
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push({
                ...this.createDayOption({
                    year: y,
                    month: m
                }, upMonthDays--),
                class: 'not-current-month'
            })
        }
        days.reverse()
    }

    // 处理当前月的格子数
    for (let i = 1; i <= toMonthDays; i++) {
        days.push(this.createDayOption(yearMonth, i))
    }

    // 处理下个月的年月以及格子数
    let d = 42 - days.length
    let ny = yearMonth.year
    let nm = yearMonth.month

    if (nm == 12) {
        ny += 1
        nm = 1
    } else {
        nm++
    }
    for (let i = 1; i <= d; i++) {
        days.push({
            ...this.createDayOption({
                year: ny,
                month: nm
            }, i),
            class: 'not-current-month'
        })
    }
    return days
},
// 切换日历
handleSwitchCalendar(e) {
    let type = e.currentTarget.dataset.type;
    if (type == 'up') {
        if (this.data.date.month == 1) {
            let y = this.data.date.year
            this.setData({
                ['date.month']: 12,
                ['date.year']: y -= 1
            })
        } else {
            let m = this.data.date.month
            this.setData({
                ['date.month']: m -= 1
            })
        }
    } else {
        if (this.data.date.month == 12) {
            let y = this.data.date.year
            this.setData({
                ['date.month']: 1,
                ['date.year']: y += 1
            })
        } else {
            let m = this.data.date.month
            this.setData({
                ['date.month']: m += 1
            })
        }
    }
    this.setData({
        days: this.initCalendar(this.data.date),
    })
    this.updateDays()
},
// 处理打卡
handlePunch(e) {
    let date = e.currentTarget.dataset.date
    console.log(date);
    let toDay = this.getDate()
    if (date.year <= toDay.year && date.month <= toDay.month) {
        if (date.active) return
        let arr = this.data.dateList
        arr.push(date)
        this.setData({
            dateList: arr
        })
        this.updateDays()
    } else {
        wx.showToast({
            icon: 'none',
            title: '日期超过了',
        })
    }
    this.handlePunchDays()
},
// 更新 days 状态
updateDays() {
    let days = this.data.days
    days.forEach(n => {
        n.active = this.data.dateList.some(s => n.year == s.year && n.month == s.month && n.date == s.date)
    })
    this.setData({
        days
    })
},
// 处理累计打卡和连续打卡
handlePunchDays() {
    // 累计打卡
    // 就是 dateList 的长度
    this.setData({
        accumulate: this.data.dateList.length
    })

    // 连续打卡
    let _count = 0;
    let arr = this.data.dateList
    // 再实际数据中，dateList 是不需要咱们手动排序的，我这边主要是用于测试，所以一些校验并未完善
    arr = arr.sort((a,b)=>{
        return Date.parse(`${a.year}/${a.month}/${a.date}`) - Date.parse(`${b.year}/${b.month}/${b.date}`)
    })
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
        //把时间转换为时间戳
        if (i != 0) {
            let newDate_ = Date.parse(`${arr[i].year}/${arr[i].month}/${arr[i].date}`); //当天
            let theOriginalTime_ = Date.parse(`${arr[i-1].year}/${arr[i-1].month}/${arr[i-1].date}`); //前一天
            //计算天
            let _day = parseInt(newDate_ - theOriginalTime_) / (1000 * 60 * 60);
            if (_day <= 24) {
                _count += 1;
            } else {
                _count = 0;
            }
        }
    }
    this.setData({
        continuous:_count != 0 ? _count + 1 : 0,
    })
},
// 1.得到指定月份有多少天
getMonthDays(year, month) {
    return new Date(year, month, 0).getDate()
},
// 2.得到月份指定天是星期几
getDayOfWeek(year, month, date) {
    // Date.UTC返回从1970的毫秒数
    return new Date(Date.UTC(year, month - 1, date)).getDay()
},
// 生成每一天日期参数
createDayOption(ym, d) {
    return {
        year: ym.year,
        month: ym.month,
        date: d
    }
},
// 返回指定年月日
getDate(time) {
    let caledar = time ? new Date(time) : new Date()
    let year = caledar.getFullYear()
    let month = caledar.getMonth() + 1
    let date = caledar.getDate()
    let h = caledar.getHours()
    let m = caledar.getMinutes()
    let s = caledar.getSeconds()
    let whichDay = caledar.getDay()
    return {
        year,
        month,
        date,
        h,
        m,
        s,
        whichDay
    }
}

})