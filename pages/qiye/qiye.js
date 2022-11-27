
let phone=''
let dz=''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dzs: []
  },

  // 获取用户输入商品名
  getPhone(e) {
    phone = e.detail.value
},
// 获取用户输入的价格
getAddress(e) {
    dz = e.detail.value
},
// 添加商品到数据库
addAddress() {
    if (phone == '') {
        wx.showToast({
            title: '手机号为空',
            icon: 'none'
        })
    } else if (dz == '') {
        wx.showToast({
            title: '地址为空',
            icon: 'none'
        })
    } else {
        // 发起添加操作
        wx.cloud.database().collection('address').add({
            data: {
                phone,
                dz,
            }
        }).then(res => {
            // 重新更新数据
            this.getList()
        }).catch(res => {
            console.log('添加失败', res);
        })
        wx.switchTab({
          url: '/pages/dingdan/dingdan',
        })
    }
},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})