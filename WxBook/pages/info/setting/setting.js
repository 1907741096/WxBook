var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    push: true,
    p: true,
    pushtime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('push') != null) {
      this.setData({
        push: wx.getStorageSync('push'),
        p: wx.getStorageSync('push'),
        pushtime: wx.getStorageSync('pushtime')
      })
    }
  },
  onUnload: function () {
    if (wx.getStorageSync('push') != this.data.push) {
      var push;
      if (wx.getStorageSync('push')){
        push=1;
      }else{
        push=0;
      }
      var url = app.globalData.http + 'wxbook/api.php?c=user&a=updateUserByPush&id=' + wx.getStorageSync('id') + '&push=' + push;
      wx.request({
        url: url,
      })
    }
    if (wx.getStorageSync('time') != this.data.time) {
      var url = app.globalData.http + 'wxbook/api.php?c=user&a=updateUserByTime&id=' + wx.getStorageSync('id') + '&time=' + wx.getStorageSync('pushtime');
      wx.request({
        url: url,
      })
    }
  },

  changepush: function (event) {
    var data = event.detail.value;
    wx.setStorageSync('push', data);
    this.setData({
      p: data
    })
  },

  radioChange: function (event) {
    var data = event.detail.value;
    wx.setStorageSync('pushtime', data);
  }
})