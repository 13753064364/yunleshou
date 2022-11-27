var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

let phone = ''
let dz = ''

const app = getApp()
Page({
  data: {
    tabs: ["进行中", "已完成", "已取件"],
    dzs:[],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  getList(type){
    let db = wx.cloud.database().collection('address')
    if(type == 1){
        db = db.orderBy('phone','asc') 
    }else if(type== -1){
        db = db.orderBy('phone','desc')
    }
    db.get().then(res=>{
        this.setData({
            dzs:res.data
        })
    }).catch(res=>{
     console.log("地址列表请求失败");
    })
 },
  onLoad: function (options) {
    this.getList(1)
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.setData({
      activeIndex: options.activeIndexData
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
  }
})

