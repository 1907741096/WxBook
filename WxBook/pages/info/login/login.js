var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  goreg: function () {
    wx.showModal({
      title: '权限设置',
      content: '是否允许小程序获取用户信息',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../reg/reg',
          })
        }
        if (res.cancel) {
          return;
        }
      }
    })
  },
  wxlogin: function () {
    var that=this;
    wx.showModal({
      title: '微信登录',
      content: '是否通过微信自动登录',
      success: function (res) {
        wx.showNavigationBarLoading();
        if (res.confirm) {
          wx.login({
            success: function (res) {
              var url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + app.globalData.appid + "&secret=" + app.globalData.secret + "&js_code=" + res.code + "&grant_type=authorization_code";
              util.http(url, that.processwxlogin, "GET");
            }
          })
        }
        if (res.cancel) {
          return;
        }
      }
    })
  },
  processwxlogin: function (res) {
    var url=app.globalData.http+"wxbook/api.php?c=user&a=getUserByOpenId&openid="+res.openid;
    util.http(url, this.processData, "GET");
  },
  processData:function(res){
    wx.setStorageSync('id', res.id);
    wx.switchTab({
      url: '../info',
    })
  },
  formSubmit: function (event) {
    var data = event.detail.value;
    if (data.username == '') {
      wx.showToast({
        title: '请输入账号',
        image: "/images/icon/x.png",
        duration: 1000
      })
      return;
    }
    if (data.password.length == '') {
      wx.showToast({
        title: '请输入密码',
        image: "/images/icon/x.png",
        duration: 1000
      })
      return;
    }
    var url = app.globalData.http + "wxbook/api.php?c=user&a=checkUser";
    util.http(url, this.loginResult, 'POST', data);
  },
  loginResult: function (data) {
    if (data.status == 0) {
      wx.showToast({
        title: data.message,
        image: "/images/icon/x.png",
        duration: 1000
      })
      return;
    }
    wx.showToast({
      title: '登陆成功',
      duration: 1000,
      success: function () {
        util.sleep(1000);
        wx.setStorageSync('id', data.id);
        wx.switchTab({
          url: '../info'
        })
      }
    })
  }
})