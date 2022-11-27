const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    AuthorizedLogin: '授权登录',
    UserPhone: '手机号授权',
    lee: "",
    flag: true
  },
  onLoad: function() {
    var that = this;
    // 查看是否授权
    //获取用户本地是否是第一次进入新版本
    var versions = wx.getStorageSync('versions');
    if (versions == '1') {
      wx.getSetting({
        success: function(res) {
          if (res.authSetting['scope.userInfo']) {
            //调用共通的登录方法
            app.util.getUserInfo(
              function(userinfo) {
                that.setData({
                  userinfo: userinfo
                })
              });
          } else {
            // 用户没有授权
            // 改变 isHide 的值，显示授权页面
            that.setData({
              isHide: true
            });
          }
        }
      });
    } else {
      // 用户没有授权
      // 改变 isHide 的值，显示授权页面
      that.setData({
        isHide: true
      });
    }

  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      let user = e.detail.userInfo;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(user);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.data.lee
      if (that.data.lee == '') {
        wx.showToast({
            icon: "none",
            title: '请继续点击获取手机号',
          }),
          that.setData({
            isHide: true,
            flag: (!that.data.flag),
            lee: true
          })
        that.wxlogin();
      } else if (!that.data.lee) {
        wx.switchTab({
          url: "/pages/about/home/home"
        })

      }
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },

  wxlogin: function() { //获取用户的openID

    var that = this;
    //调用共通的登录方法
    app.util.getUserInfo(
      function(userinfo) {
        that.setData({
          userinfo: userinfo
        })
      });

  },

  getPhoneNumber: function(e) { //点击获取手机号码按钮
    var that = this;
    that.data.lee
    if (that.data.lee == '') {
      wx.showToast({
        icon: "none",
        title: '请先点击获取用户信息',
      })
      return
    } else {
      wx.checkSession({
        success: function(res) {
          console.log(e.detail.errMsg)
          console.log(e.detail.iv)
          console.log(e.detail.encryptedData)
          var ency = e.detail.encryptedData;
          var iv = e.detail.iv;

          var sessionk = that.data.sessionKey;


          if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，部分功能无法使用!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function(res) {
                  // 用户没有授权成功，不需要改变 isHide 的值
                  if (res.confirm) {
                    wx.setStorageSync('enws', '1');
                    wx.switchTab({
                      url: "/pages/about/home/home"
                    })
                    console.log('用户点击了“返回授权”');
                  };
                }
              }),

              that.setData({

                modalstatus: true,

              });
          } else {
            that.setData({

              lee: false,

            });
            wx.switchTab({
              url: "/pages/about/home/home"
            })
            //同意授权
            var userinfo = wx.getStorageSync('userInfo');
            app.util.request({
              'url': 'entry/wxapp/saveusermobile',
              data: {
                sessionid: userinfo.sessionid,
                uid: userinfo.memberInfo.uid,
                iv: iv,
                encryptedData: ency
              },
              success: function(res) {
                if (res.data.data.error == 0) {
                  console.log('success' + res.data.data);
                  //用户已经进入新的版本，可以更新本地数据
                  wx.setStorageSync('versions', '1');
                  wx.setStorageSync('enws', '2');
                } else {
                  //用户保存手机号失败，下次进入继续授权手机号
                  wx.setStorageSync('enws', '1');
                  console.log('fail' + res.data.data);
                }
              },
              fail: function(res) {
                console.log('fail' + res);
              }
            });
          }
        },

        fail: function() {

          console.log("session_key 已经失效，需要重新执行登录流程");


          that.wxlogin(); //重新登录
        }

      });
    }

  }
})

