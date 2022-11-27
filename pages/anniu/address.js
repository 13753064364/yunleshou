// // pages/anniu/address.js

// let phone = ''
// let dz = ''

// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     dzs:[]
//   },
//   getList(type){
//     let db = wx.cloud.database().collection('address')
//     if(type == 1){
//         db = db.orderBy('phone','asc') 
//     }else if(type== -1){
//         db = db.orderBy('phone','desc')
//     }
//     db.get().then(res=>{
//         this.setData({
//             dzs:res.data
//         })
//     }).catch(res=>{
//      console.log("地址列表请求失败");
//     })
//  },
// go(){
//   this.getList(1)
// },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad(options) {
// // this.go()
// this.getList(1)
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady() {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow() {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide() {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload() {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh() {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom() {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage() {

//   }
// })

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

