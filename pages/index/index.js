// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    address:'',
    name:'',
    longitude:'',
    latitude:'',
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://s1.ax1x.com/2022/07/13/jRh6zQ.png',
    }, {
      id: 1,
        type: 'image',
        url: 'https://www.hualigs.cn/image/62ac5a1ca8beb.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://s1.ax1x.com/2022/07/13/jRfO58.png'
  
    
    }],

    motto: 'Hello World',
    t1:'https://www.hualigs.cn/image/62ac59057b754.jpg',
    t2:'https://www.hualigs.cn/image/62ac5a1ca8beb.jpg',
    t5:'https://s1.ax1x.com/2022/07/11/jckJoT.jpg',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  

  map(v){
    var that = this;
    wx.chooseLocation({
      success: function (res) {
          console.log(res)
          that.setData({
            address: res.address,      //调用成功直接设置地址
            name: res.name,
            longitude: res.longitude,
            latitude: res.latitude,
        })
      }
     }),
     wx.showToast({
      title: '您附近暂无门店,请等待上线!',
      icon: 'success',
      duration: 2000
  })
     

  },
  onPageScroll:function(e){
    if(e.scrollTop<0){
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  gotoqiyewenhua:function(param){
    wx.navigateTo({
      url: '../../pages/qiyewenhua/qiyewenhua',
    })
  },
  gotojiage:function(param){
    wx.navigateTo({
      url: '../anniu/jiage',
    })
  },
  gotogz:function(param){
    wx.navigateTo({
      url: '../anniu/guizhe',
    })
  },
  gotogongyi:function(param){
    wx.navigateTo({
      url: '../anniu/gongyi',
    })
  },
  gotoaddress:function(param){
    wx.navigateTo({
      url: '../anniu/address',
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
  gotokefu:function(param){
    wx.navigateTo({
      url: '../anniu/kefu',
    })
  },
  tan:function(){
    wx.showModal({

      title: '我要加盟',
 
      content: '加盟热线：13753064364',
 
      success: function (res) {
 
        if (res.confirm) {//这里是点击了确定以后
 
          console.log('用户点击确定')
 
        } else {//这里是点击了取消以后
 
          console.log('用户点击取消')
 
        }
 
      }
 
    })
    
  },
  tan1:function(){
    wx.showModal({

      title: '联系客服',
 
      content: '客服微信：gjl18487047',
 
      success: function (res) {
 
        if (res.confirm) {//这里是点击了确定以后
 
          console.log('用户点击确定')
 
        } else {//这里是点击了取消以后
 
          console.log('用户点击取消')
 
        }
 
      }
 
    })
    
  },
  

})
